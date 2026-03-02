import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { gql, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import BlockToolbar from '../../../components/AdminComponents/BlockToolbar';
import { BoardBlock } from '../../../types/types';
import { useMe } from '../../../hooks/useMe';
import BoadBlockEditor from './Charch-Information-BlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';

const CREATE_CHARCH_INFORMATION_BOARD = gql`
  mutation createCharchInformationBoard($input: CreateCharchInformationBoardDto!) {
    createCharchInformationBoard(input: $input) {
      ok
      error
    }
  }
`;

export default function CreateCharchInformationBoard() {
  const navigate = useNavigate();
  const { data: meData, loading: meLoading } = useMe();
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [uploading, setUploading] = useState(false);

  /* =============================
     S3 업로드
  ============================== */
  const uploadImageToS3 = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('boardType', 'CHARCH_INFORMATION');

    const response = await fetch('http://localhost:4000/uploads/image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error('이미지 업로드 실패');

    const data = await response.json();
    return data.url;
  };

  /* =============================
     GraphQL
  ============================== */
  const [createBoard, { loading }] = useMutation(CREATE_CHARCH_INFORMATION_BOARD);

  /* =============================
     블록 로직
  ============================== */

  const addTextBlock = () => {
    setBlocks((prev) => [...prev, { id: uuid(), type: 'text', content: '', selected: false }]);
  };

  const updateTextBlock = (blockId: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId && block.type === 'text' ? { ...block, content } : block,
      ),
    );
  };

  const addImageBlock = (files: FileList) => {
    const newBlocks: BoardBlock[] = Array.from(files).map((file) => ({
      id: crypto.randomUUID(),
      type: 'image',
      file,
      previewUrl: URL.createObjectURL(file),
      fileName: file.name,
      isThumbnail: false,
      selected: false,
    }));

    setBlocks((prev) => [...prev, ...newBlocks]);
  };

  const setThumbnail = (id: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.type === 'image' ? { ...block, isThumbnail: block.id === id } : block,
      ),
    );
  };

  const replaceImageBlock = (blockId: string, input: File | FileList | File[]) => {
    const fileArray = input instanceof File ? [input] : Array.from(input);
    if (!fileArray.length) return;

    const newFile = fileArray[0];

    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id !== blockId || block.type !== 'image') return block;

        URL.revokeObjectURL(block.previewUrl);

        return {
          ...block,
          file: newFile,
          fileName: newFile.name,
          previewUrl: URL.createObjectURL(newFile),
        };
      }),
    );
  };

  const reorderBlocks = (activeId: string, overId: string) => {
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === activeId);
      const newIndex = prev.findIndex((b) => b.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const removeBlock = (blockId: string) => {
    setBlocks((prev) => {
      const target = prev.find((b) => b.id === blockId);
      if (target?.type === 'image') {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((block) => block.id !== blockId);
    });
  };

  const toggleSelectBlock = (blockId: string) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === blockId ? { ...block, selected: !block.selected } : block)),
    );
  };

  const removeSelectedBlocks = () => {
    setBlocks((prev) =>
      prev.filter((block) => {
        if (block.selected) {
          if (block.type === 'image') {
            URL.revokeObjectURL(block.previewUrl);
          }
          return false;
        }
        return true;
      }),
    );
  };

  /* =============================
     제출
  ============================== */

  const onSubmit = async () => {
    if (meLoading) return;

    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      alert('제목을 입력해주세요.');
      return;
    }

    if (!blocks.length) {
      alert('내용을 입력해주세요.');
      return;
    }

    try {
      setUploading(true);

      // 🔥 1. 블록 정리 + 업로드
      const finalBlocks = [];

      for (const block of blocks) {
        if (block.type === 'text') {
          if (!block.content || !block.content.trim()) continue;

          finalBlocks.push({
            type: 'TEXT',
            content: block.content, // 🔥 HTML 그대로 보존
          });
        }

        if (block.type === 'image') {
          if (!block.file) continue;

          const uploadedUrl = await uploadImageToS3(block.file);

          finalBlocks.push({
            type: 'IMAGE',
            url: uploadedUrl,
          });
        }
      }

      if (!finalBlocks.length) {
        alert('내용이 비어 있습니다.');
        return;
      }

      // 🔥 2. 썸네일 처리
      const thumbnailBlock = finalBlocks.find((b) => b.type === 'IMAGE');

      // ✅ 여기!
      console.log('=== GraphQL 전송 데이터 ===');
      console.log({
        title: trimmedTitle,
        blocks: finalBlocks,
        thumbnailUrl: thumbnailBlock?.url ?? null,
      });
      console.log(JSON.stringify(finalBlocks, null, 2));

      const result = await createBoard({
        variables: {
          input: {
            title: trimmedTitle,
            blocks: finalBlocks,
            // 서버 스키마가 String! (필수)라면 null을 보내면 에러납니다.
            thumbnailUrl: thumbnailBlock?.url || 'default_image_url_or_empty_string',
          },
        },
      });

      console.log('mutation result:', result);

      if (result.errors?.length) {
        throw new Error(result.errors[0].message);
      }

      if (!result.data) {
        throw new Error('서버 응답이 없습니다.');
      }

      const response = result.data.createCharchInformationBoard;

      if (!response?.ok) {
        throw new Error(response?.error || '게시글 생성 실패');
      }

      alert('게시글이 등록되었습니다.');
      navigate('/admin/charch-info');
    } catch (error: any) {
      console.error(error);
      alert(error.message || '게시글 생성 실패');
    } finally {
      setUploading(false);
    }
  };

  /* =============================
     UI
  ============================== */

  return (
    <Container>
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

          <BlockToolbar
            onAddText={addTextBlock}
            onAddImage={addImageBlock}
            $hasThumbnail={blocks.some((b) => b.type === 'image' && b.isThumbnail)}
          />
        </EditorSection>

        {/* 미리보기 영역 */}
        <PreviewSection>
          {/* 작성자 미리보기 */}
          {meData?.me && (
            <PreviewAuthor>
              <span>작성자</span>
              <strong>{meData.me.nickname}</strong>
            </PreviewAuthor>
          )}

          {/* 제목 미리보기 */}
          {title && <PreviewTitle>{title}</PreviewTitle>}

          {/* 본문 미리보기 */}
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
      </TwoColumnLayout>

      <SubmitButton
        onClick={onSubmit}
        disabled={loading || uploading}
      >
        {uploading ? '이미지 업로드 중...' : loading ? '저장 중...' : '등록'}
      </SubmitButton>
    </Container>
  );
}

// pages/admin/Charch-Information/Charch-Information-Board-Create.tsx 하단
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

const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
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

const PreviewSection = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 24px;
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
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

const HtmlContent = styled.div`
  font-size: 14px;
  line-height: 1.6;

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
  }

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 10px;
    white-space: pre-wrap;
  }

  p {
    margin: 0;
    white-space: pre-wrap;
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
