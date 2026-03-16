import { useQuery } from '@apollo/client';
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import dayjs from 'dayjs';
import {
  FIND_ALL_CHURCH_INFORMATION_BOARD_QUERY,
  FIND_CHURCH_INFORMATION_BOARD_BY_ID_QUERY,
} from 'src/types/grapql_call';

// --- ImageModal 컴포넌트 (동일) ---
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

  const handleZoomIn = () => setScale((prev) => Math.min(prev + 0.5, 3));
  const handleZoomOut = () => setScale((prev) => Math.max(prev - 0.5, 0.5));
  const resetZoom = () => setScale(1);

  const goToPrev = useCallback(() => {
    setIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    resetZoom();
  }, [images.length]);

  const goToNext = useCallback(() => {
    setIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    resetZoom();
  }, [images.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose, goToPrev, goToNext]);

  return createPortal(
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <TopFloatingBar>
          <div className="title-group">
            <h3>{title}</h3>
          </div>
          <div className="action-group">
            <ZoomControls>
              <button onClick={handleZoomOut}>－</button>
              <span
                className="scale-text"
                onClick={resetZoom}
              >
                {Math.round(scale * 100)}%
              </span>
              <button onClick={handleZoomIn}>＋</button>
            </ZoomControls>
            <CloseIconButton onClick={onClose}>✕</CloseIconButton>
          </div>
        </TopFloatingBar>

        <MainViewerContainer>
          <SideNavButton
            className="left"
            onClick={goToPrev}
            title="이전"
          >
            〈
          </SideNavButton>
          <ViewerContentWrapper>
            <ImageWrapper>
              <img
                src={images[index]}
                style={{ transform: `scale(${scale})` }}
                alt={`slide-${index}`}
              />
            </ImageWrapper>
            <ImagePagination>
              {index + 1} / {images.length}
            </ImagePagination>
          </ViewerContentWrapper>
          <SideNavButton
            className="right"
            onClick={goToNext}
            title="다음"
          >
            〉
          </SideNavButton>
        </MainViewerContainer>
      </ModalContent>
    </ModalOverlay>,
    document.body,
  );
}

// --- 메인 News 컴포넌트 ---
function News() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [page, setPage] = useState(1);
  const [modalData, setModalData] = useState<{
    images: string[];
    index: number;
    title: string;
  } | null>(null);

  const takeAmount = 10;

  // 1. 전체 리스트 쿼리
  const { data: listData, loading: listLoading } = useQuery(
    FIND_ALL_CHURCH_INFORMATION_BOARD_QUERY,
    {
      variables: { input: { page, take: takeAmount } },
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

  const response = listData?.findAllChurchInformationBoard;
  const boards = response?.results || [];
  const totalPages = response?.totalPages || 1;
  const totalCount = response?.totalResults || 0; // totalCount -> totalResults로 매칭 확인 필요
  const boardResult = detailData?.findChurchInformationBoardById?.result;

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
    if (selectedId) window.scrollTo({ top: 0, behavior: 'smooth' });
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
              <BackButton onClick={() => setSelectedId(null)}>✕ 목록으로 돌아가기</BackButton>
              <DetailHeader>
                <div className="title-area">
                  {boardResult?.isPinned && (
                    <NoticeBadge style={{ verticalAlign: 'middle', marginRight: '10px' }}>
                      공지
                    </NoticeBadge>
                  )}
                  <h1>{boardResult?.title}</h1>
                </div>
                <p>
                  {dayjs(boardResult?.createdAt).format('YYYY년 MM월 DD일')} | {boardResult?.author}
                </p>
              </DetailHeader>

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
            </DetailView>
          )}
          <Divider />
        </DetailSection>
      )}

      {/* --- 하단: 전체 목록 섹션 --- */}
      <ListSection>
        <SectionTitle>{selectedId ? '다른 소식 보기' : '전체 목록'}</SectionTitle>

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
              {boards.map((post: any, index: number) => {
                const isCurrent = selectedId === post.id;
                const isNotice = post.isPinned; // ✅ 공지글 판별

                const displayNum =
                  totalCount > 0
                    ? totalCount - ((page - 1) * takeAmount + index)
                    : boards.length - index;

                return (
                  <TableRow
                    key={post.id}
                    $isActive={isCurrent}
                    $isNotice={isNotice} // ✅ 공지글 스타일 적용
                    onClick={() => setSelectedId(post.id)}
                  >
                    <td className="num">
                      {isCurrent ? (
                        <span className="active-dot">●</span>
                      ) : isNotice ? (
                        <NoticeBadge>공지</NoticeBadge> // ✅ 숫자 대신 '공지' 배지
                      ) : displayNum > 0 ? (
                        displayNum
                      ) : (
                        index + 1
                      )}
                    </td>
                    <td className="title-cell">
                      <div className="title-content">
                        {isNotice && <span className="notice-label">[공지]</span>}
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
              })}
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

// --- 스타일 컴포넌트 ---

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
  background-color: #fff1f0;
  color: #e74c3c;
  border: 1px solid #ffccc7;
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

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(10, 10, 10, 0.98);
  z-index: 10000;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ModalContent = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

const TopFloatingBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7), transparent);
  color: white;
  h3 {
    font-size: 1.1rem;
    font-weight: 500;
    margin: 0;
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
  background: rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 4px 12px;
  button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
  }
  .scale-text {
    font-size: 0.85rem;
    min-width: 50px;
    text-align: center;
  }
`;

const CloseIconButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background: #e74c3c;
  }
`;

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

const MainViewerContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const ViewerContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  img {
    max-width: 95%;
    max-height: 90%;
    object-fit: contain;
  }
`;

const ImagePagination = styled.div`
  position: absolute;
  bottom: 40px;
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
`;

const SideNavButton = styled.button`
  position: absolute;
  width: 80px;
  height: 100%;
  background: none;
  border: none;
  color: white;
  font-size: 2.5rem;
  cursor: pointer;
  z-index: 10;
  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  &.left {
    left: 0;
  }
  &.right {
    right: 0;
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
