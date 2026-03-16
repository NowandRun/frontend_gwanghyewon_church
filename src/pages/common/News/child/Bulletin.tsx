import { useQuery } from '@apollo/client';
import React, { useEffect, useState, useCallback } from 'react';
import { FIND_ALL_CHURCH_BULLETIN_BOARD_QUERY } from 'src/types/grapql_call';
import styled from 'styled-components';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

function Bulletin() {
  const [page, setPage] = useState(1);
  const takeAmount = 12;
  const [viewPdfUrl, setViewPdfUrl] = useState<string | null>(null);
  const [pdfFileName, setPdfFileName] = useState<string>(''); // 다운로드용 파일명
  const [displayTitle, setDisplayTitle] = useState<string>(''); // 툴바에 표시될 게시물 제목
  const [numPages, setNumPages] = useState<number>(0);
  const [currPdfPage, setCurrPdfPage] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [direction, setDirection] = useState(0);
  const [isRendering, setIsRendering] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [imageOrientations, setImageOrientations] = useState<
    Record<string, 'landscape' | 'portrait'>
  >({});

  const { data: listData, loading: listLoading } = useQuery(FIND_ALL_CHURCH_BULLETIN_BOARD_QUERY, {
    variables: { input: { page, take: takeAmount } },
    fetchPolicy: 'cache-and-network',
  });

  // 모달이 열릴 때 배경 스크롤 방지
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

  const boards = listData?.findAllChurchBulletinBoard?.results || [];

  const handlePostClick = (post: any) => {
    const pdfUrl = post.fileUrls?.find((url: string) => url.toLowerCase().endsWith('.pdf'));
    if (pdfUrl) {
      setIsRendering(true);
      setViewPdfUrl(pdfUrl);
      setSelectedPostId(post.id);
      setDisplayTitle(post.title); // 게시물 제목을 상단 바 제목으로 설정
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
      rotateY: direction > 0 ? 90 : -90,
      x: direction > 0 ? '50%' : '-50%',
      opacity: 0,
    }),
    center: {
      rotateY: 0,
      x: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] },
    },
    exit: (direction: number) => ({
      rotateY: direction < 0 ? 90 : -90,
      x: direction < 0 ? '50%' : '-50%',
      opacity: 0,
      transition: { duration: 0.6 },
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
      </TidingsWrapper>

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
                <Thumbnail
                  src={post.thumbnailUrl || 'https://via.placeholder.com/300x420?text=No+Image'}
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

      {viewPdfUrl &&
        createPortal(
          <FullOverlay onClick={closeModal}>
            <ViewerWindow onClick={(e) => e.stopPropagation()}>
              <Toolbar>
                {/* PDF 파일명이 아닌 게시물 제목(displayTitle)을 출력 */}
                <FileName title={displayTitle}>{displayTitle}</FileName>
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
                    {boards.map((post: any) => {
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
                          <SidebarPostTitle>{post.title}</SidebarPostTitle>
                        </SidebarItem>
                      );
                    })}
                  </SidebarList>
                </PostSidebar>

                <PdfViewContainer>
                  <PdfScrollArea>
                    {(isRendering || listLoading) && (
                      <LoadingOverlay>
                        <div className="spinner"></div>
                        <Message color="white">PDF 문서를 준비 중입니다...</Message>
                      </LoadingOverlay>
                    )}
                    <div
                      style={{
                        perspective: '1200px',
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        position: 'relative',
                      }}
                    >
                      <AnimatePresence
                        initial={false}
                        custom={direction}
                        mode="wait"
                      >
                        <motion.div
                          key={viewPdfUrl + currPdfPage}
                          custom={direction}
                          variants={pageVariants}
                          initial="enter"
                          animate="center"
                          exit="exit"
                          style={{ position: 'absolute' }}
                        >
                          <Document
                            file={viewPdfUrl}
                            onLoadSuccess={onDocumentLoadSuccess}
                            loading={null}
                          >
                            <Page
                              pageNumber={currPdfPage}
                              scale={scale}
                              renderTextLayer={false}
                              renderAnnotationLayer={false}
                              onRenderSuccess={() => setIsRendering(false)}
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

// --- Styled Components (기존 유지) ---
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
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  ${PostCard}:hover & {
    transform: scale(1.05);
  }
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

const FileName = styled.div`
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #8ab4f8; /* 게시물 제목임을 강조하기 위해 약간의 색상 변경 */
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
  transition: all 0.2s ease;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-left: none;

  span {
    writing-mode: vertical-rl;
    text-orientation: mixed;
    margin-bottom: 5px;
    letter-spacing: 2px;
  }

  .arrow {
    font-size: 8px;
    transition: transform 0.2s ease;
  }

  &:hover {
    background: rgba(138, 180, 248, 0.6);
    width: 32px;
    .arrow {
      transform: translateX(3px);
    }
  }
`;

const HoverTrigger = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 32px;
  height: 100%;
  z-index: 99;
  background: transparent;
`;

const PostSidebar = styled.div<{ $isOpen: boolean }>`
  width: 280px;
  background: #252526;
  border-right: 1px solid #444;
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 101;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform: ${(props) => (props.$isOpen ? 'translateX(0)' : 'translateX(-100%)')};
  box-shadow: ${(props) => (props.$isOpen ? '15px 0 30px rgba(0, 0, 0, 0.7)' : 'none')};

  @media (max-width: 768px) {
    width: 240px;
  }
`;

const SidebarHeader = styled.div`
  padding: 15px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #ccc;
  border-bottom: 1px solid #333;
`;

const SidebarItem = styled.div<{ $active: boolean; $orientation?: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 8px;
  background: ${(props) => (props.$active ? '#37373d' : 'transparent')};
  border: 1px solid ${(props) => (props.$active ? '#007acc' : 'transparent')};
  transition: background 0.2s ease;

  &:hover {
    background: #2a2d2e;
  }
`;

const SidebarThumbWrapper = styled.div<{ $orientation: string }>`
  flex-shrink: 0;
  width: ${(props) => (props.$orientation === 'landscape' ? '70px' : '50px')};
  aspect-ratio: ${(props) => (props.$orientation === 'landscape' ? '1.6 / 1' : '1 / 1.414')};
  overflow: hidden;
  border-radius: 3px;
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
  line-height: 1.4;
`;

const PdfScrollArea = styled.div`
  flex: 1;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background: #1a1a1b;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const MainContentArea = styled.div`
  flex: 1;
  display: flex;
  overflow: hidden;
  position: relative;
`;

const SidebarList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  -ms-overflow-style: none;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const ViewerWindow = styled.div`
  width: 98%;
  height: 96%;
  background: #1a1a1b;
  display: flex;
  flex-direction: column;
  border-radius: 4px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5);
`;

const PdfViewContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #1a1a1b;
  position: relative;
  width: 100%;
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
  font-size: 0.8rem;
`;

const CloseButton = styled.button`
  background: #f28b82;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  font-size: 0.8rem;
`;

const LoadingOverlay = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
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
    cursor: not-allowed;
  }
`;

const PageIndicator = styled.div`
  color: white;
  font-weight: bold;
`;
