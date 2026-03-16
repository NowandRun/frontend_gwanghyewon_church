import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import * as pdfjsLib from 'pdfjs-dist';
import { BoardBlock, BoardType } from '../../../types/types';
import BoadBlockEditor from '../../../components/AdminComponents/AdminBoaderBlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';
import {
  EDIT_CHURCH_BULLETIN_BOARD,
  FIND_CHURCH_BULLETIN_BOARD_BY_ID_QUERY,
} from 'src/types/grapql_call';
import ChurchBulletinBlockToolbar from 'src/components/AdminComponents/ChurchBulletinBlockToolbar';
import { useMe } from 'src/hooks/useMe';
// PDF Worker 설정
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function EditChurchBulletinBoard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const titleRef = useRef<HTMLInputElement>(null);

  const { data: meData, loading: meLoading } = useMe();
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [uploading, setUploading] = useState(false);

  // 기존 파일 URL (이미 서버에 있는 것)
  const [existingFileUrls, setExistingFileUrls] = useState<string[]>([]);
  // 새로 추가할 로컬 파일들
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const { data: boardData, loading: boardLoading } = useQuery(
    FIND_CHURCH_BULLETIN_BOARD_BY_ID_QUERY,
    { variables: { id: Number(id) }, skip: !id },
  );

  const [editBoard, { loading: editLoading }] = useMutation(EDIT_CHURCH_BULLETIN_BOARD);

  /* =============================
      헬퍼 함수 (S3 & PDF)
  ============================== */
  const getSafeFileData = (file: File) => {
    const safeName = file.name.replace(/\s+/g, '-');
    const forbiddenChars = /[\\<>|^!*{}[\]"`~#()+=,;: @&]/;
    if (forbiddenChars.test(safeName))
      return { safeName, isValid: false, message: '파일명에 특수문자가 포함되어 있습니다.' };
    return { safeName, isValid: true };
  };

  const uploadFileToS3 = async (file: File): Promise<string> => {
    const { safeName } = getSafeFileData(file);
    const formData = new FormData();
    formData.append('file', file, encodeURIComponent(safeName));
    formData.append('boardType', BoardType.CHURCH_BULLETIN);

    const response = await fetch('http://localhost:4000/uploads/file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('업로드 실패');
    const data = await response.json();
    return data.url;
  };

  const generatePdfThumbnail = async (file: File): Promise<File> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer, disableFontFace: true });
    const pdf = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.0 });
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    await page.render({ canvasContext: context, viewport: viewport, canvas: canvas }).promise;

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(new File([blob], `${file.name}_thumb.jpg`, { type: 'image/jpeg' }));
          else reject(new Error('Canvas to Blob failed'));
        },
        'image/jpeg',
        0.8,
      );
    });
  };

  /* =============================
      데이터 로드 (Effect)
  ============================== */
  useEffect(() => {
    if (meLoading || boardLoading) return;
    const response = boardData?.findChurchBulletinBoardById;
    if (!response?.ok) return;

    const board = response.result;
    const me = meData?.me;

    if (me && board) {
      const isAdmin = me.role === 'Admin' || me.role === 'SuperAdmin';
      const isOwner = Number(me.id) === Number(board.user?.id);

      if (!isOwner && !isAdmin) {
        alert('수정 권한이 없습니다.');
        navigate('/admin/church-bulletin');
        return;
      }

      setTitle(board.title || '');
      setAuthor(board.author || '');
      setExistingFileUrls(board.fileUrls || []);

      if (board.blocks) {
        const formattedBlocks = board.blocks.map((block: any) => ({
          id: uuid(),
          type: block.type.toLowerCase(),
          selected: false,
          content: block.content,
          previewUrl: block.url,
          fileName: block.url?.split('/').pop() || '',
          isThumbnail: block.type === 'IMAGE' && block.url === board.thumbnailUrl,
        }));
        setBlocks(formattedBlocks);
      }
    }
  }, [boardData, boardLoading, meData, meLoading, navigate]);

  /* =============================
      이벤트 핸들러
  ============================== */
  const onAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    for (const file of filesArray) {
      const { isValid, message } = getSafeFileData(file);
      if (!isValid) {
        alert(message);
        continue;
      }

      if (file.type === 'application/pdf') {
        try {
          const thumbFile = await generatePdfThumbnail(file);
          const newBlock: BoardBlock = {
            id: `pdf-${Date.now()}`,
            type: 'image',
            file: thumbFile,
            previewUrl: URL.createObjectURL(thumbFile),
            fileName: `${file.name}_thumb.jpg`,
            isThumbnail: blocks.length === 0,
            selected: false,
          };
          setBlocks((prev) => [...prev, newBlock]);
        } catch (err) {
          console.error('PDF 변환 에러:', err);
        }
      }
      setPendingFiles((prev) => [...prev, file]);
    }
    e.target.value = '';
  };

  const onSubmit = async () => {
    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (blocks.length === 0) return alert('내용을 추가해주세요.');

    try {
      setUploading(true);

      // 1. 새로 추가된 파일들 업로드
      const newUploadedUrls = await Promise.all(pendingFiles.map((f) => uploadFileToS3(f)));
      const finalFileUrls = [...existingFileUrls, ...newUploadedUrls];

      // 2. 블록 처리 (이미지 업로드 포함)
      const finalBlocks = [];
      let finalThumbnailUrl = '';

      for (const block of blocks) {
        if (block.type === 'image') {
          let url = block.previewUrl;
          if (block.file instanceof File) {
            url = await uploadFileToS3(block.file);
          }
          finalBlocks.push({ type: 'IMAGE', url });
          if (block.isThumbnail) finalThumbnailUrl = url;
        } else {
          finalBlocks.push({ type: 'TEXT', content: block.content || '' });
        }
      }

      // 3. 수정 요청
      const { data: result } = await editBoard({
        variables: {
          input: {
            id: Number(id),
            title: title.trim(),
            blocks: finalBlocks,
            thumbnailUrl:
              finalThumbnailUrl || (finalBlocks.find((b) => b.type === 'IMAGE') as any)?.url || '',
            fileUrls: finalFileUrls,
          },
        },
      });

      if (result?.editChurchBulletinBoard.ok) {
        alert('수정되었습니다.');
        navigate('/admin/church-bulletin');
      } else {
        alert(result?.editChurchBulletinBoard.error || '수정 중 오류 발생');
      }
    } catch (e: any) {
      alert(`에러: ${e.message}`);
    } finally {
      setUploading(false);
    }
  };

  // 나머지 핸들러 (reorder, remove 등)는 기존과 동일하게 유지...
  const updateTextBlock = (id: string, content: string) =>
    setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content } : b)));
  const setThumbnail = (id: string) =>
    setBlocks((prev) => prev.map((b) => ({ ...b, isThumbnail: b.id === id })));
  const removeBlock = (id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id));
  const reorderBlocks = (activeId: string, overId: string) =>
    setBlocks((prev) =>
      arrayMove(
        prev,
        prev.findIndex((b) => b.id === activeId),
        prev.findIndex((b) => b.id === overId),
      ),
    );

  if (boardLoading) return <Container>데이터 로딩 중...</Container>;

  return (
    <Container>
      <HeaderArea>
        <h2>게시글 수정</h2>
        <AuthorBox>
          <span>작성자:</span>
          <strong>{author || '정보 없음'}</strong>
        </AuthorBox>
      </HeaderArea>

      <TwoColumnLayout>
        <EditorSection>
          <EditorInput
            placeholder="제목"
            ref={titleRef}
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />

          <BoadBlockEditor
            blocks={blocks}
            onRemoveBlock={removeBlock}
            onChangeText={updateTextBlock}
            onReorder={reorderBlocks}
            onReplaceImage={() => {}} // 필요 시 구현
            onToggleSelect={(id: string) =>
              setBlocks((prev) =>
                prev.map((b) => (b.id === id ? { ...b, selected: !b.selected } : b)),
              )
            }
            onRemoveSelected={() => setBlocks((prev) => prev.filter((b) => !b.selected))}
          />

          <AttachmentSection>
            <label htmlFor="file-upload">📎 추가 파일 첨부</label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={onAddFiles}
              style={{ display: 'none' }}
            />
            <FileList>
              {/* 기존 파일 리스트 */}
              {existingFileUrls.map((url, i) => (
                <FileItem key={`old-${i}`}>
                  <FileNameText>{url.split('/').pop()}</FileNameText>
                  <button
                    onClick={() =>
                      setExistingFileUrls((prev) => prev.filter((_, idx) => idx !== i))
                    }
                  >
                    삭제
                  </button>
                </FileItem>
              ))}
              {/* 새로 추가된 파일 리스트 */}
              {pendingFiles.map((file, i) => (
                <FileItem key={`new-${i}`}>
                  <FileNameText>(신규) {file.name}</FileNameText>
                  <button
                    onClick={() => setPendingFiles((prev) => prev.filter((_, idx) => idx !== i))}
                  >
                    삭제
                  </button>
                </FileItem>
              ))}
            </FileList>
          </AttachmentSection>

          <ChurchBulletinBlockToolbar
            onAddImage={(files) => {
              const file = files[0];
              if (file) {
                setBlocks((prev) => [
                  ...prev,
                  {
                    id: uuid(),
                    type: 'image',
                    file,
                    previewUrl: URL.createObjectURL(file),
                    fileName: file.name,
                    isThumbnail: false,
                    selected: false,
                  },
                ]);
              }
            }}
            $hasThumbnail={blocks.some((b) => b.type === 'image' && b.isThumbnail)}
          />
        </EditorSection>

        <PreviewSection>
          <PreviewTitle>{title || '제목 없음'}</PreviewTitle>
          {blocks.map((block) =>
            block.type === 'image' ? (
              <PreviewImageCard key={block.id}>
                <img
                  src={block.previewUrl}
                  alt="preview"
                />
                <ThumbnailButton
                  $active={block.isThumbnail}
                  onClick={() => setThumbnail(block.id)}
                >
                  썸네일
                </ThumbnailButton>
              </PreviewImageCard>
            ) : (
              <HtmlContent
                key={block.id}
                dangerouslySetInnerHTML={{ __html: block.content || '' }}
              />
            ),
          )}
        </PreviewSection>
      </TwoColumnLayout>

      <SubmitButton
        onClick={onSubmit}
        disabled={editLoading || uploading}
      >
        {uploading ? '수정 중...' : '수정 완료'}
      </SubmitButton>
    </Container>
  );
}

