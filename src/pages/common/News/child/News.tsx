import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import {
  FIND_ALL_CHURCH_INFORMATION_BOARD_QUERY,
  FIND_CHURCH_INFORMATION_BOARD_BY_ID_QUERY,
} from 'src/types/grapql_call';

/* -------------------------------------------------------------------------- */
/* ImageModal                                 */
/* -------------------------------------------------------------------------- */
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

// --- 메인 News 컴포넌트 ---
function News() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isFileOpen, setIsFileOpen] = useState(false); // 드롭다운 상태 추가
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  const [searchInput, setSearchInput] = useState(''); // 입력 필드용
  const [searchKeyword, setSearchKeyword] = useState(''); // 실제 검색 실행용

  const takeAmount = 12;

  // 1. 전체 리스트 쿼리
  // 2. 전체 리스트 쿼리 (search 필드 포함)
  const { data: listData, loading: listLoading } = useQuery(
    FIND_ALL_CHURCH_INFORMATION_BOARD_QUERY,
    {
      variables: {
        input: {
          page,
          take: takeAmount,
          search: searchKeyword, // 검색어 변수 전달
        },
      },
      fetchPolicy: 'cache-and-network',
    },
  );

  // 2. 상세 데이터 쿼리
  const { data: detailData, loading: detailLoading } = useQuery(
    FIND_CHURCH_INFORMATION_BOARD_BY_ID_QUERY,
    {
      variables: { id: selectedId ? parseFloat(selectedId.toString()) : 0 },
      skip: !selectedId,
    },
  );

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

  const response = listData?.findAllChurchInformationBoard;
  const boards = response?.results || [];
  const totalPages = response?.totalPages || 1;
  const totalCount = response?.totalResults || 0; // totalCount -> totalResults로 매칭 확인 필요
  const boardResult = detailData?.findChurchInformationBoardById?.result;

  // 게시글이 바뀔 때 드롭다운 초기화
  useEffect(() => {
    setIsFileOpen(false);
  }, [selectedId]);

  // 파일 다운로드 핸들러
  const handleDownload = (url: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    // 다운로드 시 파일명 지정 (브라우저 정책에 따라 작동하지 않을 수 있음)
    link.download = url.split('/').pop() || 'download';
    link.click();
  };

  const parsedBlocks = useMemo(() => {
    if (!boardResult?.blocks) return [];
    return typeof boardResult.blocks === 'string'
      ? JSON.parse(boardResult.blocks)
      : boardResult.blocks;
  }, [boardResult]);

  const imagesInContent = useMemo(() => {
    return parsedBlocks
      .filter((block: any) => block.type === 'IMAGE')
      .map((block: any) => block.url);
  }, [parsedBlocks]);

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
            resetSearch();
          }}
          style={{ cursor: 'pointer' }}
        >
          교회소식
        </TidingsTitle>
      </TidingsWrapper>

      {/* --- 상단: 상세 페이지 섹션 --- */}
      {selectedId && (
        <DetailSection>
          {detailLoading ? (
            <Message>상세 내용을 불러오는 중...</Message>
          ) : (
            <DetailView>
              <DetailHeader>
                <div className="title-area">
                  {boardResult?.isPinned && (
                    <NoticeBadge style={{ marginRight: '10px' }}>공지</NoticeBadge>
                  )}
                  <h1>{boardResult?.title}</h1>
                </div>
                <p>
                  {dayjs(boardResult?.createdAt).format('YYYY년 MM월 DD일')} | {boardResult?.author}
                </p>
              </DetailHeader>

              {/* --- 수정된 드롭다운 첨부파일 영역 --- */}
              {boardResult?.fileUrls && boardResult.fileUrls.length > 0 && (
                <FileDropdownWrapper>
                  <DropdownButton
                    onClick={() => setIsFileOpen(!isFileOpen)}
                    $isOpen={isFileOpen}
                  >
                    <div className="left">
                      <span className="icon">📎</span>
                      <span className="label">첨부파일</span>
                      <span className="count">{boardResult.fileUrls.length}</span>
                    </div>
                    <span className="arrow">{isFileOpen ? '▲' : '▼'}</span>
                  </DropdownButton>

                  {isFileOpen && (
                    <DropdownList>
                      {boardResult.fileUrls.map((url: string, index: number) => {
                        const fileName = decodeURIComponent(
                          url.split('/').pop() || `첨부파일_${index + 1}`,
                        );
                        return (
                          <FileDownloadLink
                            key={index}
                            onClick={() => {
                              handleDownload(url); // 1. 파일 다운로드 실행
                              setIsFileOpen(false); // 2. 드롭다운 닫기
                            }}
                          >
                            <span className="file-name">{fileName}</span>
                            <span className="dl-icon">💾 다운로드</span>
                          </FileDownloadLink>
                        );
                      })}
                    </DropdownList>
                  )}
                </FileDropdownWrapper>
              )}

              <ContentRender>
                {parsedBlocks.map((block: any, idx: number) => {
                  if (block.type === 'TEXT')
                    return (
                      <HtmlBlock
                        key={idx}
                        dangerouslySetInnerHTML={{ __html: block.content }}
                      />
                    );
                  if (block.type === 'IMAGE') {
                    const imgIndex = imagesInContent.indexOf(block.url);
                    return (
                      <ImageBlock
                        key={idx}
                        onClick={() =>
                          setModalData({
                            images: imagesInContent,
                            index: imgIndex,
                            title: boardResult?.title || '이미지 상세보기',
                          })
                        }
                      >
                        <img
                          src={block.url}
                          alt=""
                        />
                        <div className="zoom-overlay">🔍 크게 보기</div>
                      </ImageBlock>
                    );
                  }
                  return null;
                })}
              </ContentRender>
              <BackButton onClick={() => setSelectedId(null)}>✕ 목록으로 돌아가기</BackButton>
            </DetailView>
          )}
          <Divider />
        </DetailSection>
      )}

      {/* --- 하단: 전체 목록 섹션 --- */}
      <ListSection>
        <ListHeader>
          <SectionTitle>{selectedId ? '다른 소식 보기' : '전체 목록'}</SectionTitle>

          {/* --- 검색창 추가 --- */}
          <SearchForm onSubmit={handleSearch}>
            <SearchInput
              placeholder="제목 또는 작성자 검색"
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

        <TableContainer>
          <BoardTable>
            <thead>
              <tr>
                <th style={{ width: '80px' }}>번호</th>
                <th>제목</th>
                <th style={{ width: '120px' }}>작성자</th>
                <th style={{ width: '120px' }}>작성일</th>
              </tr>
            </thead>
            <tbody>
              {listLoading && boards.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <Message>불러오는 중...</Message>
                  </td>
                </tr>
              ) : boards.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <Message>
                      {searchKeyword
                        ? `"${searchKeyword}"에 대한 검색 결과가 없습니다.`
                        : '등록된 게시물이 없습니다.'}
                    </Message>
                  </td>
                </tr>
              ) : (
                boards.map((post: any, index: number) => {
                  const isCurrent = selectedId === post.id;
                  const isNotice = post.isPinned;
                  const displayNum =
                    totalCount > 0
                      ? totalCount - ((page - 1) * takeAmount + index)
                      : boards.length - index;

                  return (
                    <TableRow
                      key={post.id}
                      $isActive={isCurrent}
                      $isNotice={isNotice}
                      onClick={() => setSelectedId(post.id)}
                    >
                      <td className="num">
                        {isCurrent ? (
                          <span className="active-dot">●</span>
                        ) : isNotice ? (
                          <NoticeBadge>공지</NoticeBadge>
                        ) : (
                          displayNum
                        )}
                      </td>
                      <td className="title-cell">
                        <div className="title-content">
                          <span className="title-text">{post.title}</span>
                          {isCurrent && <span className="reading-label">읽는 중</span>}
                          {post.fileUrls && post.fileUrls.length > 0 && (
                            <span className="file-icon">📎</span>
                          )}
                        </div>
                      </td>
                      <td className="author">{post.author || '관리자'}</td>
                      <td className="date">{dayjs(post.createdAt).format('YYYY.MM.DD')}</td>
                    </TableRow>
                  );
                })
              )}
            </tbody>
          </BoardTable>
        </TableContainer>

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

      {modalData && (
        <ImageModal
          images={modalData.images}
          currentIndex={modalData.index}
          title={modalData.title}
          onClose={() => setModalData(null)}
        />
      )}
    </Container>
  );
}

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
// --- 스타일 컴포넌트 ---
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
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  outline: none;
  width: 200px;
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
  font-size: 0.9rem;
