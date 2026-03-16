import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React, { useState, useMemo, useEffect, useCallback } from 'react';
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
  title, // title 프롭 추가
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
        {/* 상단 플로팅 바 */}
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

        {/* 메인 뷰어 */}
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
  const takeAmount = 9;

  // 1. 전체 리스트 쿼리 (항상 실행)
  const { data: listData, loading: listLoading } = useQuery(FIND_ALL_CHURCH_ALBUM_BOARD_QUERY, {
    variables: { input: { page, take: takeAmount } },
  });

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
              <BackButton onClick={() => setSelectedId(null)}>✕ 상세 닫기</BackButton>
              <DetailHeader>
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
            </DetailView>
          )}
          <Divider /> {/* 상세와 목록 사이의 구분선 */}
        </DetailSection>
      )}

      {/* --- 하단: 전체 게시물 목록 섹션 (항상 출력) --- */}
      <ListSection>
        <SectionTitle>{selectedId ? '다른 게시물 보기' : '전체 목록'}</SectionTitle>
        <PostGrid>
          {boards.map((post: any) => (
            <PostCard
              key={post.id}
              $isActive={selectedId === post.id} // 현재 보고 있는 게시물 강조
              onClick={() => setSelectedId(post.id)}
            >
              <Thumbnail
                src={post.thumbnailUrl || '/default-thumb.png'}
                alt="thumb"
              />
              <PostInfo>
                <PostTitle>{post.title}</PostTitle>
                <PostDate>{dayjs(post.createdAt).format('YYYY.MM.DD')}</PostDate>
              </PostInfo>
              {selectedId === post.id && <ActiveBadge>읽는 중</ActiveBadge>}
            </PostCard>
          ))}
        </PostGrid>

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
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.7) 0%, transparent 100%);
  color: white;

  .title-group h3 {
    font-size: 1.1rem;
    font-weight: 500;
    color: #efefef;
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
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  button {
    background: none;
    border: none;
    color: white;
    font-size: 1.2rem;
    cursor: pointer;
    padding: 0 10px;
    &:hover {
      color: #3498db;
    }
  }

  .scale-text {
    font-size: 0.85rem;
    min-width: 50px;
    text-align: center;
    cursor: pointer;
  }
`;

const CloseIconButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  &:hover {
    background: #e74c3c;
  }
`;

const MainViewerContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 0;
  overflow: hidden;
`;

const ViewerContentWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const ImageWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    transition: transform 0.1s ease-out;
  }
`;

const ImagePagination = styled.div`
  position: absolute;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
  color: #fff;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  backdrop-filter: blur(5px);
  z-index: 20;
`;

const SideNavButton = styled.button`
  position: absolute;
  top: 0;
  bottom: 0;
  width: 80px;
  background: rgba(0, 0, 0, 0);
  color: white;
  border: none;
  font-size: 2.5rem;
  cursor: pointer;
  z-index: 15;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
    font-size: 3rem;
  }
  &.left {
    left: 0;
  }
  &.right {
    right: 0;
  }
`;

const ControlBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  padding: 10px 0;
  .count {
    font-size: 1rem;
  }
  .zoom-btns {
    display: flex;
    gap: 15px;
    align-items: center;
    button {
      background: #333;
      border: none;
      color: white;
      padding: 5px 12px;
      border-radius: 4px;
      cursor: pointer;
    }
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.1rem;
  cursor: pointer;
`;

const ImageContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  .img-wrapper {
    transition: all 0.2s ease-out;
    display: flex;
    align-items: center;
    justify-content: center;
    img {
      max-width: 100%;
      max-height: 80vh;
      object-fit: contain;
      transition: transform 0.2s ease-in-out;
    }
  }
`;

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 20px 10px;
  cursor: pointer;
  z-index: 10;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  &.left {
    left: 0;
  }
  &.right {
    right: 0;
  }
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
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
