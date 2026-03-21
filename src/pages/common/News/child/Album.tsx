import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  FIND_ALL_CHURCH_ALBUM_BOARD_QUERY,
  FIND_CHURCH_ALBUM_BOARD_BY_ID_QUERY,
} from 'src/types/grapql_call';
import styled from 'styled-components';

function ImageModal({
  images,
  currentIndex,
  onClose,
  title,
}: {
  images: string[];
  currentIndex: number;
  onClose: () => void;
  title: string;
}) {
  const [index, setIndex] = useState(currentIndex);
  const [scale, setScale] = useState(1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0, left: 0, top: 0 });

  // 줌 핸들러
  const handleZoomIn = useCallback(() => setScale((prev) => Math.min(prev + 0.5, 4)), []);
  const handleZoomOut = useCallback(() => setScale((prev) => Math.max(prev - 0.5, 1)), []);
  const resetZoom = useCallback(() => {
    setScale(1);
    if (scrollAreaRef.current) scrollAreaRef.current.scrollTo(0, 0);
  }, []);

  const goToPrev = useCallback(() => {
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    resetZoom();
  }, [images.length, resetZoom]);

  const goToNext = useCallback(() => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    resetZoom();
  }, [images.length, resetZoom]);

  // 마우스 드래그 스크롤 (확대 시)
  const onMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1 || !scrollAreaRef.current) return;
    setIsDragging(true);
    setOrigin({
      x: e.clientX,
      y: e.clientY,
      left: scrollAreaRef.current.scrollLeft,
      top: scrollAreaRef.current.scrollTop,
    });
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollAreaRef.current) return;
    e.preventDefault();
    const dx = e.clientX - origin.x;
    const dy = e.clientY - origin.y;
    scrollAreaRef.current.scrollLeft = origin.left - dx;
    scrollAreaRef.current.scrollTop = origin.top - dy;
  };

  const onMouseUp = () => setIsDragging(false);

  // 1. 바디 스크롤 방지
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 마우스 휠 줌 (Ctrl/Meta 키 조합)
  useEffect(() => {
    const scrollArea = scrollAreaRef.current;
    if (!scrollArea) return;

    const handleNativeWheel = (e: WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();
        if (e.deltaY < 0) {
          setScale((prev) => Math.min(prev + 0.25, 4));
        } else {
          setScale((prev) => Math.max(prev - 0.25, 1));
        }
      }
    };

    scrollArea.addEventListener('wheel', handleNativeWheel, { passive: false });
    return () => scrollArea.removeEventListener('wheel', handleNativeWheel);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. 줌 관련 (Ctrl 또는 Meta 키 조합)
      if (e.ctrlKey || e.metaKey) {
        if (e.key === '=' || e.key === '+') {
          e.preventDefault();
          handleZoomIn();
        }
        if (e.key === '-') {
          e.preventDefault();
          handleZoomOut();
        }
        if (e.key === '0') {
          e.preventDefault();
          resetZoom();
        }
      }

      // 2. 일반 조작
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, goToPrev, goToNext, handleZoomIn, handleZoomOut, resetZoom]);

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <TopFloatingBar>
          <div className="title-group">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <h3>{title}</h3>
              {/* 확대 중일 때 상단에 작게 힌트 표시 (가이드가 숨겨지므로) */}
              {scale > 1 && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: '#666',
                    borderLeft: '1px solid #333',
                    paddingLeft: '12px',
                  }}
                >
                  드래그하여 이동 / <Kbd style={{ fontSize: '0.6rem' }}>Ctrl</Kbd>+
                  <Kbd style={{ fontSize: '0.6rem' }}>0</Kbd> 초기화
                </span>
              )}
            </div>
            <span className="count">
              {index + 1} / {images.length}
            </span>
          </div>
          <div className="action-group">
            <ZoomControls>
              <button
                onClick={handleZoomOut}
                title="축소 (Ctrl + -)"
              >
                {' '}
                －{' '}
              </button>
              <span
                className="scale-text"
                onClick={resetZoom}
                style={{ cursor: 'pointer' }}
              >
                {Math.round(scale * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                title="확대 (Ctrl + +)"
              >
                {' '}
                ＋{' '}
              </button>
            </ZoomControls>
            <CloseIconButton onClick={onClose}>✕</CloseIconButton>
          </div>
        </TopFloatingBar>

        <MainViewerContainer>
          <SideNavButton
            className="left"
            onClick={goToPrev}
          >
            〈
          </SideNavButton>

          <ImageScrollArea
            ref={scrollAreaRef}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            $isZoomed={scale > 1}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: scale > 1 ? 'flex-start' : 'center',
                alignItems: scale > 1 ? 'flex-start' : 'center',
                minWidth: '100%',
                minHeight: '100%',
              }}
            >
              <img
                src={images[index]}
                alt=""
                onDoubleClick={resetZoom}
                style={
                  {
                    width: scale > 1 ? `${scale * 100}%` : 'auto',
                    maxWidth: scale > 1 ? 'none' : '90%',
                    maxHeight: scale > 1 ? 'none' : '85vh',
                    userSelect: 'none',
                    WebkitUserDrag: 'none',
                    display: 'block',
                    transition: 'none',
                  } as any
                }
              />
            </div>
          </ImageScrollArea>

          <SideNavButton
            className="right"
            onClick={goToNext}
          >
            〉
          </SideNavButton>

          {/* 변경 포인트: 확대 상태(scale > 1)일 때는 가이드를 숨김 */}
          <FloatingGuide $isVisible={scale === 1}>
            <h4>Shortcuts</h4>
            <div className="guide-item">
              <span>확대/축소</span>
              <div>
                <Kbd>Ctrl</Kbd> + <Kbd>+</Kbd> / <Kbd>-</Kbd>
              </div>
            </div>
            <div className="guide-item">
              <span>크기 초기화</span>
              <div>
                <Kbd>Ctrl</Kbd> + <Kbd>0</Kbd>
              </div>
            </div>
            <div className="guide-item">
              <span>이동</span>
              <div>
                <Kbd>←</Kbd> <Kbd>→</Kbd>
              </div>
            </div>
          </FloatingGuide>
        </MainViewerContainer>
      </ModalContent>
    </ModalOverlay>,
    document.body,
  );
}

