import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import ChurchInformationBlockToolbar from 'src/components/AdminComponents/ChurchInformationBlockToolbar';
import { BoardBlock, BoardType } from '../../../types/types';
import { useMe } from '../../../hooks/useMe';
import BoadBlockEditor from '../../../components/AdminComponents/AdminBoaderBlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';
import { CREATE_CHURCH_INFORMATION_BOARD_MUTATION } from 'src/types/grapql_call';

export default function CreateChurchInformationBoard() {
  const navigate = useNavigate();
  const { data: meData } = useMe();
  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [uploading, setUploading] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  // 🚀 누락되었던 이미지 교체 함수 정의
  const replaceImageBlock = (blockId: string, newFile: File) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== blockId || block.type !== 'image') return block;
        if (block.previewUrl.startsWith('blob:')) URL.revokeObjectURL(block.previewUrl);
        return {
          ...block,
          file: newFile,
          fileName: newFile.name,
          previewUrl: URL.createObjectURL(newFile),
        };
      }),
    );
  };

  const getSafeFileData = (file: File) => {
    const safeName = file.name.replace(/\s+/g, '-');
    const forbiddenChars = /[\\<>|^!*{}[\]"`~#()+=,;: @&]/;
    if (forbiddenChars.test(safeName)) {
      return { safeName, isValid: false, message: `파일명에 금지 특수문자가 있습니다.` };
    }
    return { safeName, isValid: true };
  };

  // 🚀 파일명 중복 체크 함수 (API를 통해 S3에 해당 경로/파일명이 있는지 확인)
  const checkFileExists = async (fileName: string): Promise<boolean> => {
    try {
      const response = await fetch(
        `http://localhost:4000/uploads/check-exists?fileName=${encodeURIComponent(
          fileName,
        )}&boardType=${BoardType.CHURCH_INFORMATION}`,
      );
      const data = await response.json();
      return data.exists; // true면 중복
    } catch (e) {
      return false;
    }
  };

  const uploadFileToS3 = async (file: File): Promise<string> => {
    const { safeName } = getSafeFileData(file);
    const formData = new FormData();
    formData.append('file', file, encodeURIComponent(safeName));
    formData.append('boardType', BoardType.CHURCH_INFORMATION);

    const response = await fetch('http://localhost:4000/uploads/file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error(`${file.name} 업로드 실패`);
    const data = await response.json();
    return data.url;
  };

  const [createBoard, { loading }] = useMutation(CREATE_CHURCH_INFORMATION_BOARD_MUTATION);

  /* --- 블록 및 파일 관리 로직 --- */
  const addImageBlock = (files: FileList) => {
    const newBlocks: BoardBlock[] = Array.from(files).map((file) => ({
      id: uuid(),
      type: 'image',
      file, // 실제 파일 객체 보관
      previewUrl: URL.createObjectURL(file),
      fileName: file.name,
      selected: false,
    }));
    setBlocks((prev) => [...prev, ...newBlocks]);
  };

  // 🚀 첨부 파일(하단) 선택 시 즉시 업로드하지 않고 리스트에 추가만 함
  const onAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    setPendingFiles((prev) => [...prev, ...files]);
    e.target.value = '';
  };

  const removePendingFile = (index: number) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  /* --- 제출 로직 --- */
  const onSubmit = async () => {
    if (!title.trim() || (!blocks.length && !pendingFiles.length)) {
      return alert('제목과 내용을 입력해주세요.');
    }

    try {
      setUploading(true);

      // 1. 파일명 중복 체크 (선택 사항: 전체 파일에 대해 확인)
      for (const file of pendingFiles) {
        const isDuplicate = await checkFileExists(file.name);
        if (isDuplicate) {
          if (!window.confirm(`'${file.name}' 파일이 이미 존재합니다. 덮어쓰시겠습니까?`)) {
            setUploading(false);
            return;
          }
        }
      }

      // 2. 에디터 내 이미지 블록들 업로드
      const finalBlocks = [];
      for (const block of blocks) {
        if (block.type === 'text') {
          finalBlocks.push({ type: 'TEXT', content: block.content });
        } else if (block.type === 'image' && block.file) {
          const url = await uploadFileToS3(block.file);
          finalBlocks.push({ type: 'IMAGE', url });
        }
      }

      // 3. 하단 일반 첨부 파일들 일괄 업로드
      const finalFileUrls = await Promise.all(pendingFiles.map((file) => uploadFileToS3(file)));

      // 4. 게시글 생성 Mutation 실행
      const result = await createBoard({
        variables: {
          input: {
            title: title.trim(),
            isPinned,
            blocks: finalBlocks,
            fileUrls: finalFileUrls, // 업로드 완료된 S3 URL들
          },
        },
      });

      if (result.data?.createChurchInformationBoard.ok) {
        alert('등록되었습니다.');
        navigate('/admin/church-info');
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Container>
      <h2>게시글 작성</h2>
      <TwoColumnLayout>
        <EditorSection>
          <HeaderToolRow>
            {meData?.me && (
              <AuthorBox>
                <span>작성자</span>
                <strong>{meData.me.nickname}</strong>
              </AuthorBox>
            )}
            <PinOption>
              <input
                type="checkbox"
                id="isPinned"
                checked={isPinned}
                onChange={(e) => setIsPinned(e.target.checked)}
              />
              <label htmlFor="isPinned">📌 중요 공지로 상단 고정</label>
            </PinOption>
          </HeaderToolRow>

          <EditorInput
            placeholder="제목을 입력하세요"
            ref={titleRef}
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />

          <BoadBlockEditor
            blocks={blocks}
            onReplaceImage={(id, input) => {
              const files = input instanceof File ? [input] : Array.from(input);
              if (files[0]) replaceImageBlock(id, files[0]); // 이제 정상 작동함
            }}
            onRemoveBlock={(id) => setBlocks((prev) => prev.filter((b) => b.id !== id))}
            onChangeText={(id, txt) =>
              setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: txt } : b)))
            }
            onReorder={(a, o) =>
              setBlocks((prev) =>
                arrayMove(
                  prev,
                  prev.findIndex((b) => b.id === a),
                  prev.findIndex((b) => b.id === o),
                ),
              )
            }
            onToggleSelect={(id: string) =>
              setBlocks((prev) =>
                prev.map((b) => (b.id === id ? { ...b, selected: !b.selected } : b)),
              )
            }
            onRemoveSelected={() => setBlocks((prev) => prev.filter((b) => !b.selected))}
          />

          <AttachmentSection>
            <label htmlFor="file-upload">📎 파일 첨부하기 (등록 시 업로드됨)</label>
            <input
              id="file-upload"
              type="file"
              multiple
              onChange={onAddFiles}
              style={{ display: 'none' }}
            />
            <FileList>
              {pendingFiles.map((file, i) => (
                <FileItem key={i}>
                  <span>{file.name} (대기 중)</span>
                  <button onClick={() => removePendingFile(i)}>삭제</button>
                </FileItem>
              ))}
            </FileList>
          </AttachmentSection>

          <ChurchInformationBlockToolbar
            onAddText={() =>
              setBlocks([...blocks, { id: uuid(), type: 'text', content: '', selected: false }])
            }
            onAddImage={addImageBlock}
          />
        </EditorSection>

        <PreviewSection>
          {isPinned && <NoticeBadge>공지사항</NoticeBadge>}
          <PreviewTitle>{title || '제목 없음'}</PreviewTitle>
          {blocks.map((block) =>
            block.type === 'image' ? (
              <PreviewImageCard key={block.id}>
                <img
                  src={block.previewUrl}
                  alt=""
                />
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
        disabled={loading || uploading}
      >
        {uploading ? '파일 업로드 및 저장 중...' : '등록하기'}
      </SubmitButton>
    </Container>
  );
}

/* --- 공통 스타일 (하단 Edit와 공유) --- */
const HeaderToolRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;

const PinOption = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  cursor: pointer;

  input {
    cursor: pointer;
    width: 16px;
    height: 16px;
  }
  label {
    cursor: pointer;
    font-size: 13px;
    font-weight: 600;
    color: #475569;
  }
`;

const NoticeBadge = styled.span`
  background: #fee2e2;
  color: #ef4444;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 700;
  width: fit-content;
`;

const Container = styled.div`
  max-width: 100vw;
  margin: 0 auto;
  padding: 32px 24px 64px;
  h2 {
    font-size: 22px;
    margin-bottom: 32px;
  }
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
const PreviewTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
  color: #111827;
`;
const PreviewImageCard = styled.div`
  display: flex;
  justify-content: center;
  img {
    width: 100%;
    border-radius: 8px;
  }
`;
const HtmlContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  width: 100%;
  overflow-wrap: break-word;
  table {
    width: 100%;
    border-collapse: collapse;
    table-layout: fixed;
  }
  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 10px;
    word-break: break-all;
  }
  p {
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
