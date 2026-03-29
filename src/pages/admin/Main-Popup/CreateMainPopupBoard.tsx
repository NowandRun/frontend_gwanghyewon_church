import React, { useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { BoardBlock, BoardType } from '../../../types/types';
import { useMe } from '../../../hooks/useMe';
import BoadBlockEditor from '../../../components/AdminComponents/AdminBoaderBlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';
import { CREATE_MAIN_POPUP_BOARD_MUTATION } from 'src/types/grapql_call';
import { PAGE_IDS, useTabConcurrency } from 'src/hooks/useTabConcurrency';

export default function CreateMainPopupBoard() {
  useTabConcurrency(PAGE_IDS.CHURCH_MAIN_POPUP);
  const navigate = useNavigate();
  const { data: meData } = useMe();
  const titleRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [uploading, setUploading] = useState(false);

  const landscapeInputRef = useRef<HTMLInputElement>(null);
  const portraitInputRef = useRef<HTMLInputElement>(null);

  const isImageBlock = (block: BoardBlock): block is Extract<BoardBlock, { type: 'image' }> => {
    return block.type === 'image';
  };

  /* =============================
      S3 업로드 및 중복 체크 로직
  ============================== */

  // 1. 파일명 안전 검사 (공백 제거 및 금지 문자 확인)
  const getSafeFileData = (file: File) => {
    const safeName = file.name.replace(/\s+/g, '-');
    const forbiddenChars = /[\\<>|^!*{}[\]"`~#()+=,;: @&]/;
    if (forbiddenChars.test(safeName)) {
      return { safeName, isValid: false, message: `파일명에 금지 특수문자가 있습니다.` };
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

  // 3. 실제 S3 업로드 실행
  const uploadFileToS3 = async (
    file: File,
    orientation: 'landscape' | 'portrait',
  ): Promise<string> => {
    const { safeName, isValid, message } = getSafeFileData(file);
    if (!isValid) throw new Error(message);

    const formData = new FormData();
    // 첫 번째 참고 코드의 방식대로 직접 인코딩하여 전송
    formData.append('file', file, encodeURIComponent(safeName));
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

  const [createBoard, { loading }] = useMutation(CREATE_MAIN_POPUP_BOARD_MUTATION);

  /* =============================
      블록 관리 로직
  ============================== */
  const addSpecificImage = (files: FileList, orientation: 'landscape' | 'portrait') => {
    if (files.length === 0) return;
    const file = files[0];
    const previewUrl = URL.createObjectURL(file);

    const newBlock: BoardBlock = {
      id: orientation,
      type: 'image',
      file,
      previewUrl,
      fileName: `[${orientation === 'landscape' ? '가로' : '세로'}] ${file.name}`,
      isThumbnail: orientation === 'landscape',
      selected: false,
    };

    setBlocks((prev) => {
      const filtered = prev.filter((b) => b.id !== orientation);
      return [...filtered, newBlock];
    });
  };

  /* =============================
      제출 로직 (중복 체크 포함)
  ============================== */
  const onSubmit = async () => {
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
              !window.confirm(`'${item.block.file.name}' 파일이 이미 존재합니다. 덮어쓰시겠습니까?`)
            ) {
              setUploading(false);
              return; // 업로드 중단
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

      // 🚀 [Mutation 실행]
      const result = await createBoard({
        variables: {
          input: {
            title: title.trim(),
            blocks: {
              landscape: { type: 'IMAGE', url: landscapeUrl },
              portrait: { type: 'IMAGE', url: portraitUrl },
            },
          },
        },
      });

      if (result.data?.createMainPopupBoard?.ok) {
        alert('팝업이 등록되었습니다.');
        navigate('/admin/main-popup');
      }
    } catch (error: any) {
      alert(`오류: ${error.message}`);
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
      <h2>메인 팝업 등록</h2>

      <TwoColumnLayout>
        <EditorSection>
          <AuthorBox>
            <span>작성자:</span>
            <strong>{meData?.me?.nickname || '불러오는 중...'}</strong>
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
          />

          <UploadControls>
            {/* --- 가로형 이미지 --- */}
            <ToolbarButton
              type="button"
              $variant="landscape"
              onClick={() => landscapeInputRef.current?.click()}
            >
              🖼 가로형 이미지 추가
            </ToolbarButton>
            <input
              ref={landscapeInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  addSpecificImage(e.target.files, 'landscape');
                  // ✅ 핵심: 같은 파일을 다시 올릴 수 있도록 value 초기화
                  e.target.value = '';
                }
              }}
            />

            {/* --- 세로형 이미지 --- */}
            <ToolbarButton
              type="button"
              $variant="portrait"
              onClick={() => portraitInputRef.current?.click()}
            >
              📱 세로형 이미지 추가
            </ToolbarButton>
            <input
              ref={portraitInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  addSpecificImage(e.target.files, 'portrait');
                  // ✅ 핵심: 같은 파일을 다시 올릴 수 있도록 value 초기화
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
        onClick={onSubmit}
        disabled={loading || uploading}
      >
        {uploading ? '저장 중...' : '등록하기'}
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

/* ==============================
   Animations
============================== */
const popIn = keyframes`
  0% { opacity: 0; transform: translateY(12px) scale(0.95); }
  100% { opacity: 1; transform: translateY(0px) scale(1); }
`;

const shine = keyframes`
  0% { left: -80%; }
  100% { left: 120%; }
`;

/* ==============================
   Styled Components
============================== */
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

  /* 가로형은 파란색 계열, 세로형은 검정색 계열로 구분 */
  background: ${(props) => (props.$variant === 'landscape' ? '#2563eb' : '#111827')};
  color: white;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 18px rgba(0, 0, 0, 0.12);
  }

  &:active {
    transform: translateY(1px) scale(0.98);
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
