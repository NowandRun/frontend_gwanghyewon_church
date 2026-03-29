import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import ChurchAlbumBlockToolbar from '../../../components/AdminComponents/ChurchInformationBlockToolbar';
import { BoardBlock, BoardType } from '../../../types/types';
import BoadBlockEditor from '../../../components/AdminComponents/AdminBoaderBlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';
import {
  EDIT_CHURCH_ALBUM_BOARD,
  FIND_CHURCH_ALBUM_BOARD_BY_ID_QUERY,
} from 'src/types/grapql_call';

import { useMe } from 'src/hooks/useMe';
import { PAGE_IDS, useTabConcurrency } from 'src/hooks/useTabConcurrency';

export default function EditChurchAlbumBoard() {
  useTabConcurrency(PAGE_IDS.CHURCH_ALBUM);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [author, setAuthor] = useState('');
  const titleRef = useRef<HTMLInputElement>(null);

  // 1. 현재 로그인한 내 정보 가져오기
  const { data: meData, loading: meLoading } = useMe();

  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [uploading, setUploading] = useState(false);

  // 🚀 fileUrls 상태 삭제됨

  const { data: boardData, loading: boardLoading } = useQuery(FIND_CHURCH_ALBUM_BOARD_BY_ID_QUERY, {
    variables: { id: Number(id) },
    skip: !id,
  });

  const [editBoard, { loading: editLoading }] = useMutation(EDIT_CHURCH_ALBUM_BOARD);

  // ✅ S3 업로드 함수 추가 (에러 해결 포인트)
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
    // 💡 포인트: 파일명을 굳이 encodeURIComponent 하지 않고
    // 새 File 객체를 만들어 safeName만 적용하는 것이 안정적입니다.
    const renamedFile = new File([file], safeName, { type: file.type });

    formData.append('file', renamedFile);
    formData.append('boardType', BoardType.CHURCH_ALBUM);

    try {
      const response = await fetch('http://localhost:4000/uploads/file', {
        method: 'POST',
        body: formData,
        // 💡 중요: Content-Type 헤더를 수동으로 설정하지 마세요.
        // 브라우저가 boundary를 포함해 자동으로 설정하게 두어야 합니다.
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || '서버 업로드 실패');
      }

      const data = await response.json();
      return data.url;
    } catch (error: any) {
      console.error('Upload Error:', error);
      throw error;
    }
  };
  // 데이터 초기화 및 본인 확인
  useEffect(() => {
    // 1. 데이터 로딩 중이거나 응답이 없는 경우 바로 종료
    if (meLoading || boardLoading) return;
    if (!boardData?.findChurchAlbumBoardById?.ok) return;

    const board = boardData.findChurchAlbumBoardById.result;
    const me = meData?.me;

    // 2. 권한 체크 (id 기반 비교)
    if (me && board) {
      const isAdmin = me.role === 'Admin' || me.role === 'SuperAdmin';
      const isOwner = board.user?.id && Number(me.id) === Number(board.user.id);

      if (!isAdmin && !isOwner) {
        alert('게시글 수정 권한이 없습니다.');
        navigate('/admin/church-album');
        return;
      }

      // 3. 필드 데이터 세팅
      setTitle(board.title || '');
      setAuthor(board.author || '');

      // 4. 블록 데이터 가공 (UI 블록용으로 변환)
      if (board.blocks) {
        const initialBlocks: BoardBlock[] = board.blocks.map((b: any) => {
          const isImage = b.type === 'IMAGE';
          return {
            id: uuid(),
            type: b.type.toLowerCase(), // 'TEXT' -> 'text'
            content: b.content || '',
            previewUrl: isImage ? b.url : '',
            fileName: isImage ? b.url.split('/').pop() : '',
            // 🚀 서버의 thumbnailUrl과 현재 블록의 url이 같으면 썸네일 활성화
            isThumbnail: isImage && b.url === board.thumbnailUrl,
            selected: false,
          };
        });
        setBlocks(initialBlocks);
      }
    }
  }, [boardData, boardLoading, meData, meLoading, navigate]);

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
          if (block.type === 'text') return { type: 'TEXT', content: block.content };
          const url = block.file ? await uploadFileToS3(block.file) : block.previewUrl;
          return { type: 'IMAGE', url };
        }),
      );

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
            blocks: finalBlocks,
            thumbnailUrl: finalThumbnailUrl,
            // 🚀 fileUrls: fileUrls 삭제
          },
        },
      });

      if (result.data?.editChurchAlbumBoard.ok) {
        alert('수정되었습니다.');
        navigate('/admin/church-album');
      } else {
        if (!finalThumbnailUrl) {
          alert('썸네일 이미지를 생성 또는 선택해주세요.');
        } else {
          alert(result.data?.editChurchAlbumBoard.error || '수정 실패');
        }
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
      {(uploading || editLoading) && (
        <LoadingOverlay>
          <Spinner />
          <LoadingText>데이터를 안전하게 저장하고 있습니다...</LoadingText>
          <span style={{ fontSize: '14px', opacity: 0.8 }}>잠시만 기다려 주세요.</span>
        </LoadingOverlay>
      )}
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

          <ChurchAlbumBlockToolbar
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
  font-size: 16px;
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
  }
`;
