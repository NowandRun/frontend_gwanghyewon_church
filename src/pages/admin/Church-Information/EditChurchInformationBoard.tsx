import React, { useRef, useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { v4 as uuid } from 'uuid';
import { arrayMove } from '@dnd-kit/sortable';
import { BoardBlock, BoardType } from '../../../types/types';
import BoadBlockEditor from '../../../components/AdminComponents/AdminBoaderBlockEditor';
import EditorInput from '../../../components/AdminComponents/EditorInput';
import { PAGE_IDS, useTabConcurrency } from '../../../hooks/useTabConcurrency';
import { useMe } from '../../../hooks/useMe';
import { EDIT_CHURCH_INFORMATION_BOARD_MUTATION, FIND_CHURCH_INFORMATION_BOARD_BY_ID_QUERY } from '../../../types/grapql_call';
import ChurchInformationBlockToolbar from '../../../components/AdminComponents/ChurchInformationBlockToolbar';


export default function EditChurchInformationBoard() {
  useTabConcurrency(PAGE_IDS.CHURCH_INFO); // 훅 호출만으로 적용
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: meData, loading: meLoading } = useMe();

  const [title, setTitle] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [author, setAuthor] = useState('');
  const [blocks, setBlocks] = useState<BoardBlock[]>([]);
  const [fileUrls, setFileUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const { data: boardData, loading: boardLoading } = useQuery(
    FIND_CHURCH_INFORMATION_BOARD_BY_ID_QUERY,
    { variables: { id: Number(id) }, skip: !id, fetchPolicy: 'network-only', },
  );

  const [editBoard, { loading: editLoading }] = useMutation(EDIT_CHURCH_INFORMATION_BOARD_MUTATION);

  useEffect(() => {
    if (!meLoading && !boardLoading && meData?.me && boardData?.findChurchInformationBoardById?.result) {
      const board = boardData.findChurchInformationBoardById.result;
      
      // 1. 작성자 ID 추출 (경로 확인 필수!)
      const ownerId = board.user?.id; 
      
      // 2. 권한 판별
      const isAuthor = ownerId && String(ownerId) === String(meData.me.id);
      const userRole = String(meData.me.role).toUpperCase();
      const isAdmin = userRole === 'ADMIN' || userRole === 'SUPERADMIN';


      if (!isAuthor && !isAdmin) {
        alert("수정 권한이 없습니다.");
        navigate('/admin/church-info');
      }
    }
  }, [meData, boardData, meLoading, boardLoading, navigate]);

  // 🔥 헬퍼 함수: 파일명에서 S3 UUID(타임스탬프) 제거
  const getCleanFileName = (url: string) => {
    if (!url) return 'file';
    const fullFileName = url.split('/').pop() || '';
    const decodedName = decodeURIComponent(fullFileName);
    const underscoreIndex = decodedName.indexOf('_');
    
    // 언더바가 있고, 그 앞부분이 숫자로만 구성된 경우(타임스탬프)만 잘라냄
    if (underscoreIndex !== -1 && /^\d+$/.test(decodedName.substring(0, underscoreIndex))) {
      return decodedName.substring(underscoreIndex + 1);
    }
    return `수정됨 ${decodedName}`;
  };

  useEffect(() => {
    // 1. 데이터 로딩 중이거나 응답이 없는 경우 바로 종료
    if (meLoading || boardLoading) return;
    if (!boardData?.findChurchInformationBoardById?.ok) return;

    const board = boardData.findChurchInformationBoardById.result;
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
    
    setTitle(board.title || '');
    setIsPinned(board.isPinned || false);
    setAuthor(board.author || '');
    setFileUrls(board.fileUrls || []);

    if (board.blocks) {
      const initialBlocks: BoardBlock[] = board.blocks.map((b: any) => {
      const isImage = b.type === 'IMAGE';
      const isVideo = b.type === 'VIDEO'; 

      // 🔥 S3 URL에서 파일명만 추출한 뒤, 앞에 붙은 타임스탬프(UUID 역할) 제거
      let processedFileName = '';
      if (isImage && b.url) {
        const fullFileName = b.url.split('/').pop() || '';
        // 첫 번째 '_' 이후의 문자열을 가져옴 (없으면 전체 반환)
        const underscoreIndex = fullFileName.indexOf('_');
        processedFileName = underscoreIndex !== -1 
          ? decodeURIComponent(fullFileName.substring(underscoreIndex + 1)) 
          : decodeURIComponent(fullFileName);
      }
          

          return {
            id: uuid(),
            type: b.type.toLowerCase(),
            selected: false,
            content: b.content,
            url: isVideo ? b.url : '', 
            previewUrl:isImage? b.url: '',
            // 🔥 수정: 기존 URL에서 깨끗한 파일명 추출하여 저장
            fileName: b.type === 'IMAGE' || b.type === 'image' ? getCleanFileName(b.url) : '',
          };
        });
      setBlocks(initialBlocks);
      }
    }
   }, [boardData, boardLoading, meData, meLoading, navigate]);

  const getSafeFileData = (file: File) => {
  // 공백을 하이픈으로 치환
  const safeName = file.name.replace(/\s+/g, '-');

  /**
   * S3 및 URL에서 문제를 일으키는 특수문자들:
   * \ / : * ? " < > |  (OS 파일 시스템 제한 문자)
   * # % [ ] { }        (URL 예약 및 특수 기호)
   * ! ` ' @ =          (S3에서 권장하지 않는 특수 문자)
   */
  const forbiddenChars = /[\\/:*?"<>|#%[\]{}!@'=`]/;

  if (forbiddenChars.test(safeName)) {
    return { 
      safeName, 
      isValid: false, 
      message: `파일명에 허용되지 않는 특수문자(\\ / : * ? " < > | # % [ ] { } ! @ ' = \`)가 포함되어 있습니다.` 
    };
  }

  return { safeName, isValid: true };
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

    if (!response.ok) throw new Error('업로드 실패');
    const data = await response.json();
    return data.url;
  };

  /* 🚀 추가된 핸들러: 체크박스 선택 토글 */
  const toggleSelectBlock = (blockId: string) => {
    setBlocks((prev) =>
      prev.map((block) => (block.id === blockId ? { ...block, selected: !block.selected } : block)),
    );
  };

  /* 🚀 추가된 핸들러: 선택된 블록들 삭제 */
  const removeSelectedBlocks = () => {
    setBlocks((prev) => {
      prev.forEach((block) => {
        if (block.selected && block.type === 'image' && block.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(block.previewUrl);
        }
      });
      return prev.filter((block) => !block.selected);
    });
  };

  // 🚀 유튜브 ID 추출 유틸 (Shorts 포함 모든 주소 대응)
  const getYoutubeId = (url: string) => {
    // shorts/ 경로를 인식할 수 있도록 정규식 업데이트
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // 🚀 영상 블록 추가 로직
    const addVideoBlock = () => {
      const url = window.prompt('유튜브 영상 주소를 입력해주세요.');
      if (!url) return;
  
      const videoId = getYoutubeId(url);
      if (!videoId) return alert('올바른 유튜브 주소가 아닙니다.');
  
      setBlocks((prev) => [
        ...prev,
        { id: uuid(), type: 'video', url: `https://www.youtube.com/embed/${videoId}`, selected: false }
      ]);
    };
  
  const updateVideoUrl = (blockId: string, url: string) => {
    setBlocks((prev) =>
      prev.map((block) => {
        if (block.id === blockId && block.type === 'video') {
          // 1. 입력된 주소에서 유튜브 ID를 추출합니다.
          const videoId = getYoutubeId(url);
          
          // 2. ID가 정상적으로 추출되면 embed 주소로 변환하고, 
          // 아직 타이핑 중이거나 잘못된 주소라면 입력한 url 그대로 둡니다.
          const nextUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : url;
          
          return { ...block, url: nextUrl };
        }
        return block;
      })
    );
  }

  const onSubmit = async (e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    if (!id) return;
    try {
      setUploading(true);
      const finalBlocks = [];
      let finalThumbnailUrl = '';

      // 1. 순차적으로 블록 처리 및 업로드
    for (const block of blocks) {
      if (block.type === 'text') {
        finalBlocks.push({ type: 'TEXT', content: block.content });
      } else if (block.type === 'image') {
        // 이미지가 새로 첨부된 경우만 S3 업로드, 아니면 기존 URL 유지
        const url = block.file ? await uploadFileToS3(block.file) : block.previewUrl;
        finalBlocks.push({ type: 'IMAGE', url });

        // 사용자가 명시적으로 썸네일로 선택한 경우
        if (block.isThumbnail) {
          finalThumbnailUrl = url;
        }
      } else if (block.type === 'video') {
        // 🚀 영상 블록 추가 (유튜브 URL 등)
        finalBlocks.push({ type: 'VIDEO', url: block.url });
      }
    }

      const result = await editBoard({
      variables: {
        input: {
          id: Number(id),
          title: title.trim(),
          isPinned,
          blocks: finalBlocks,
          fileUrls: fileUrls,
        },
      },
      // 🚀 추가: 뮤테이션 성공 후 이 쿼리들을 서버에서 다시 불러옴
      refetchQueries: [
        { 
          query: FIND_CHURCH_INFORMATION_BOARD_BY_ID_QUERY, 
          variables: { id: Number(id) } 
        }
      ],
    });

      if (result.data?.editChurchInformationBoard.ok) {
        alert('수정되었습니다.');
        navigate('/admin/church-info');
      }
    } catch (e) {
      alert('오류가 발생했습니다.');
    } finally {
      setUploading(false);
    }
  };

  if (boardLoading || meLoading) return <Container>로딩 중...</Container>;

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
        <HeaderToolRow>
          <AuthorBox>
            작성자: <strong>{author}</strong>
          </AuthorBox>
          <PinOption>
            <input
              type="checkbox"
              id="isPinnedEdit"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
            <label htmlFor="isPinnedEdit">📌 중요 공지로 상단 고정</label>
          </PinOption>
        </HeaderToolRow>
      </HeaderArea>

      <TwoColumnLayout>
        <EditorSection>
          <EditorInput
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            placeholder="제목"
          />
          <BoadBlockEditor
            blocks={blocks}
            onRemoveBlock={(id: string) => setBlocks((prev) => prev.filter((b) => b.id !== id))}
            onChangeText={(id, txt) =>
              setBlocks((prev) => prev.map((b) => (b.id === id ? { ...b, content: txt } : b)))
            }
            onReorder={(a, o) => {
              const oldIdx = blocks.findIndex((b) => b.id === a);
              const newIdx = blocks.findIndex((b) => b.id === o);
              setBlocks(arrayMove(blocks, oldIdx, newIdx));
            }}
            onReplaceImage={(id, files) => {
              const file = (files as FileList)[0];
              if (!file) return;
              setBlocks((prev) =>
                prev.map((b) =>
                  b.id === id ? { ...b, file, previewUrl: URL.createObjectURL(file),fileName: `[EDIT 이미지] ${file.name}` } : b,
                ),
              );
            }}

            /* ✅ 에러 해결: 필수 props 전달 */
            onToggleSelect={toggleSelectBlock}
            onRemoveSelected={removeSelectedBlocks}
            onChangeVideoUrl={updateVideoUrl}
          />
          <AttachmentSection>
            <label htmlFor="file-up">📎 파일 추가</label>
            <input
              id="file-up"
              type="file"
              multiple
              style={{ display: 'none' }}
              onChange={async (e) => {
                if (!e.target.files) return;
                const urls = await Promise.all(Array.from(e.target.files).map(uploadFileToS3));
                setFileUrls((prev) => [...prev, ...urls]);
              }}
            />
            <FileList>
              {fileUrls.map((url, i) => (
                <FileItem key={i}>
                  {/* 🔥 수정: 하단 첨부파일 리스트에서도 UUID 제거된 이름 표시 */}
                  <span>{getCleanFileName(url)}</span>
                  <button onClick={() => setFileUrls((prev) => prev.filter((_, idx) => idx !== i))}>
                    삭제
                  </button>
                </FileItem>
              ))}
            </FileList>
          </AttachmentSection>
          <ChurchInformationBlockToolbar
            onAddText={() =>
              setBlocks([...blocks, { id: uuid(), type: 'text', content: '', selected: false }])
            }
            onAddImage={(f) => {
              const news = Array.from(f).map((file) => ({
                id: uuid(),
                type: 'image',
                file,
                previewUrl: URL.createObjectURL(file),
                selected: false,
                fileName: `[NEW 이미지] ${file.name}`
              }));
              setBlocks([...blocks, ...(news as any)]);
            }}
            onAddVideo={addVideoBlock}
          />
        </EditorSection>

        <PreviewSection>
          {isPinned && <NoticeBadge>공지사항</NoticeBadge>}
          <PreviewTitle>{title || '제목 없음'}</PreviewTitle>
          {blocks.map((block) =>{
            if (block.type === 'image') return (
              <PreviewImageCard key={block.id}>
                <img
                  src={block.previewUrl}
                  alt=""
                />
              </PreviewImageCard>
            );
            if (block.type === 'text') return (
              <HtmlContent key={block.id} dangerouslySetInnerHTML={{ __html: block.content }} />
            );
            if (block.type === 'video') return (
              <VideoPreviewWrapper key={block.id}>
                <iframe
                  src={block.url}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </VideoPreviewWrapper>
            );
            return null;
          })}
        </PreviewSection>
      </TwoColumnLayout>

      <SubmitButton
        type="button"
        onClick={onSubmit}
        disabled={editLoading || uploading}
      >
        수정 완료
      </SubmitButton>
    </Container>
  );
}

// 스타일 정의 (이전과 동일)
const HeaderArea = styled.div`
  margin-bottom: 24px;
`;
const HeaderToolRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;
const PinOption = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  background: #fff;
  padding: 6px 12px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
  input {
    cursor: pointer;
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
  display: flex;
  flex-direction: column;
  gap: 20px;
`;
const PreviewTitle = styled.h3`
  font-size: 20px;
  font-weight: 700;
`;
const PreviewImageCard = styled.div`
  img {
    width: 100%;
    border-radius: 8px;
  }
`;
const HtmlContent = styled.div`
  font-size: 14px;
  line-height: 1.6;
  word-break: break-all;
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
const AuthorBox = styled.div`
  font-size: 14px;
  color: #666;
  strong {
    color: #222;
  }
`;

const VideoPreviewWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 56.25%; // 16:9 비율
  height: 0;
  border-radius: 8px;
  overflow: hidden;
  iframe {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
  }
`;