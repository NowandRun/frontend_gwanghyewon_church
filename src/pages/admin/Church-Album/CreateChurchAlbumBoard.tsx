import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import ChurchAlbumBlockToolbar from '../../../components/AdminComponents/ChurchInformationBlockToolbar';
import { BoardBlock, BoardType } from '../../../types/types';
import { useMe } from '../../../hooks/useMe';
import BoadBlockEditor from '../../../components/AdminComponents/AdminBoaderBlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';
import { CREATE_CHURCH_ALBUM_BOARD_MUTATION } from 'src/types/grapql_call';

export default function CreateChurchAlbumBoard() {
  const navigate = useNavigate();
  const { data: meData, loading: meLoading } = useMe();
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');

  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [uploading, setUploading] = useState(false);

  // 1. 가공 및 검증 함수 업데이트
  const getSafeFileData = (
    file: File,
  ): { safeName: string; isValid: boolean; message?: string } => {
    // 공백을 하이픈(-)으로 치환 (연속된 공백도 하나로 치환)
    const safeName = file.name.replace(/\s+/g, '-');

    // 치환된 이름에서 나머지 금지 특수문자 체크 (공백 제외됨)
    const forbiddenChars = /[\\<>|^!*{}[\]"`~#()+=,;: @&]/;

    if (forbiddenChars.test(safeName)) {
      return {
        safeName,
        isValid: false,
        message: `파일명에 허용되지 않는 특수문자가 있습니다.\n\n사용 불가: [ / \\ < > | ^ ! * { } [ ] " \` ~ # ( ) + = , ; : @ & ]`,
      };
    }

    if (safeName.includes('..')) {
      return {
        safeName,
        isValid: false,
        message: '파일명에 마침표를 연속(..)으로 사용할 수 없습니다.',
      };
    }

    return { safeName, isValid: true };
  };

  // 2. S3 업로드 함수 수정 (이름 전달 방식 변경)
  const uploadFileToS3 = async (file: File): Promise<string> => {
    const { safeName, isValid, message } = getSafeFileData(file);

    if (!isValid) {
      throw new Error(message);
    }

    const formData = new FormData();
    const encodedName = encodeURIComponent(safeName);
    formData.append('file', file, encodedName);
    formData.append('boardType', BoardType.CHURCH_ALBUM);

    const response = await fetch('http://localhost:4000/uploads/file', {
      method: 'POST',
      body: formData,
    });

    // 🚀 [수정] 서버에서 보낸 구체적인 에러 메시지 처리
    if (!response.ok) {
      const errorData = await response.json();
      // NestJS의 경우 보통 errorData.message에 에러 내용이 담깁니다.
      throw new Error(errorData.message || '파일 업로드에 실패했습니다.');
    }

    const data = await response.json();
    return data.url;
  };
  /* =============================
     GraphQL
  ============================== */
  const [createBoard, { loading }] = useMutation(CREATE_CHURCH_ALBUM_BOARD_MUTATION);

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
    // 현재 이미지 블록이 하나도 없는지 확인
    const noImagesYet = !blocks.some((b) => b.type === 'image');

    const newBlocks: BoardBlock[] = Array.from(files).map((file, index) => ({
      id: crypto.randomUUID(),
      type: 'image',
      file,
      previewUrl: URL.createObjectURL(file),
      fileName: file.name,
      // 처음 올리는 파일들 중 첫 번째 파일만 썸네일로 자동 지정 (나중에 변경 가능)
      isThumbnail: noImagesYet && index === 0,
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
      const finalBlocks = [];
      let finalThumbnailUrl = '';

      for (const block of blocks) {
        if (block.type === 'text') {
          if (!block.content?.trim()) continue;
          finalBlocks.push({ type: 'TEXT', content: block.content });
        }
        if (block.type === 'image') {
          const url = block.file ? await uploadFileToS3(block.file) : block.previewUrl;
          finalBlocks.push({ type: 'IMAGE', url });
          if (block.isThumbnail) finalThumbnailUrl = url;
        }
      }

      if (!finalThumbnailUrl) {
        const firstImage = finalBlocks.find((b) => b.type === 'IMAGE');
        finalThumbnailUrl = (firstImage as any)?.url || '';
      }

      const result = await createBoard({
        variables: {
          input: {
            title: title.trim(),
            blocks: finalBlocks,
            thumbnailUrl: finalThumbnailUrl,
            // 🚀 fileUrls 필드 없음 확인
          },
        },
      });

      // ✅ 핵심 수정 부분: 서버 응답 결과에 따른 분기 처리
      const { ok, error } = result.data?.createChurchAlbumBoard || {};

      if (ok) {
        alert('게시글이 성공적으로 처리되었습니다.');
        navigate('/admin/church-album');
      } else {
        // 서버에서 전달한 구체적인 에러 메시지(error)를 보여줍니다.
        if (!finalThumbnailUrl) {
          alert('썸네일 이미지를 생성 또는 선택해주세요.');
          return;
        } else {
          alert(`저장 실패: ${error || '알 수 없는 에러가 발생했습니다.'}`);
        }
      }
    } catch (error: any) {
      // 네트워크 에러나 런타임 에러 발생 시
      console.error('상세 에러 로그:', error);
      alert(`시스템 오류: ${error.message || '서버와 통신 중 문제가 발생했습니다.'}`);
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

          <ChurchAlbumBlockToolbar
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
  font-size: 12px;
  padding: 4px 8px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
`;

const HtmlContent = styled.div`
  font-size: 14px;
  line-height: 1.6;

  // 1. 컨테이너 밖으로 나가는 것 방지
  width: 100%;
  overflow-wrap: break-word;

  table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    /* ✅ 핵심: 표의 너비를 고정하고 셀 너비를 균등하게 배분하거나 지정된 대로 유지함 */
    table-layout: fixed;
  }

  th,
  td {
    border: 1px solid #e5e7eb;
    padding: 10px;
    white-space: pre-wrap;
    /* ✅ 핵심: 긴 영문/숫자도 강제로 줄바꿈되도록 설정 */
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
