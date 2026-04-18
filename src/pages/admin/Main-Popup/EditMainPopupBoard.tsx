import React, { useRef, useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { BoardBlock, BoardType } from '../../../types/types';
import BoadBlockEditor from '../../../components/AdminComponents/AdminBoaderBlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';
import { PAGE_IDS, useTabConcurrency } from '../../../hooks/useTabConcurrency';
import { EDIT_MAIN_POPUP_BOARD, FIND_MAIN_POPUP_BOARD_BY_ID_QUERY } from '../../../types/grapql_call';
import { useMe } from '../../../hooks/useMe';

export default function EditMainPopupBoard() {
  useTabConcurrency(PAGE_IDS.CHURCH_MAIN_POPUP);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const titleRef = useRef<HTMLInputElement>(null);
  const landscapeInputRef = useRef<HTMLInputElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);

  const { data: meData } = useMe();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data: boardData, loading: boardLoading } = useQuery(FIND_MAIN_POPUP_BOARD_BY_ID_QUERY, {
    variables: { id: Number(id) },
    skip: !id,
  });

  const [editBoard, { loading: editLoading }] = useMutation(EDIT_MAIN_POPUP_BOARD);

  const isImageBlock = (block: BoardBlock): block is Extract<BoardBlock, { type: 'image' }> => {
    return block.type === 'image';
  };

  /* =============================
      데이터 초기화
  ============================== */
  useEffect(() => {
  // meData와 boardData가 모두 로드되었을 때만 실행
  if (meData?.me && boardData?.findMainPopupBoardById?.result) {
    const board = boardData.findMainPopupBoardById.result;
    const me = meData.me;

    // 1. 작성자 본인인지 확인 (ID 값을 모두 숫자로 변환하여 비교)
    // board.authorId가 없을 경우를 대비해 board.user?.id 등도 체크하는 것이 안전합니다.
    const boardAuthorId = board.authorId || board.user?.id;
    const isAuthor = Number(boardAuthorId) === Number(me.id);

    // 2. 관리자 권한 확인 (대소문자 무관하게 비교)
    const userRole = (me.role as string)?.toUpperCase();
    const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';

    if (!isAuthor && !isAdmin) {
      alert("수정 권한이 없습니다.");
      navigate(-1);
    }
  }
}, [meData, boardData, navigate]);
  
  useEffect(() => {
    if (boardLoading || !boardData?.findMainPopupBoardById?.ok) return;

    const board = boardData.findMainPopupBoardById.result;
    setTitle(board.title || '');
    setAuthor(board.author || '');

    if (board.blocks) {
      const initialBlocks: BoardBlock[] = [];
      if (board.blocks.landscape?.url) {
        initialBlocks.push({
          id: 'landscape',
          type: 'image',
          previewUrl: board.blocks.landscape.url,
          fileName: board.blocks.landscape.fileName,
          selected: false,
        } as BoardBlock);
      }
      if (board.blocks.portrait?.url) {
        initialBlocks.push({
          id: 'portrait',
          type: 'image',
          previewUrl: board.blocks.portrait.url,
          fileName: board.blocks.portrait.fileName,
          selected: false,
        } as BoardBlock);
      }
      setBlocks(initialBlocks);
    }
  }, [boardData, boardLoading]);

  /* =============================
      파일 업로드 및 핸들러
  ============================== */
  const getSafeFileData = (
    file: File,
  ): { safeName: string; isValid: boolean; message?: string } => {
    // 공백을 하이픈(-)으로 치환 (연속된 공백도 하나로 치환)
    const safeName = file.name.replace(/\s+/g, '-');

    // 금지 특수문자 체크
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

    // 2. 서버에 파일 중복 여부 확인
    const checkFileExists = async (fileName: string): Promise<boolean> => {
      try {
        const response = await fetch(
          `http://localhost:4000/uploads/check-exists?fileName=${encodeURIComponent(
            fileName,
          )}&boardType=${BoardType.CHURCH_MAIN_POPUP}`,
        );
        const data = await response.json();
        return data.exists; // true면 중복
      } catch (e) {
        return false;
      }
    };


  const uploadFileToS3 = async (
    file: File,
    orientation: 'landscape' | 'portrait',
  ): Promise<string> => {
    const { safeName, isValid, message } = getSafeFileData(file);
    if (!isValid) throw new Error(message);

    const formData = new FormData();
    // 🚀 [수정 포인트 1] File 객체를 강제로 재포장하지 않고 원본 파일 객체를 그대로 넘깁니다.
    // 🚀 [수정 포인트 2] 한글 깨짐 방지를 위해 파일명을 encodeURIComponent로 안전하게 변환하여 3번째 인자로 전달합니다.
    formData.append('file', file, encodeURIComponent(safeName));
    
    // (선택) 백엔드에서 req.file 접근 외에도 쉽게 원본명을 조회할 수 있도록 텍스트 필드로도 하나 넘겨줍니다.
    formData.append('originalFileName', encodeURIComponent(file.name));

    formData.append('boardType', BoardType.CHURCH_MAIN_POPUP);
    formData.append('subPath', orientation);

    const response = await fetch('http://localhost:4000/uploads/file', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) throw new Error(`${file.name} 업로드 실패`);
    const data = await response.json();
    return data.url;
  };

  const addSpecificImage = (files: FileList, orientation: 'landscape' | 'portrait') => {
    if (files.length === 0) return;
    const file = files[0];
    const previewUrl = URL.createObjectURL(file);

    const newBlock: BoardBlock = {
      id: orientation,
      type: 'image',
      file,
      previewUrl,
      fileName: `[${orientation === 'landscape' ? 'NEW 가로' : 'NEW 세로'}] ${file.name}`,
      selected: false,
    };

    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== orientation);
      return [...filtered, newBlock];
    });
  };

  const handleReplaceImage = (id: string, files: FileList | File[]) => {
    const file = files instanceof FileList ? files[0] : files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    const orientation = id as 'landscape' | 'portrait';

    setBlocks((prev) =>
      prev.map((block) =>
        block.id === id
          ? {
              ...block,
              file,
              previewUrl,
              // ✅ 교체 시에도 파일명을 명확하게 업데이트합니다.
              fileName: `[${orientation === 'landscape' ? 'EDIT 가로' : 'EDIT 세로'}] ${file.name}`,
            }
          : block
      )
    );
  };

  const onSubmit = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!id) return;
    const landscape = blocks.find((b) => b.id === 'landscape');
    const portrait = blocks.find((b) => b.id === 'portrait');

    if (!title.trim()) return alert('제목을 입력해주세요.');
    if (!landscape || !portrait) return alert('가로형과 세로형 이미지를 모두 등록해주세요.');

    try {
      setUploading(true);

      // 🚀 [파일명 중복 체크 단계]
      const targetImages = [
        { block: landscape, type: 'landscape' as const },
        { block: portrait, type: 'portrait' as const },
      ];

      for (const item of targetImages) {
        if (isImageBlock(item.block) && item.block.file) {
          const { safeName } = getSafeFileData(item.block.file);
          const isDuplicate = await checkFileExists(safeName);
          if (isDuplicate) {
            if (
              !window.confirm(`'${safeName}' 파일이 이미 존재합니다. 덮어쓰시겠습니까?`)
            ) {
              setUploading(false);
              return; 
            }
          }
        }
      }

      // 🚀 [S3 업로드 단계]
      let landscapeUrl = '';
      let portraitUrl = '';

      if (isImageBlock(landscape) && landscape.file) {
        landscapeUrl = await uploadFileToS3(landscape.file, 'landscape');
      }
      if (isImageBlock(portrait) && portrait.file) {
        portraitUrl = await uploadFileToS3(portrait.file, 'portrait');
      }


      const result = await editBoard({
        variables: {
          input: {
            id: Number(id),
            title: title.trim(),
            blocks: {
              landscape: { type: 'IMAGE', url: landscapeUrl, fileName: isImageBlock(landscape) && landscape.file ? landscape.file.name : ''  },
              portrait: { type: 'IMAGE', url: portraitUrl, fileName: isImageBlock(portrait) && portrait.file ? portrait.file.name : '' },
            },
          },
        },
      });

      if (result.data?.editMainPopupBoard?.ok) {
        alert('수정되었습니다.');
        navigate('/admin/main-popup');
      }
    } catch (error: any) {
      alert(`오류: ${error.message}`);
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
          <LoadingText>데이터를 안전하게 변경하고 있습니다...</LoadingText>
          <span style={{ fontSize: '14px', opacity: 0.8 }}>잠시만 기다려 주세요.</span>
        </LoadingOverlay>
      )}
      <h2>메인 팝업 수정</h2>

      <TwoColumnLayout>
        <EditorSection>
          <AuthorBox>
            <span>작성자:</span>
            <strong>{author || '정보 없음'}</strong>
          </AuthorBox>

          <EditorInput
            placeholder="팝업 제목 (관리용)"
            ref={titleRef}
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
          />

          <BoadBlockEditor
            blocks={blocks}
            onRemoveBlock={(id) => setBlocks((prev) => prev.filter((b) => b.id !== id))}
            // ✅ 아래 항목을 추가하여 전달합니다.
            onReplaceImage={handleReplaceImage} 
          />

          <UploadControls>
            <ToolbarButton
              type="button"
              $variant="landscape"
              onClick={() => landscapeInputRef.current?.click()}
            >
              🖼 가로형 이미지 변경
            </ToolbarButton>
            <input
              ref={landscapeInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  addSpecificImage(e.target.files, 'landscape');
                  e.target.value = '';
                }
              }}
            />

            <ToolbarButton
              type="button"
              $variant="portrait"
              onClick={() => portraitInputRef.current?.click()}
            >
              📱 세로형 이미지 변경
            </ToolbarButton>
            <input
              ref={portraitInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  addSpecificImage(e.target.files, 'portrait');
                  e.target.value = '';
                }
              }}
            />
          </UploadControls>
        </EditorSection>

        <PreviewSection>
          {blocks.map((block) =>
            isImageBlock(block) ? (
              <PreviewImageCard key={block.id}>
                <span className="label">{block.id === 'landscape' ? '가로형' : '세로형'}</span>
                <img
                  src={block.previewUrl}
                  alt="preview"
                />
              </PreviewImageCard>
            ) : null,
          )}
        </PreviewSection>
      </TwoColumnLayout>

      <SubmitButton
        type="button"
        onClick={onSubmit}
        disabled={editLoading || uploading}
      >
        {uploading ? '저장 중...' : '수정 완료'}
      </SubmitButton>
    </Container>
  );
}

/* ==============================
    Styled Components (Create와 동일)
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

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 9999;
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
  margin-bottom: 8px;
`;

const popIn = keyframes`
  0% { opacity: 0; transform: translateY(12px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0px) scale(1); }
`;

const shine = keyframes`
  0% { left: -80%; }
  100% { left: 120%; }
`;

const UploadControls = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  margin-top: 24px;
  padding: 14px;
  border-radius: 14px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  animation: ${popIn} 0.35s ease;
`;

const ToolbarButton = styled.button<{ $variant: 'landscape' | 'portrait' }>`
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  height: 44px;
  min-width: 160px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  background: ${(props) => (props.$variant === 'landscape' ? '#2563eb' : '#111827')};
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -80%;
    width: 70%;
    height: 100%;
    transform: skewX(-25deg);
    background: rgba(255, 255, 255, 0.3);
    filter: blur(4px);
    opacity: 0;
  }

  &:hover::after {
    opacity: 1;
    animation: ${shine} 0.7s ease;
  }
`;

const PreviewImageCard = styled.div`
  position: relative;
  .label {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 16px;
    z-index: 2;
  }
  img {
    width: 100%;
    border-radius: 8px;
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
