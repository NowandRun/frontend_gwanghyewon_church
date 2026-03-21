import { useQuery } from '@apollo/client';
import React, { useEffect, useState, useCallback, useRef } from 'react';
import { FIND_ALL_CHURCH_BULLETIN_BOARD_QUERY } from 'src/types/grapql_call';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Bulletin() {
  const [page, setPage] = useState(1);
  const takeAmount = 12;
  const [sidebarPage, setSidebarPage] = useState(1);
  const sidebarTake = 12;
  const [viewPdfUrl, setViewPdfUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [displayTitle, setDisplayTitle] = useState<string>('');
  const [numPages, setNumPages] = useState<number>(0);
  const [currPdfPage, setCurrPdfPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [direction, setDirection] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);

  const isNewPost = (date: string | Date) => dayjs().diff(dayjs(date), 'day') < 3;

  // 드래그 시작 (마우스 왼쪽 버튼 클릭 시)
  const onDragStart = (e: React.MouseEvent) => {
    // 확대되지 않았거나 왼쪽 버튼(button 0)이 아니면 무시
    if (scale <= 1.0 || e.button !== 0) return;

    setIsDragging(true);
    const container = scrollAreaRef.current;
    if (container) {
      setStartX(e.pageX - container.offsetLeft);
      setStartY(e.pageY - container.offsetTop);
      setScrollLeft(container.scrollLeft);
      setScrollTop(container.scrollTop);
    }
  };

  // 드래그 중 (마우스 이동)
  const onDragMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault(); // 텍스트 드래그 방지

    const container = scrollAreaRef.current;
    if (container) {
      const x = e.pageX - container.offsetLeft;
      const y = e.pageY - container.offsetTop;

      // 이동 속도 조절 (1.0 = 마우스 움직임과 1:1 일치)
      const walkX = x - startX;
      const walkY = y - startY;

      container.scrollLeft = scrollLeft - walkX;
      container.scrollTop = scrollTop - walkY;
    }
  };

  // 드래그 종료
  const onDragEnd = () => {
    setIsDragging(false);
  };

  const [imageOrientations, setImageOrientations] = useState<
    Record<string, 'landscape' | 'portrait'>
  >({});

  const [searchInput, setSearchInput] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  const { data: listData, loading: listLoading } = useQuery(FIND_ALL_CHURCH_BULLETIN_BOARD_QUERY, {
    variables: { input: { page, take: takeAmount, search: searchKeyword } },
    fetchPolicy: 'cache-and-network',
  });

  const { data: sidebarData } = useQuery(FIND_ALL_CHURCH_BULLETIN_BOARD_QUERY, {
    variables: {
      input: {
        page: sidebarPage,
        take: sidebarTake,
        search: searchKeyword,
      },
    },
    fetchPolicy: 'cache-and-network',
  });

  const response = listData?.findAllChurchBulletinBoard;
  const boards = response?.results || [];
  const totalPages = response?.totalPages || 1; // 서버에서 받은 전체 페이지 수

  const sidebarResponse = sidebarData?.findAllChurchBulletinBoard;
  const sidebarBoards = sidebarResponse?.results || [];
  const sidebarTotalPages = sidebarResponse?.totalPages || 1;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchKeyword(searchInput);
    setPage(1);
  };

  const resetSearch = () => {
    setSearchInput('');
    setSearchKeyword('');
    setPage(1);
  };

  useEffect(() => {
    if (viewPdfUrl) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [viewPdfUrl]);

  const paginate = useCallback(
    (newDirection: number) => {
      const nextPage = currPdfPage + newDirection;
      if (nextPage >= 1 && nextPage <= (numPages || 1)) {
        setDirection(newDirection);
        setCurrPdfPage(nextPage);
      }
    },
    [currPdfPage, numPages],
  );

  const closeModal = () => {
    setViewPdfUrl(null);
    setSelectedPostId(null);
    setDisplayTitle('');
    setScale(1.0);
    setCurrPdfPage(1);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (viewPdfUrl) {
        if (e.key === 'ArrowLeft') paginate(-1);
        else if (e.key === 'ArrowRight') paginate(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [viewPdfUrl, paginate]);

  const handleImageLoad = (id: string, e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    const orientation = naturalWidth > naturalHeight ? 'landscape' : 'portrait';
    setImageOrientations((prev) => ({ ...prev, [id]: orientation }));
  };

  const handlePostClick = (post: any) => {
    const pdfUrl = post.fileUrls?.find((url: string) => url.toLowerCase().endsWith('.pdf'));
    if (pdfUrl) {
      setIsRendering(true);
      setViewPdfUrl(pdfUrl);
      setSelectedPostId(post.id);
      setDisplayTitle(post.title);
      const decodedName = decodeURIComponent(pdfUrl.split('/').pop() || '주보 파일');
      setPdfFileName(decodedName);
      setCurrPdfPage(1);
    } else {
      alert('연결된 PDF 파일이 없습니다.');
    }
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setIsRendering(false);
  };

  const changeScale = (delta: number) => {
    setScale((prev) => Math.min(Math.max(prev + delta, 0.5), 2.5));
  };

  const pageVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300, // 다음(>0)이면 오른쪽(300)에서, 이전(<0)이면 왼쪽(-300)에서 등장
      opacity: 0,
      filter: 'brightness(1.2)',
    }),
    center: {
      x: 0,
      opacity: 1,
      filter: 'brightness(1)',
      transition: {
        x: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.2 },
      },
    },
    exit: (direction: number) => ({
      x: direction > 0 ? -300 : 300, // 다음(>0)이면 왼쪽(-300)으로 퇴장, 이전(<0)이면 오른쪽(300)으로 퇴장
      opacity: 0,
      filter: 'brightness(0.8)',
      transition: { duration: 0.3 },
    }),
  };

  const handleDownload = async () => {
    if (!viewPdfUrl) return;
    try {
      const response = await fetch(viewPdfUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', pdfFileName || 'church_bulletin.pdf');
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(viewPdfUrl, '_blank');
    }
  };

  if (listLoading && !listData) return <Message>데이터를 불러오는 중입니다...</Message>;

  return (
    <Container>
      <TidingsWrapper>
        <TidingsTitle onClick={() => setPage(1)}>교회주보</TidingsTitle>
        <SearchForm onSubmit={handleSearch}>
          <SearchInput
            placeholder="주보 제목 검색"
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
      </TidingsWrapper>

      {listLoading ? (
        <Message>데이터를 불러오는 중입니다...</Message>
      ) : (
        <>
          {boards.length === 0 ? (
            <EmptyState>
              <p>
                {searchKeyword
                  ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.`
                  : '등록된 게시물이 없습니다.'}
              </p>
              <ResetBtn onClick={resetSearch}>전체 목록으로 돌아가기</ResetBtn>
            </EmptyState>
          ) : (
            <>
              <PostGrid>
                {boards.map((post: any) => {
                  const orientation = imageOrientations[post.id] || 'portrait';
                  return (
                    <PostCard
                      key={post.id}
                      onClick={() => handlePostClick(post)}
                      className={orientation}
                    >
                      <ThumbnailWrapper orientation={orientation}>
                        {/* 배지를 Wrapper 안쪽, 이미지 위에 배치 */}
                        {isNewPost(post.createdAt) && <NewBadge>NEW</NewBadge>}

                        <Thumbnail
                          src={
                            post.thumbnailUrl || 'https://via.placeholder.com/300x420?text=No+Image'
                          }
                          alt="주보"
                          onLoad={(e) => handleImageLoad(post.id, e)}
                        />
                      </ThumbnailWrapper>
                      <PostInfo>
                        <PostTitle>{post.title}</PostTitle>
                      </PostInfo>
                    </PostCard>
                  );
                })}
              </PostGrid>

              {/* 페이지네이션 UI 위치 */}
              {totalPages > 1 && (
                <PaginationWrapper>
                  <PageMoveBtn
                    disabled={page === 1}
                    onClick={() => {
                      setPage((prev) => prev - 1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    &lt; 이전
                  </PageMoveBtn>

                  <PageNumberGroup>
                    {[...Array(totalPages)].map((_, i) => (
                      <PageNumBtn
                        key={i}
                        $active={page === i + 1}
                        onClick={() => {
                          setPage(i + 1);
                          window.scrollTo(0, 0);
                        }}
                      >
                        {i + 1}
                      </PageNumBtn>
                    ))}
                  </PageNumberGroup>

                  <PageMoveBtn
                    disabled={page === totalPages}
                    onClick={() => {
                      setPage((prev) => prev + 1);
                      window.scrollTo(0, 0);
                    }}
                  >
                    다음 &gt;
                  </PageMoveBtn>
                </PaginationWrapper>
              )}
            </>
          )}
        </>
      )}

      {viewPdfUrl &&
        createPortal(
          <FullOverlay onClick={closeModal}>
            <ViewerWindow onClick={(e) => e.stopPropagation()}>
              <Toolbar>
                {/* 제목과 New 배지를 감싸는 그룹 추가 */}
                <TitleGroup>
                  {/* 현재 선택된 게시물이 New인지 확인 */}
                  {boards.find((b: any) => b.id === selectedPostId) &&
                    isNewPost(boards.find((b: any) => b.id === selectedPostId).createdAt) && (
                      <NewBadgeInToolbar>NEW</NewBadgeInToolbar>
                    )}
                  <FileName title={displayTitle}>{displayTitle}</FileName>
                </TitleGroup>

                <ZoomControls>
                  <SmallButton onClick={() => changeScale(-0.2)}>-</SmallButton>
                  <ZoomInfo>{Math.round(scale * 100)}%</ZoomInfo>
                  <SmallButton onClick={() => changeScale(0.2)}>+</SmallButton>
                </ZoomControls>

                <ActionButtons>
                  <IconButton onClick={handleDownload}>💾 다운로드</IconButton>
                  <CloseButton onClick={closeModal}>✕ 닫기</CloseButton>
                </ActionButtons>
              </Toolbar>

              <MainContentArea>
                {!isSidebarOpen && (
                  <SidebarHint onMouseEnter={() => setIsSidebarOpen(true)}>
                    <span>목록</span>
                    <div className="arrow">▶</div>
                  </SidebarHint>
                )}

                <HoverTrigger onMouseEnter={() => setIsSidebarOpen(true)} />

                <PostSidebar
                  $isOpen={isSidebarOpen}
                  onMouseLeave={() => setIsSidebarOpen(false)}
                >
                  <SidebarHeader>게시물 목록</SidebarHeader>
                  <SidebarList>
                    {sidebarBoards.map((post: any) => {
                      const orientation = imageOrientations[post.id] || 'portrait';
                      return (
                        <SidebarItem
                          key={post.id}
                          $active={selectedPostId === post.id}
                          $orientation={orientation}
                          onClick={() => handlePostClick(post)}
                        >
                          <SidebarThumbWrapper $orientation={orientation}>
                            <SidebarThumb
                              src={post.thumbnailUrl}
                              alt="thumb"
                              onLoad={(e) => handleImageLoad(post.id, e)}
                            />
                          </SidebarThumbWrapper>
                          {boards.find((b: any) => b.id === selectedPostId) &&
                            isNewPost(
                              boards.find((b: any) => b.id === selectedPostId).createdAt,
                            ) && <NewBadgeInToolbar>NEW</NewBadgeInToolbar>}
                          <SidebarPostTitle>{post.title}</SidebarPostTitle>
                        </SidebarItem>
                      );
                    })}
                  </SidebarList>
                  {sidebarTotalPages > 1 && (
                    <SidebarPagination>
                      <SidebarPageBtn
                        disabled={sidebarPage === 1}
                        onClick={() => setSidebarPage((p) => p - 1)}
                      >
                        ‹
                      </SidebarPageBtn>

                      <SidebarPageInfo>
                        {sidebarPage} / {sidebarTotalPages}
                      </SidebarPageInfo>

                      <SidebarPageBtn
                        disabled={sidebarPage === sidebarTotalPages}
                        onClick={() => setSidebarPage((p) => p + 1)}
                      >
                        ›
                      </SidebarPageBtn>
                    </SidebarPagination>
                  )}
                </PostSidebar>

                <PdfViewContainer>
                  <PdfScrollArea
                    ref={scrollAreaRef}
                    onMouseDown={onDragStart}
                    onMouseMove={onDragMove}
                    onMouseUp={onDragEnd}
                    onMouseLeave={onDragEnd}
                    $isZoomed={scale > 1.0}
                    $isDragging={isDragging}
                  >
                    <div
                      style={{
                        // margin: 'auto'는 Flex 부모 안에서 자식이 부모보다 클 때
                        // 시작점(0,0)을 보존하며 중앙 정렬을 시도하므로 좌우 잘림이 없습니다.
                        margin: 'auto',
                        minWidth: '100%',
                        minHeight: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <AnimatePresence
                        mode="wait"
                        custom={direction}
                      >
                        <motion.div
                          // key에 viewPdfUrl을 포함하면 파일 변경 시에도 애니메이션 작동
                          key={`${viewPdfUrl}-${currPdfPage}`}
                          custom={direction} // variants에 direction 전달
                          variants={pageVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          style={{
                            display: 'inline-block',
                            position: 'relative',
                            userSelect: 'none',
                            transformOrigin: 'center center',
                          }}
                        >
                          <Document
                            file={viewPdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={<div style={{ color: 'white' }}>PDF 로딩 중...</div>}
                          >
                            <Page
                              pageNumber={currPdfPage}
                              scale={scale}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                            />
                          </Document>
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </PdfScrollArea>

                  <BottomNavigation>
                    <NavButton
                      disabled={currPdfPage <= 1}
                      onClick={() => paginate(-1)}
                    >
                      이전
                    </NavButton>
                    <PageIndicator>
                      {currPdfPage} / {numPages}
                    </PageIndicator>
                    <NavButton
                      disabled={currPdfPage >= numPages}
                      onClick={() => paginate(1)}
                    >
                      다음
                    </NavButton>
                  </BottomNavigation>
                </PdfViewContainer>
              </MainContentArea>
            </ViewerWindow>
          </FullOverlay>,
          document.body,
        )}
    </Container>
  );
}

export default Bulletin;

// --- Styled Components ---

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 50px 20px 200px;
`;

const TidingsWrapper = styled.div`
  border-bottom: 2px solid #333;
  margin-bottom: 40px;
  padding-bottom: 15px;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
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
  font-size: 0.9rem;
  width: 200px;
  outline: none;
  &:focus {
    border-color: #333;
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
  color: #666;
  text-decoration: underline;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 0 5px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 100px 0;
  color: #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
`;

const TidingsTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  cursor: pointer;
`;

const PostGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-auto-flow: dense;
  gap: 30px 20px;
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const NewBadge = styled.span`
  position: absolute;
  top: 10px; /* 상단에서 10px 띄움 */
  left: 10px; /* 좌측에서 10px 띄움 (우측을 원하시면 right: 10px로 변경) */
  z-index: 10; /* 이미지보다 위에 보이도록 설정 */

  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: bold;
  padding: 4px 8px;
  border-radius: 4px;
  line-height: 1;
  text-transform: uppercase;
  background-color: #ff4d4f;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); /* 배지가 더 잘 보이도록 그림자 추가 */
  pointer-events: none; /* 배지 클릭 시에도 카드 클릭 이벤트가 발생하도록 설정 */
`;

/* 페이지네이션 스타일 추가 */
const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  margin-top: 60px;
`;

const PageNumberGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const PageNumBtn = styled.button<{ $active: boolean }>`
  width: 35px;
  height: 35px;
  border-radius: 4px;
  border: 1px solid ${(props) => (props.$active ? '#333' : '#ddd')};
  background: ${(props) => (props.$active ? '#333' : '#fff')};
  color: ${(props) => (props.$active ? '#fff' : '#333')};
  font-weight: bold;
  cursor: pointer;
  &:hover {
    background: ${(props) => (props.$active ? '#333' : '#f5f5f5')};
  }
`;

const PageMoveBtn = styled.button`
  padding: 6px 12px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    color: #ccc;
    cursor: not-allowed;
  }
`;

const PostCard = styled.div`
  cursor: pointer;
  border: 1px solid #eee;
  background: #fff;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  &.landscape {
    grid-column: span 2;
  }
  @media (max-width: 480px) {
    &.landscape {
      grid-column: span 1;
    }
  }
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
  }
`;

const ThumbnailWrapper = styled.div<{ orientation: string }>`
  width: 100%;
  aspect-ratio: ${(props) => (props.orientation === 'landscape' ? '1.6 / 1' : '1 / 1.414')};
  overflow: hidden;
  background-color: #f5f5f5;
  /* 추가: 자식 요소(NewBadge)의 기준점이 됨 */
  position: relative;
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PostInfo = styled.div`
  text-align: center;
  padding: 15px 10px;
`;

const PostTitle = styled.h3`
  font-size: clamp(0.85rem, 2vw, 1rem);
  font-weight: 600;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const FullOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99999999;
`;

const Toolbar = styled.div`
  height: 55px;
  background: #1a1a1b;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 25px;
  color: white;
  border-bottom: 1px solid #444;
`;

// 툴바 내 제목과 배지를 묶어주는 컨테이너
const TitleGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  overflow: hidden; /* 제목이 길어질 경우 대비 */
`;

// 모달 툴바 전용 New 배지 스타일
const NewBadgeInToolbar = styled.span`
  background-color: #ff4d4f;
  color: white;
  font-size: 0.65rem;
  font-weight: bold;
  padding: 2px 6px;
  border-radius: 3px;
  flex-shrink: 0; /* 배지 크기가 줄어들지 않도록 고정 */
  line-height: 1.2;
`;

// 기존 FileName 수정 (flex: 1 제거하여 배지와 밀착되게 함)
const FileName = styled.div`
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #8ab4f8;
`;

const SidebarHint = styled.div`
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 120px;
  background: rgba(138, 180, 248, 0.3);
  border-radius: 0 8px 8px 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 100;
  color: white;
  font-size: 10px;
  font-weight: bold;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  span {
    writing-mode: vertical-rl;
    letter-spacing: 2px;
  }
`;

const HoverTrigger = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 100%;
  z-index: 99;
`;

const PostSidebar = styled.div<{ $isOpen: boolean }>`
  width: 280px;
  background: #252526;
  border-right: 1px solid #444;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 101;
  transition: transform 0.3s ease;
  transform: ${(props) => (props.$isOpen ? 'translateX(0)' : 'translateX(-100%)')};

  /* 추가: 내부 요소를 수직으로 배치 */
  display: flex;
  flex-direction: column;
`;

const SidebarHeader = styled.div`
  padding: 15px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #ccc;
  border-bottom: 1px solid #333;
`;

const SidebarList = styled.div`
  /* 수정: flex-grow를 1로 설정하여 남는 공간을 다 채우도록 함 */
  flex: 1;
  overflow-y: auto;
  padding: 10px;

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-thumb {
    background: #444;
    border-radius: 3px;
  }
`;

const SidebarItem = styled.div<{ $active: boolean; $orientation?: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  background: ${(props) => (props.$active ? '#37373d' : 'transparent')};
  border: 1px solid ${(props) => (props.$active ? '#007acc' : 'transparent')};
  &:hover {
    background: #2a2d2e;
  }
`;

const SidebarThumbWrapper = styled.div<{ $orientation: string }>`
  width: ${(props) => (props.$orientation === 'landscape' ? '70px' : '50px')};
  aspect-ratio: ${(props) => (props.$orientation === 'landscape' ? '1.6 / 1' : '1 / 1.414')};
  overflow: hidden;
  background-color: #333;
`;

const SidebarThumb = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SidebarPostTitle = styled.div`
  flex: 1;
  font-size: 0.85rem;
  color: #eee;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const SidebarPagination = styled.div`
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  background: #252526; /* 사이드바 배경색과 통일 */
  border-top: 1px solid #333; /* 구분선 */

  /* 중요: 항상 바닥에 붙어 있도록 함 */
  margin-top: auto;
`;

const SidebarPageBtn = styled.button`
  background: #444;
  color: white;
  border: none;
  padding: 4px 10px;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
`;

const SidebarPageInfo = styled.div`
  font-size: 0.8rem;
  color: #aaa;
`;

const PdfViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1b;
  position: relative;
`;
const PdfScrollArea = styled.div<{ $isZoomed: boolean; $isDragging: boolean }>`
  flex: 1;
  overflow: auto; /* 확대 시 스크롤 발생 */
  position: relative;
  background: #1a1a1b;
  cursor: ${(props) => (!props.$isZoomed ? 'default' : props.$isDragging ? 'grabbing' : 'grab')};

  /* 스크롤바 디자인 (필요 시 유지) */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;

  /* 핵심: 자식이 부모보다 작을 때는 중앙, 클 때는 스크롤 가능하게 함 */
  display: flex;
`;

const MainContentArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
`;

const ViewerWindow = styled.div`
  width: 98%;
  height: 96%;
  background: #1a1a1b;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
`;

const ZoomControls = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  background: #333;
  padding: 5px 10px;
  border-radius: 20px;
`;
const ZoomInfo = styled.span`
  color: white;
  font-size: 0.8rem;
  min-width: 40px;
  text-align: center;
`;
const SmallButton = styled.button`
  background: #555;
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  cursor: pointer;
`;
const ActionButtons = styled.div`
  display: flex;
  gap: 15px;
`;
const IconButton = styled.button`
  background: #8ab4f8;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
`;
const CloseButton = styled.button`
  background: #f28b82;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-top: 3px solid #8ab4f8;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const Message = styled.div<{ color?: string }>`
  text-align: center;
  font-size: 0.9rem;
  color: ${(props) => props.color || '#333'};
`;
const BottomNavigation = styled.div`
  height: 60px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
  border-top: 1px solid #444;
`;
const NavButton = styled.button`
  background: #444;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  &:disabled {
    opacity: 0.3;
  }
`;
const PageIndicator = styled.div`
  color: white;
  font-weight: bold;
`;
