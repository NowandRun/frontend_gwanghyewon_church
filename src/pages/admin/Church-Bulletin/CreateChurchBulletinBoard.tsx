import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { arrayMove } from '@dnd-kit/sortable';
import { BoardBlock, BoardType } from '../../../types/types';
import { useMe } from '../../../hooks/useMe';
import BoadBlockEditor from '../../../components/AdminComponents/AdminBoaderBlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';
import { CREATE_CHURCH_BULLETIN_BOARD_MUTATION } from 'src/types/grapql_call';
import ChurchBulletinBlockToolbar from 'src/components/AdminComponents/ChurchBulletinBlockToolbar';
import * as pdfjsLib from 'pdfjs-dist';
import { PAGE_IDS, useTabConcurrency } from 'src/hooks/useTabConcurrency';

// (중요) legacy 빌드 혹은 표준 빌드에 따라 경로가 다를 수 있습니다.
// 대부분의 환경에서 아래 경로로 해결됩니다.
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export default function CreateChurchBulletinBoard() {
  useTabConcurrency(PAGE_IDS.CHURCH_BULLETIN); // 훅 호출만으로 적용
  const navigate = useNavigate();
  const { data: meData, loading: meLoading } = useMe();
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  /* =============================
      함수 로직 (CRUD 및 핸들러)
  ============================== */
  const updateTextBlock = (blockId: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId && block.type === 'text' ? { ...block, content } : block,
      ),
    );
  };

  const removeBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
  };

  const toggleSelectBlock = (blockId: string) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === blockId ? { ...block, selected: !block.selected } : block)),
    );
  };

  const removeSelectedBlocks = () => {
    setBlocks((prev) => prev.filter((block) => !block.selected));
  };

  const reorderBlocks = (activeId: string, overId: string) => {
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === activeId);
      const newIndex = prev.findIndex((b) => b.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const replaceImageBlock = (blockId: string, input: File | FileList | File[]) => {
    const file = input instanceof File ? input : input[0];
    if (!file) return;
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId && block.type === 'image'
          ? { ...block, file, previewUrl: URL.createObjectURL(file), fileName: file.name }
          : block,
      ),
    );
  };

  const addImageBlock = (files: FileList) => {
    const file = files[0];
    if (!file) return;
    const newBlock: BoardBlock = {
      id: `img-${Date.now()}`,
      type: 'image',
      file,
      previewUrl: URL.createObjectURL(file),
      fileName: file.name,
      isThumbnail: blocks.length === 0,
      selected: false,
    };
    setBlocks((prev) => [...prev, newBlock]);
  };

  const setThumbnail = (id: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.type === 'image' ? { ...block, isThumbnail: block.id === id } : block,
      ),
    );
  };

  /* =============================
      S3 & PDF 로직
  ============================== */
  const getSafeFileData = (file: File) => {
    const safeName = file.name.replace(/\s+/g, '-');
    const forbiddenChars = /[\\<>|^!*{}[\]"`~#()+=,;: @&]/;
    if (forbiddenChars.test(safeName))
      return { safeName, isValid: false, message: '파일명 특수문자 제한' };
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

  const onAddFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const filesArray = Array.from(e.target.files);

    // 1. PDF가 아닌 파일이 있는지 검사
    const hasNonPdf = filesArray.some((file) => file.type !== 'application/pdf');
    if (hasNonPdf) {
      alert('PDF 파일만 업로드 가능합니다.');
      e.target.value = ''; // input 초기화
      return;
    }

    const validPdfs: File[] = [];

    for (const file of filesArray) {
      const { isValid, message } = getSafeFileData(file);
      if (!isValid) {
        alert(message);
        continue; // 유효하지 않은 파일명은 건너뜀
      }

      // PDF 썸네일 생성 및 블록 추가
      try {
        const thumbFile = await generatePdfThumbnail(file);
        const newBlock: BoardBlock = {
          id: `pdf-${Date.now()}-${Math.random()}`, // ID 중복 방지용 랜덤값 추가
          type: 'image',
          file: thumbFile,
          previewUrl: URL.createObjectURL(thumbFile),
          fileName: `${file.name}_thumb.jpg`,
          isThumbnail: blocks.length === 0, // 첫 번째 파일이면 썸네일로 자동 지정
          selected: false,
        };
        setBlocks((prev) => [...prev, newBlock]);
        validPdfs.push(file); // 검증 완료된 원본 PDF만 배열에 추가
      } catch (err) {
        console.error(err);
        alert(`${file.name}의 썸네일을 생성하지 못했습니다.`);
      }
    }

    // 검증된 PDF 파일들만 상태에 추가
    setPendingFiles((prev) => [...prev, ...validPdfs]);
    e.target.value = '';
  };

  const generatePdfThumbnail = async (file: File): Promise<File> => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      // 워커가 로드되지 않았을 경우를 대비해 여기서 다시 한번 확인하거나
      // 로드 옵션을 추가할 수 있습니다.
      const loadingTask = pdfjsLib.getDocument({
        data: arrayBuffer,
        // 폰트가 깨질 경우를 대비한 옵션
        disableFontFace: true,
      });

      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1.0 }); // 1.5에서 1.0으로 조정 (속도 개선)
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d')!;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
        canvas: canvas, // 명시적 전달
      }).promise;

      return new Promise((resolve, reject) => {
        canvas.toBlob(
          (blob) => {
            if (blob) {
              resolve(new File([blob], `${file.name}_thumb.jpg`, { type: 'image/jpeg' }));
            } else {
              reject(new Error('Canvas to Blob conversion failed'));
            }
          },
          'image/jpeg',
          0.8,
        );
      });
    } catch (error) {
      console.error('PDF Thumbnail Error:', error);
      throw new Error('PDF 썸네일 생성에 실패했습니다. 파일 형식을 확인해주세요.');
    }
  };

  const [createBoard, { loading }] = useMutation(CREATE_CHURCH_BULLETIN_BOARD_MUTATION);

  const onSubmit = async () => {
    // 1. 유효성 검사 강화
    if (meLoading) return;
    if (!title.trim()) {
      alert('제목을 입력해주세요.');
      return;
    }
    // PDF 썸네일이 생성되어 blocks에 들어갔다면 blocks.length는 0이 아니어야 합니다.
    if (blocks.length === 0) {
      alert('내용(이미지 또는 텍스트)을 추가해주세요.');
      return;
    }

    try {
      setUploading(true);

      // 2. 원본 파일들(PDF 포함) S3 업로드
      // pendingFiles에 담긴 파일들을 먼저 업로드하여 URL 리스트를 만듭니다.
      const uploadedFileUrls = await Promise.all(pendingFiles.map((file) => uploadFileToS3(file)));

      let finalThumbnailUrl = '';
      const finalBlocks = [];

      // 3. 에디터 블록 처리
      for (const block of blocks) {
        if (block.type === 'image') {
          let url = '';
          // 썸네일용으로 생성된 blob File 객체가 있다면 업로드
          if (block.file instanceof File) {
            url = await uploadFileToS3(block.file);
          } else {
            // 이미 업로드된 URL이거나 previewUrl인 경우 (보통은 위에서 처리됨)
            url = block.previewUrl;
          }

          finalBlocks.push({ type: 'IMAGE', url });
          if (block.isThumbnail) finalThumbnailUrl = url;
        } else if (block.type === 'text') {
          finalBlocks.push({
            type: 'TEXT',
            content: (block as any).content || '',
          });
        }
      }

      // 4. 뮤테이션 실행
      const { data: resultData } = await createBoard({
        variables: {
          input: {
            title: title.trim(),
            blocks: finalBlocks,
            thumbnailUrl:
              finalThumbnailUrl || (finalBlocks.find((b) => b.type === 'IMAGE') as any)?.url || '',
            fileUrls: uploadedFileUrls,
          },
        },
      });

      const { ok, error } = resultData?.createChurchBulletinBoard || {};

      if (ok) {
        alert('저장되었습니다.');
        // 성공 시 페이지 이동
        navigate('/admin/church-bulletin');
      } else {
        alert(error || '서버 저장 중 오류가 발생했습니다.');
      }
    } catch (error: any) {
      console.error('제출 에러 상세:', error);
      alert(`제출 중 에러 발생: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      {(uploading || loading) && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>데이터를 안전하게 저장하고 있습니다...</LoadingText>
          <span style={{ fontSize: '14px', opacity: 0.8 }}>잠시만 기다려 주세요.</span>
        </LoadingOverlay>
      )}
      <h2>게시글 작성</h2>
      <TwoColumnLayout>
        {/* 작성 영역 */}
        <EditorSection>
          {meData?.me && (
            <AuthorBox>
              <span>작성자</span>
              <strong>{meData.me.nickname}</strong>
            </AuthorBox>
          )}

          <EditorInput
            placeholder="제목"
            ref={titleRef}
            value={title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
          />

          <BoadBlockEditor
            blocks={blocks}
            onReplaceImage={replaceImageBlock}
            onRemoveBlock={removeBlock}
            onChangeText={updateTextBlock}
            onToggleSelect={toggleSelectBlock}
            onRemoveSelected={removeSelectedBlocks}
            onReorder={reorderBlocks}
          />

          <AttachmentSection>
            <label htmlFor="file-upload">📎 파일 첨부하기 (현재 {pendingFiles.length}개)</label>
            <input
              id="file-upload"
              type="file"
              multiple
              accept="application/pdf"
              onChange={onAddFiles}
              style={{ display: 'none' }}
            />
            <FileList>
              {pendingFiles.map((file, i) => (
                <FileItem key={i}>
                  <span>{file.name}</span>
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
            onAddImage={addImageBlock}
            $hasThumbnail={blocks.some((b) => b.type === 'image' && b.isThumbnail)}
          />
        </EditorSection>{' '}
        {/* 🚀 닫는 태그 추가됨 */}
        {/* 미리보기 영역 */}
        <PreviewSection>
          {meData?.me && (
            <PreviewAuthor>
              <span>작성자</span>
              <strong>{meData.me.nickname}</strong>
            </PreviewAuthor>
          )}
          {title && <PreviewTitle>{title}</PreviewTitle>}
          {blocks.map((block) =>
            block.type === 'image' ? (
              <PreviewImageCard key={block.id}>
                <img
                  src={block.previewUrl}
                  alt={block.fileName}
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
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            ),
          )}
        </PreviewSection>
      </TwoColumnLayout>{' '}
      {/* 🚀 닫는 태그 추가됨 */}
      <SubmitButton
        onClick={onSubmit}
        disabled={loading || uploading}
      >
        {uploading ? '파일 업로드 및 저장 중..' : '등록'}
      </SubmitButton>
    </Container>
  );
}

/* =============================
    Styled Components (컴포넌트 밖)
============================== */
const Container = styled.div`
  max-width: 100vw;
  margin: 0 auto;
  padding: 32px 24px 64px;
  h2 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 32px;
  }
`;

/* --- 로딩 오버레이 스타일 --- */
const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5); // 화면 블럭 처리 (반투명 검정)
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999; // 최상단에 위치
  color: white;
  gap: 20px;
`;

const Spinner = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.p`
  font-size: 18px;
  font-weight: 600;
  margin: 0;
`;

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  gap: 40px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
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
  font-size: 13px;
  background: #fff;
  padding: 5px 10px;
  border-radius: 4px;
  button {
    color: #eb5757;
    border: none;
    background: none;
    cursor: pointer;
  }
`;

const PreviewSection = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 20px;
  min-height: 500px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AuthorBox = styled.div`
  display: flex;
  gap: 8px;
  font-size: 14px;
`;
const PreviewAuthor = styled.div`
  display: flex;
  gap: 8px;
  font-size: 13px;
  color: #6b7280;
  strong {
    font-weight: 600;
    color: #111827;
  }
`;
const PreviewTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  margin-top: 8px;
`;
const PreviewImageCard = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
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
  font-size: 16px;
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
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
    cursor: not-allowed;
  }
`;
