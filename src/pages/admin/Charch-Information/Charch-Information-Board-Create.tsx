// pages/admin/Charch-Information/Charch-Information-Board-Create.tsx
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';

import { CREATE_CHARCH_INFORMATION_BOARD } from '../../../gql/mutations/docs';
import EditorInput from '../../../components/AdminComponents/EditorInput';
import BlockToolbar from '../../../components/AdminComponents/BlockToolbar';
import { BoardBlock } from '../../../types/types';
import { useMe } from '../../../hooks/useMe';
import BoadBlockEditor from './Charch-Information-BlockEditor';

export default function CreateCharchInformationBoard() {
  const navigate = useNavigate();
  const { data: meData, loading: meLoading } = useMe();
  const titleRef = useRef<any>(null);

  const [blocks, setBlocks] = useState<BoardBlock[]>([]);

  const [createBoard, { loading }] = useMutation(CREATE_CHARCH_INFORMATION_BOARD, {
    onCompleted: () => {
      alert('게시글이 등록되었습니다.');
      navigate('/admin/charch-info');
    },
  });

  const addTextBlock = () => {
    setBlocks((prev) => [...prev, { id: uuid(), type: 'text', content: '' }]);
  };

  const updateTextBlock = (blockId: string, content: string) => {
    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId && block.type === 'text' ? { ...block, content } : block,
      ),
    );
  };
  const addImageBlock = (file: File) => {
    const previewUrl = URL.createObjectURL(file);
    setBlocks((prev) => [
      ...prev,
      {
        id: uuid(),
        type: 'image',
        file,
        previewUrl,
      },
    ]);
  };

  const replaceImageBlock = (blockId: string, file: File) => {
    const previewUrl = URL.createObjectURL(file);

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === blockId && block.type === 'image'
          ? {
              ...block,
              file,
              previewUrl,
            }
          : block,
      ),
    );
  };

  const removeBlock = (blockId: string) => {
    setBlocks((prev) => prev.filter((block) => block.id !== blockId));
  };

  const onSubmit = async () => {
    const title = titleRef.current?.value?.trim();

    if (meLoading) return;
    if (!meData) {
      alert('로그인이 필요합니다.');
      return;
    }

    if (!title || blocks.length === 0) {
      alert('모든 항목을 입력해주세요.');
      return;
    }

    /**
     * 🔥 여기서 실제로는
     * image block → S3 업로드
     * text block → 그대로 저장
     */
    const parsedBlocks = await Promise.all(
      [...blocks].reverse().map(async (block) => {
        if (block.type === 'image') {
          return {
            type: 'image',
            url: block.previewUrl,
          };
        }
        return block;
      }),
    );

    await createBoard({
      variables: {
        input: {
          title,
          blocks: parsedBlocks,
          thumbnailUrl: parsedBlocks.find((b) => b.type === 'image'),
        },
      },
    });
  };

  return (
    <Container>
      <h2>게시글 작성</h2>
      {meData?.me && (
        <AuthorBox>
          <span>작성자</span>
          <strong>{meData.me.nickname}</strong>
        </AuthorBox>
      )}
      <EditorInput
        placeholder="제목"
        ref={titleRef}
      />
      <BoadBlockEditor
        blocks={blocks}
        onReplaceImage={replaceImageBlock}
        onRemoveBlock={removeBlock}
        onChangeText={updateTextBlock}
      />
      <BlockToolbar
        onAddText={addTextBlock}
        onAddImage={addImageBlock}
      />

      <SubmitButton
        onClick={onSubmit}
        disabled={loading}
      >
        {loading ? '저장 중...' : '등록'}
      </SubmitButton>
    </Container>
  );
}

// pages/admin/Charch-Information/Charch-Information-Board-Create.tsx 하단

const Container = styled.div`
  max-width: 980px;
  margin: 0 auto;
  padding: 32px 24px 64px;

  background: #ffffff;

  h2 {
    font-size: 22px;
    font-weight: 700;
    margin-bottom: 24px;
    color: #1f2937;
  }

  /* 제목 / 작성자 입력 간격 */
  > * + * {
    margin-top: 16px;
  }

  @media (max-width: 768px) {
    padding: 24px 16px 48px;
  }
`;

const AuthorBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  font-size: 14px;
  color: #374151;

  strong {
    font-weight: 600;
    color: #111827;
  }
`;

const SubmitButton = styled.button`
  margin-top: 32px;
  width: 100%;
  height: 52px;

  background-color: #2f80ed;
  color: #ffffff;

  font-size: 16px;
  font-weight: 600;
  letter-spacing: -0.2px;

  border: none;
  border-radius: 10px;
  cursor: pointer;

  transition:
    background-color 0.2s ease,
    transform 0.1s ease,
    box-shadow 0.1s ease;

  &:hover:not(:disabled) {
    background-color: #1c66d6;
    box-shadow: 0 6px 14px rgba(47, 128, 237, 0.25);
    transform: translateY(-1px);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 4px 10px rgba(47, 128, 237, 0.2);
  }

  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
    box-shadow: none;
  }
`;