`;

const Container = styled.div`
  padding-bottom: 200px;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`;

const TidingsWrapper = styled.div`
  margin-bottom: 50px;
  padding-top: 40px;
`;

const TidingsTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: bold;
`;

const NoticeBadge = styled.span`
  background-color: #e6f7ff; /* 아주 연한 파란색 배경 */
  color: #1890ff; /* 선명한 파란색 텍스트 */
  border: 1px solid #91d5ff; /* 중간 톤의 파란색 테두리 */
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  display: inline-block;
`;

const TableRow = styled.tr<{ $isActive?: boolean; $isNotice?: boolean }>`
  cursor: pointer;
  background-color: ${(props) =>
    props.$isActive ? '#f0faff' : props.$isNotice ? '#fdfdfd' : 'transparent'};

  &:hover {
    background-color: ${(props) => (props.$isActive ? '#f0faff' : '#f8f8f8')};
    .title-text {
      text-decoration: underline;
    }
  }

  .num {
    color: ${(props) => (props.$isActive ? '#3498db' : '#999')};
  }

  .title-cell {
    text-align: left;
    padding-left: 20px;
  }

  .title-content {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .notice-label {
    color: #e74c3c;
    font-weight: bold;
    font-size: 0.9rem;
    flex-shrink: 0;
  }

  .title-text {
    color: ${(props) => (props.$isActive ? '#3498db' : '#333')};
    font-weight: ${(props) => (props.$isNotice ? '600' : '400')}; // 공지글 제목 볼드처리
    max-width: 500px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .reading-label {
    background: #3498db;
    color: white;
    font-size: 0.7rem;
    padding: 2px 6px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .file-icon {
    font-size: 0.9rem;
    color: #aaa;
  }

  .active-dot {
    font-weight: bold;
  }

  @media (max-width: 768px) {
    .author,
    .date {
      display: none;
    }
  }
`;