// 🚀 파일명 표시를 위한 추가 스타일
const FileNameText = styled.span`
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin-right: 10px;
  color: #334155;
  font-weight: 500;
`;

// ... 기존 스타일 정의 동일 유지 ...

const Container = styled.div`
  max-width: 100vw;
  margin: 0 auto;
  padding: 32px 24px 64px;
`;
const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
`;
const HeaderArea = styled.div`
  margin-bottom: 24px;
  h2 {
    margin-bottom: 4px;
  }
`;
const AuthorBox = styled.div`
  display: flex;
  gap: 8px;
  font-size: 14px;
  color: #666;
  strong {
    color: #222;
  }
`;
const EditorSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const AttachmentSection = styled.div`
  margin-top: 20px;
  padding: 15px;
  border: 1px dashed #cbd5e1;
  border-radius: 8px;
  label {
    color: #2f80ed;
    cursor: pointer;
    font-weight: 600;
  }
`;
const FileList = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const FileItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  background: #f1f5f9;
  padding: 8px 12px;
  border-radius: 6px;
  button {
    color: #eb5757;
    border: none;
    background: none;
    cursor: pointer;
    font-weight: 600;
    flex-shrink: 0;
  }
`;
const PreviewSection = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const PreviewTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
`;
const PreviewImageCard = styled.div`
  position: relative;
  img {
    width: 100%;
    border-radius: 8px;
  }
`;
const ThumbnailButton = styled.button<{ $active?: boolean }>`
  position: absolute;
  top: 8px;
  right: 8px;
  background: ${({ $active }) => ($active ? '#2f80ed' : '#9ca3af')};
  color: white;
  border: none;
  padding: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
`;
const HtmlContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  width: 100%;
  overflow-wrap: break-word;
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    table-layout: fixed;
  }
  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 10px;
    white-space: pre-wrap;
    word-break: break-all;
    overflow: hidden;
  }
  p {
    margin: 0;
    white-space: pre-wrap;
    word-break: break-all;
  }
`;
const SubmitButton = styled.button`
  margin-top: 40px;
  width: 100%;
  height: 52px;
  background: #2f80ed;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  &:disabled {
    background: #cbd5e1;
  }
`;
