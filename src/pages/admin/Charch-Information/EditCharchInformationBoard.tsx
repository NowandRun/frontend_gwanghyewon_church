import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { gql, useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import BlockToolbar from '../../../components/AdminComponents/BlockToolbar';
import { BoardBlock } from '../../../types/types';
import { useMe } from '../../../hooks/useMe';
import BoadBlockEditor from './Charch-Information-BlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';

// 1. 기존 게시글 조회를 위한 쿼리
const GET_CHARCH_BOARD_DETAIL = gql`
  query findCharchInformationBoardById($id: Float!) {
    findCharchInformationBoardById(id: $id) {
      ok
      error
      result {
        id
        title
        author
        thumbnailUrl
        blocks
      }
    }
  }
`;

// 2. 게시글 수정을 위한 뮤테이션
const EDIT_CHARCH_INFORMATION_BOARD = gql`
  mutation editCharchInformationBoard($input: EditCharchInformationBoardDto!) {
    editCharchInformationBoard(input: $input) {
      ok
      error
    }
  }
`;

export default function EditCharchInformationBoard() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: meData } = useMe();
  const [author, setAuthor] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [uploading, setUploading] = useState(false);

  // 데이터 불러오기
  const { data: boardData, loading: boardLoading } = useQuery(GET_CHARCH_BOARD_DETAIL, {
    variables: { id: Number(id) },
    skip: !id,
  });

  const [editBoard, { loading: editLoading }] = useMutation(EDIT_CHARCH_INFORMATION_BOARD);

  // ✅ S3 업로드 함수 추가 (에러 해결 포인트)
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

  // 데이터 초기화 및 본인 확인
  useEffect(() => {
    if (boardData?.findCharchInformationBoardById.ok) {
      const board = boardData.findCharchInformationBoardById.result;
      setTitle(board.title);
      setAuthor(board.author);

      if (meData?.me && board.author !== meData.me.nickname) {
        alert('본인만 수정할 수 있습니다.');
        navigate('/admin/charch-info');
        return;
      }

      const initialBlocks: BoardBlock[] = board.blocks.map((b: any) => ({
        id: uuid(),
        type: b.type.toLowerCase(),
        content: b.content || '',
        previewUrl: b.url || '',
        isThumbnail: b.url === board.thumbnailUrl,
        selected: false,
      }));
      setBlocks(initialBlocks);
    }
  }, [boardData, meData, navigate]);

  /* =============================
      블록 핸들러 (Create 로직과 동일하게 유지)
  ============================== */
  const addTextBlock = () =>
    setBlocks((prev) => [...prev, { id: uuid(), type: 'text', content: '', selected: false }]);

  const updateTextBlock = (blockId: string, content: string) => {
    setBlocks((prev) =>
      prev.map((b) => (b.id === blockId && b.type === 'text' ? { ...b, content } : b)),
    );
  };

  const addImageBlock = (files: FileList) => {
    const newBlocks: BoardBlock[] = Array.from(files).map((file) => ({
      id: uuid(),
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
      prev.map((b) => (b.type === 'image' ? { ...b, isThumbnail: b.id === id } : b)),
    );
  };

  const removeBlock = (blockId: string) => {
    setBlocks((prev) => {
      const target = prev.find((b) => b.id === blockId);
      if (target?.type === 'image' && target.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(target.previewUrl);
      }
      return prev.filter((b) => b.id !== blockId);
    });
  };

  const reorderBlocks = (activeId: string, overId: string) => {
    setBlocks((prev) => {
      const oldIndex = prev.findIndex((b) => b.id === activeId);
      const newIndex = prev.findIndex((b) => b.id === overId);
      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const replaceImageBlock = (blockId: string, input: File | FileList | File[]) => {
    const fileArray = input instanceof File ? [input] : Array.from(input);
    if (!fileArray.length) return;
    const newFile = fileArray[0];

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
  console.log('전송 데이터:', { id: Number(id), title, blocks });
  /* =============================
      제출 로직 (수정)
  ============================== */
  const onSubmit = async () => {
    try {
      setUploading(true);

      const finalBlocks = await Promise.all(
        blocks.map(async (block) => {
          if (block.type === 'text') {
            // 서버가 기대하는 TEXT 타입 필드만 추출
            return { type: 'TEXT', content: block.content };
          } else {
            const url = block.file ? await uploadImageToS3(block.file) : block.previewUrl;
            // 서버가 기대하는 IMAGE 타입 필드만 추출 (id, previewUrl 등 제외)
            return { type: 'IMAGE', url };
          }
        }),
      );

      // 썸네일 결정
      let finalThumbnailUrl = '';
      const thumbIdx = blocks.findIndex((b) => b.type === 'image' && b.isThumbnail);
      if (thumbIdx !== -1) {
        finalThumbnailUrl = (finalBlocks[thumbIdx] as any).url;
      } else {
        const firstImg = finalBlocks.find((b) => b.type === 'IMAGE');
        finalThumbnailUrl = (firstImg as any)?.url || '';
      }

      const result = await editBoard({
        variables: {
          input: {
            id: Number(id),
            title: title.trim(),
            // ⚠️ map을 통해 서버가 필요한 필드만 새 객체로 생성
            blocks: finalBlocks.map((b) => ({
              type: b.type,
              content: b.content || '',
              url: (b as any).url || '',
            })),
            thumbnailUrl: finalThumbnailUrl || null,
          },
        },
      });

      if (result.data?.editCharchInformationBoard.ok) {
        alert('수정되었습니다.');
        navigate('/admin/charch-info');
      } else {
        alert(result.data?.editCharchInformationBoard.error || '수정 실패');
      }
    } catch (e) {
      console.error(e);
      alert('오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

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
            onReplaceImage={replaceImageBlock}
            onToggleSelect={(blockId: string) => {
              setBlocks((prev) =>
                prev.map((b) => (b.id === blockId ? { ...b, selected: !b.selected } : b)),
              );
            }}
            onRemoveSelected={() => {
              setBlocks((prev) => prev.filter((b) => !b.selected));
            }}
          />
          <BlockToolbar
            onAddText={addTextBlock}
            onAddImage={addImageBlock}
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
                  alt=""
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
        disabled={editLoading || uploading}
      >
        {uploading ? '이미지 업로드 중...' : '수정 완료'}
      </SubmitButton>
    </Container>
  );
}

// 스타일 정의 (Create와 동일하게 유지)
const Container = styled.div`
  max-width: 100vw;
  margin: 0 auto;
  padding: 32px 24px 64px;
`;
const TwoColumnLayout = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
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
const PreviewSection = styled.div`
  background: #f9fafb;
  border-radius: 12px;
  padding: 24px;
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