// --- 나머지 스타일은 기존과 동일하거나 위 코드에 맞춰 최적화됨 ---

const TableContainer = styled.div`
  width: 100%;
  overflow-x: auto;
  border-top: 2px solid #333;
`;

const BoardTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  th {
    padding: 15px 10px;
    background: #f9f9f9;
    border-bottom: 1px solid #ddd;
    color: #333;
    font-weight: 600;
  }
  td {
    padding: 15px 10px;
    border-bottom: 1px solid #eee;
    color: #555;
    text-align: center;
  }
`;

const DetailSection = styled.section`
  margin-bottom: 80px;
`;
const ListSection = styled.section`
  margin-top: 50px;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 25px;
  border-left: 4px solid #3498db;
  padding-left: 15px;
`;

const Divider = styled.div`
  height: 1px;
  background: #eee;
  margin: 80px 0 40px 0;
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
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 50px;
`;

const PageButton = styled.button`
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  &:disabled {
    color: #ccc;
  }
`;

const PageNumber = styled.span<{ $active: boolean }>`
  cursor: pointer;
  padding: 5px 12px;
  border-radius: 4px;
  background: ${(props) => (props.$active ? '#3498db' : 'transparent')};
  color: ${(props) => (props.$active ? '#fff' : '#333')};
`;

const DetailView = styled.div`
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
  .title-area {
    display: flex;
    align-items: center;
  }
  h1 {
    font-size: 2rem;
    margin: 0;
  }
`;
const FileDropdownWrapper = styled.div`
  margin-bottom: 30px;
  border: 1px solid #ddd;
  border-radius: 4px;

  /* 핵심 수정 사항 */
  max-width: 400px; /* 기존 유지 혹은 필요에 따라 조절 */
  margin-left: auto; /* 왼쪽 마진을 auto로 주어 오른쪽으로 밀어냄 */

  position: relative;
  background: #fff;

  /* 모바일 대응: 화면이 작아지면 다시 중앙이나 전체 너비로 */
  @media (max-width: 768px) {
    max-width: 100%;
    margin-left: 0;
  }
`;
const DropdownButton = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  background: ${(props) => (props.$isOpen ? '#f8f9fa' : '#fff')};
  cursor: pointer;
  transition: background 0.2s;
  /* 추가: 열려있을 때 하단 모서리를 직각으로 만들어 리스트와 연결된 느낌 부여 */
  border-radius: ${(props) => (props.$isOpen ? '4px 4px 0 0' : '4px')};

  &:hover {
    background: #f8f9fa;
  }

  .left {
    display: flex;
    align-items: center;
    gap: 10px;
    .icon {
      font-size: 1.1rem;
    }
    .label {
      font-weight: 600;
      font-size: 0.95rem;
      color: #333;
    }
    .count {
      background: #3498db;
      color: white;
      font-size: 0.75rem;
      padding: 1px 7px;
      border-radius: 10px;
    }
  }
  .arrow {
    font-size: 0.8rem;
    color: #888;
  }
`;

const DropdownList = styled.div`
  position: absolute; // 추가: 본문 흐름에서 제외
  top: 100%; // 추가: 버튼 바로 아래에 위치
  left: -1px; // 추가: 좌측 테두리 맞춤 (Wrapper 테두리 두께 고려)
  right: -1px; // 추가: 우측 테두리 맞춤
  background: #fff;
  border: 1px solid #ddd; // 추가: 리스트 전용 테두리
  border-top: none;
  border-radius: 0 0 4px 4px;
  z-index: 10; // 추가: 본문 내용보다 위에 표시되도록 함
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); // 추가: 떠 있는 느낌을 위한 그림자
  padding: 5px 0;
`;

const FileDownloadLink = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  cursor: pointer;
  border-bottom: 1px hidden #f0f0f0;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background: #f0f7ff;
    .file-name {
      color: #3498db;
      text-decoration: underline;
    }
  }

  .file-name {
    font-size: 0.9rem;
    color: #555;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 20px;
  }

  .dl-icon {
    font-size: 0.8rem;
    color: #3498db;
    font-weight: 500;
    flex-shrink: 0;
  }
`;

const ContentRender = styled.div`
  display: flex;
  flex-direction: column;
`;
const HtmlBlock = styled.div`
  font-size: 1.1rem;
  line-height: 1.8;
  margin-bottom: 15px;
`;

const ImageBlock = styled.div`
  position: relative;
  margin: 20px 0;
  cursor: zoom-in;
  img {
    width: 100%;
    border-radius: 8px;
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
  }
  &:hover .zoom-overlay {
    opacity: 1;
  }
`;

const Message = styled.div`
  text-align: center;
  padding: 50px;
`;

export default News;