// --- 메인 Album 컴포넌트 ---
// ... (ImageModal 컴포넌트 및 상단 import는 동일)

function Album() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState<{
    images: string[];
    index: number;
    title: string; // title 추가
  } | null>(null);
  const takeAmount = 12;

  const [searchInput, setSearchInput] = useState(''); // 입력 필드용
  const [searchKeyword, setSearchKeyword] = useState(''); // 실제 검색 실행용

  const isNewPost = (date: string | Date) => dayjs().diff(dayjs(date), 'day') < 3;

  // 1. 전체 리스트 쿼리 (항상 실행)
  const { data: listData, loading: listLoading } = useQuery(FIND_ALL_CHURCH_ALBUM_BOARD_QUERY, {
    variables: { input: { page, take: takeAmount, search: searchKeyword } },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setPage(1); // 검색 시 첫 페이지로 리셋
  };

  const resetSearch = () => {
    setSearchInput('');
    setSearchKeyword('');
    setPage(1);
  };

  const response = listData?.findAllChurchAlbumBoard;
  const boards = response?.results || [];
  const totalResults = response?.totalResults || 0;
  const totalPages = useMemo(
    () => response?.totalPages || Math.ceil(totalResults / takeAmount),
    [response, totalResults],
  );

  // 2. 상세 데이터 쿼리 (selectedId가 있을 때만 실행)
  const { data: detailData, loading: detailLoading } = useQuery(
    FIND_CHURCH_ALBUM_BOARD_BY_ID_QUERY,
    {
      variables: { id: selectedId ? parseFloat(selectedId.toString()) : 0 },
      skip: !selectedId,
    },
  );

  const allDetailImages = useMemo(() => {
    const rawBlocks = detailData?.findChurchAlbumBoardById.result?.blocks;
    if (!rawBlocks) return [];
    const parsed = typeof rawBlocks === 'string' ? JSON.parse(rawBlocks) : rawBlocks;
    return parsed.filter((b: any) => b.type === 'IMAGE').map((b: any) => b.url);
  }, [detailData]);

  // 페이지 변경 시 상단으로 스크롤 (상세 페이지 접근 시 편리함)
  useEffect(() => {
    if (selectedId) {
      window.scrollTo({
        top: 0,
        behavior: 'instant', // 'smooth'에서 'auto'로 변경하여 버벅임 제거
      });
    }
  }, [selectedId]);

  if (listLoading && !listData) return <Message>로딩 중...</Message>;

  return (
    <Container>
      <TidingsWrapper>
        <TidingsTitle
          onClick={() => {
            setSelectedId(null);
            setPage(1);
          }}
          style={{ cursor: 'pointer' }}
        >
          교우동정
        </TidingsTitle>
      </TidingsWrapper>

      {/* --- 상단: 상세 페이지 섹션 (아이디가 있을 때만 출력) --- */}
      {selectedId && (
        <DetailSection>
          {detailLoading ? (
            <Message>상세 내용을 불러오는 중...</Message>
          ) : (
            <DetailView>
              <DetailHeader>
                {isNewPost(detailData?.findChurchAlbumBoardById.result?.createdAt) && (
                  <NewBadge>NEW</NewBadge>
                )}
                <h1>{detailData?.findChurchAlbumBoardById.result?.title}</h1>
                <p>
                  {dayjs(detailData?.findChurchAlbumBoardById.result?.createdAt).format(
                    'YYYY년 MM월 DD일',
                  )}{' '}
                  | {detailData?.findChurchAlbumBoardById.result?.author}
                </p>
              </DetailHeader>
              <ContentRender>
                {(() => {
                  const rawBlocks = detailData?.findChurchAlbumBoardById.result?.blocks;
                  const parsedBlocks =
                    typeof rawBlocks === 'string' ? JSON.parse(rawBlocks) : rawBlocks;
                  let imageCounter = 0;

                  return parsedBlocks?.map((block: any, index: number) => {
                    if (block.type === 'TEXT')
                      return (
                        <HtmlBlock
                          key={index}
                          dangerouslySetInnerHTML={{ __html: block.content }}
                        />
                      );
                    if (block.type === 'IMAGE') {
                      const currentImgIdx = imageCounter++;
                      return (
                        <ImageBlock
                          key={index}
                          onClick={() =>
                            setModalData({
                              images: allDetailImages,
                              index: currentImgIdx,
                              title:
                                detailData?.findChurchAlbumBoardById.result?.title || '이미지 보기',
                            })
                          }
                        >
                          <img
                            src={block.url}
                            alt="content"
                          />
                          <div className="zoom-overlay">🔍 크게 보기</div>
                        </ImageBlock>
                      );
                    }
                    return null;
                  });
                })()}
              </ContentRender>
              <BackButton onClick={() => setSelectedId(null)}>✕ 목록으로 돌아가기</BackButton>
            </DetailView>
          )}
          <Divider /> {/* 상세와 목록 사이의 구분선 */}
        </DetailSection>
      )}

      {/* --- 하단: 전체 게시물 목록 섹션 --- */}
      <ListSection>
        <ListHeader>
          <SectionTitle>{selectedId ? '다른 게시물 보기' : '전체 목록'}</SectionTitle>

          {/* --- 검색 UI 추가 --- */}
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              placeholder="검색어 입력"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <SearchButton type="submit">검색</SearchButton>
            {searchKeyword && (
              <ResetBtn
                type="button"
                onClick={resetSearch}
              >
                초기화
              </ResetBtn>
            )}
          </SearchForm>
        </ListHeader>

        {listLoading && boards.length === 0 ? (
          <Message>로딩 중...</Message>
        ) : boards.length === 0 ? (
          <Message>
            {searchKeyword
              ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.`
              : '등록된 게시물이 없습니다.'}
          </Message>
        ) : (
          <PostGrid>
            {boards.map((post: any) => {
              return (
                <PostCard
                  key={post.id}
                  $isActive={selectedId === post.id}
                  onClick={() => setSelectedId(post.id)}
                >
                  <Thumbnail
                    src={post.thumbnailUrl || '/default-thumb.png'}
                    alt="thumb"
                  />
                  <PostInfo>
                    <PostTitle>
                      {/* 2. 신규일 경우 배지 노출 */}
                      {isNewPost(post.createdAt) && <NewBadge>NEW</NewBadge>}
                      {post.title}
                    </PostTitle>
                    <PostDate>{dayjs(post.createdAt).format('YYYY.MM.DD')}</PostDate>
                  </PostInfo>
                  {selectedId === post.id && <ActiveBadge>읽는 중</ActiveBadge>}
                </PostCard>
              );
            })}
          </PostGrid>
        )}

        {/* 페이지네이션 */}
        <PaginationContainer>
          <PageButton
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            이전
          </PageButton>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
            <PageNumber
              key={num}
              $active={page === num}
              onClick={() => setPage(num)}
            >
              {num}
            </PageNumber>
          ))}
          <PageButton
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            다음
          </PageButton>
        </PaginationContainer>
      </ListSection>

      {/* 이미지 모달 */}
      {modalData && (
        <ImageModal
          images={modalData.images}
          currentIndex={modalData.index}
          title={modalData.title} // 추가
          onClose={() => setModalData(null)}
        />
      )}
    </Container>
  );
}

export default Album;

// --- 검색 기능 관련 스타일 추가 ---

const Kbd = styled.kbd`
  background-color: #333;
  border-radius: 3px;
  border: 1px solid #555;
  box-shadow:
    0 1px 1px rgba(0, 0, 0, 0.2),
    0 2px 0 0 rgba(255, 255, 255, 0.1) inset;
  color: #fff;
  display: inline-block;
  font-size: 0.85em;
  font-weight: 700;
  line-height: 1;
  padding: 2px 5px;
  white-space: nowrap;
  margin: 0 2px;
  font-family: sans-serif;
`;

/* 우측 하단 플로팅 가이드 */
const FloatingGuide = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  bottom: 25px;
  right: 25px;
  background: rgba(20, 20, 20, 0.85);
  backdrop-filter: blur(8px);
  padding: 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #eee;
  z-index: 10005;
  pointer-events: none;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 8px;

  /* 확대 시 부드럽게 사라지는 효과 */
  opacity: ${(props) => (props.$isVisible ? 1 : 0)};
  transform: ${(props) => (props.$isVisible ? 'translateY(0)' : 'translateY(20px)')};
  transition: all 0.3s ease;

  h4 {
    margin: 0 0 5px 0;
    font-size: 0.8rem;
    color: #3498db;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .guide-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 20px;
    font-size: 0.85rem;
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  z-index: 10000;
`;

const ModalContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TopFloatingBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 25px;
  background: #111;
  color: white;
  z-index: 1001;

  .title-group h3 {
    margin: 0;
    font-size: 0.95rem;
  }
  .title-group .count {
    font-size: 0.8rem;
    color: #888;
  }
  .action-group {
    display: flex;
    align-items: center;
    gap: 20px;
  }
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  background: #222;
  border-radius: 4px;
  border: 1px solid #333;

  button {
    background: none;
    border: none;
    color: white;
    width: 36px;
    height: 32px;
    cursor: pointer;
    font-size: 1rem;
    &:hover {
      background: #333;
    }
  }

  .scale-text {
    font-size: 0.85rem;
    min-width: 50px;
    text-align: center;
    border-left: 1px solid #333;
    border-right: 1px solid #333;
    height: 32px;
    line-height: 32px;
  }
`;

const CloseIconButton = styled.button`
  background: none;
  border: none;
  color: #fff;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 5px;
  &:hover {
    color: #ff4d4f;
  }
`;

const MainViewerContainer = styled.div`
  flex: 1;
  position: relative;
  overflow: hidden;
  background: #000;
`;

const ImageScrollArea = styled.div<{ $isZoomed: boolean }>`
  width: 100%;
  height: 100%;
  overflow: ${(props) => (props.$isZoomed ? 'auto' : 'hidden')};

  /* 확대 시에만 스크롤바 커스텀 */
  &::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #111;
  }
`;

const SideNavButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 50px;
  height: 60px;
  background: rgba(255, 255, 255, 0.05);
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1002;
  /* 애니메이션 제거 */

  &:hover {
    background: rgba(255, 255, 255, 0.15);
  }
  &.left {
    left: 0;
    border-radius: 0 4px 4px 0;
  }
  &.right {
    right: 0;
    border-radius: 4px 0 0 4px;
  }
`;

const ListHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const SearchForm = styled.form`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  width: 180px;
  font-size: 0.9rem;
  &:focus {
    border-color: #3498db;
  }
`;

const SearchButton = styled.button`
  padding: 8px 16px;
  background: #333;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  &:hover {
    background: #555;
  }
`;

const ResetBtn = styled.button`
  background: none;
  border: none;
  color: #888;
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.85rem;
  white-space: nowrap;
`;

const ImageBlock = styled.div`
  position: relative;
  width: 100%;
  margin: 30px 0;
  cursor: zoom-in;
  img {
    width: 100%;
    border-radius: 8px;
    transition: opacity 0.3s;
  }
  .zoom-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.3);
    color: white;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 0.3s;
    border-radius: 8px;
    font-weight: bold;
  }
  &:hover {
    .zoom-overlay {
      opacity: 1;
    }
  }
`;

// --- Styled Components (기존과 동일하되 가독성을 위해 유지) ---
const Container = styled.div`
  padding-bottom: 200px;
  width: 100%;
`;

const TidingsWrapper = styled.div`
  margin-bottom: 50px;
`;

const TidingsTitle = styled.h2`
  font-size: 2.5vw;
  font-weight: bold;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 50px;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const PageNumber = styled.span<{ $active: boolean }>`
  cursor: pointer;
  padding: 5px 10px;
  border-radius: 4px;
  font-weight: ${(props) => (props.$active ? 'bold' : 'normal')};
  color: ${(props) => (props.$active ? '#fff' : '#333')};
  background-color: ${(props) => (props.$active ? '#3498db' : 'transparent')};

  &:hover {
    background-color: ${(props) => (props.$active ? '#3498db' : '#f0f0f0')};
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const PostInfo = styled.div`
  padding: 15px;
`;

const PostTitle = styled.h3`
  font-size: 1.1rem;
  margin-bottom: 10px;
  display: flex; /* 추가: 배지와 텍스트 정렬 */
  align-items: center; /* 추가: 세로 중앙 정렬 */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const NewBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
  padding: 2px 8px;
  border-radius: 4px;
  height: 20px;
  min-width: 45px;
  line-height: 1;
  text-transform: uppercase;
  vertical-align: middle;
  background-color: #ff4d4f;
  color: white;
  border: 1px solid #ff4d4f;

  /* 수정 포인트: 왼쪽 여백을 지우고 오른쪽 여백을 줍니다 */
  margin-right: 8px;
`;
const PostDate = styled.span`
  color: #888;
  font-size: 0.9rem;
`;

const DetailView = styled.div`
  width: 100%;
  box-sizing: border-box;
  padding: 0 10px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3498db;
  cursor: pointer;
  margin-bottom: 20px;
`;

const DetailHeader = styled.div`
  border-bottom: 2px solid #333;
  padding-bottom: 20px;
  margin-bottom: 30px;
  h1 {
    font-size: 2rem;
  }
  p {
    color: #666;
    margin-top: 10px;
  }
`;

const ContentRender = styled.div`
  display: flex;
  flex-direction: column;
`;

const HtmlBlock = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  color: #2c3e50;
  p {
    margin-bottom: 1rem;
  }
`;

const Message = styled.div`
  text-align: center;
  padding: 50px;
  font-size: 1.2rem;
  color: #666;
`;

const DetailSection = styled.section`
  margin-bottom: 80px;
  animation: fadeIn 0.5s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const ListSection = styled.section`
  margin-top: 50px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 25px;
  color: #333;
  border-left: 4px solid #3498db;
  padding-left: 15px;
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 100px 0 50px 0;
  position: relative;
  &::after {
    content: 'LIST';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: white;
    padding: 0 20px;
    color: #bbb;
    font-size: 0.8rem;
    letter-spacing: 2px;
  }
`;

const PostCard = styled.div<{ $isActive?: boolean }>`
  position: relative;
  border: 1px solid ${(props) => (props.$isActive ? '#3498db' : '#eee')};
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
  background: ${(props) => (props.$isActive ? '#f0faff' : 'white')};
  transform: ${(props) => (props.$isActive ? 'scale(1.02)' : 'none')};
  box-shadow: ${(props) => (props.$isActive ? '0 10px 20px rgba(0,0,0,0.1)' : 'none')};

  &:hover {
    transform: translateY(-5px);
  }
`;

const ActiveBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #3498db;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
`;
