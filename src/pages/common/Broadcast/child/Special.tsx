import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Video } from '../../../../types/types';
import { fetchFromSpecialPlaylists } from '../../../../types/youtube-api';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

function Special() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageGroup, setPageGroup] = useState<number>(0); // 현재 페이지 그룹 (0부터 시작)
  const [loading, setLoading] = useState<boolean>(true); // ✅ 로딩 상태 추가
  const maxVisible = 6; // 한 번에 보일 페이지 버튼 수
  const navigate = useNavigate(); // <-- useNavigate 훅

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const { videos, totalPages } = await fetchFromSpecialPlaylists(currentPage, 9);
        setVideos(videos);
        setTotalPages(totalPages);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false); // ✅ 요청 완료 후
      }
    };
    loadVideos();
  }, [currentPage]);

  //console.log('videos❤️❤️❤️👀👀', videos);
  // 현재 페이지 그룹에 따라 보여줄 페이지 계산
  const startPage = pageGroup * maxVisible + 1;
  const endPage = Math.min(startPage + maxVisible - 1, totalPages);
  const pagesToShow = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  const handlePrevGroup = () => {
    if (pageGroup > 0) setPageGroup((prev) => prev - 1);
  };

  const handleNextGroup = () => {
    if ((pageGroup + 1) * maxVisible < totalPages) setPageGroup((prev) => prev + 1);
  };

  useEffect(() => {
    if (currentPage < startPage || currentPage > endPage) {
      setCurrentPage(startPage);
    }
  }, [pageGroup, startPage, endPage]);

  /** ✅ 영상 클릭 시 VideoDetail로 이동 + video 데이터 전달 */
  const handleVideoClick = (video: Video) => {
    navigate(`${video.videoId}`, { state: { video, sectionName: '기타영상' } }); // /broadcast/friday/:videoId
  };

  return (
    <SpecialWrapper>
      <SpecialTitle>기타영상</SpecialTitle>
      {loading ? (
        <SpecialLoadingWrapper>
          <SpecialSkeletonGrid>
            {Array.from({ length: 9 }).map((_, idx) => (
              <SpecialSkeletonCard key={idx}>
                <SpecialSkeletonThumb />
                <SpecialSkeletonText />
              </SpecialSkeletonCard>
            ))}
          </SpecialSkeletonGrid>

          {/* ✅ 스켈레톤 위로 겹치게 올림 */}
          <SpecialLoadingOverlay>
            <Spinner />
            <SpecialLoadingText>영상을 불러오는 중입니다...</SpecialLoadingText>
          </SpecialLoadingOverlay>
        </SpecialLoadingWrapper>
      ) : (
        <>
          {/* 영상 리스트 */}
          <SpecialVideoGrid>
            {videos.map((video) => (
              <SpecialVideoCard
                key={video.id || video.videoId}
                onClick={() => handleVideoClick(video)}
              >
                <SpecialThumbnail
                  src={video.snippet.thumbnails?.medium?.url || ''}
                  alt={video.snippet.title}
                />
                <SpecialVideoTitle>{video.snippet.title}</SpecialVideoTitle>
              </SpecialVideoCard>
            ))}
          </SpecialVideoGrid>

          {/* ✅ 페이지네이션 */}
          <SpecialPaginationWrapper>
            {totalPages > maxVisible && (
              <SpecialPagnationArrowButton
                onClick={handlePrevGroup}
                disabled={pageGroup === 0}
              >
                〈
              </SpecialPagnationArrowButton>
            )}

            {pagesToShow.map((page) => (
              <SpecialPageNationButton
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={page === currentPage}
                active={page === currentPage}
              >
                {page}
              </SpecialPageNationButton>
            ))}

            {totalPages > maxVisible && (
              <SpecialPagnationArrowButton
                onClick={handleNextGroup}
                disabled={(pageGroup + 1) * maxVisible >= totalPages}
              >
                〉
              </SpecialPagnationArrowButton>
            )}
          </SpecialPaginationWrapper>
        </>
      )}
    </SpecialWrapper>
  );
}

export default Special;

const SpecialWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: 8vw;
  ${({ theme }) => theme.media.tablet} {
    margin-top: 2vw;
  }
  ${({ theme }) => theme.media.mobile} {
    position: static;
  }
`;

const SpecialTitle = styled.div`
  font-size: 1.5vw;
  height: 3vw;
  padding: 2vw 0;
  display: flex;
  align-items: center;
  ${({ theme }) => theme.media.tablet} {
    height: 4vw; /* 예: 60px 고정 */
    padding: 3vw 0;
    font-size: 3vw;
  }
`;

const SpecialLoadingWrapper = styled.div`
  width: 100%;
  position: relative; /* ✅ overlay를 위한 기준 컨테이너 */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const SpecialLoadingOverlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: 10; /* ✅ 스켈레톤보다 위 */
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(2px); /* ✅ 살짝 흐리게 */
  background: rgba(255, 255, 255, 0.4); /* ✅ 투명 배경 */
`;

const Spinner = styled.div`
  width: 48px;
  height: 48px;
  border: 4px solid #ddd;
  border-top: 4px solid #0056ff;
  border-radius: 50%;
  animation: spin 0.9s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const SpecialLoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #444;
  font-weight: 500;
`;

const SpecialSkeletonGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

const SpecialSkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpecialSkeletonThumb = styled.div`
  width: 100%;
  height: 180px;
  border-radius: 10px;
  background: linear-gradient(90deg, #e2e2e2 25%, #f5f5f5 50%, #e2e2e2 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
  @keyframes shimmer {
    to {
      background-position: -200% 0;
    }
  }
`;

const SpecialSkeletonText = styled.div`
  width: 80%;
  height: 16px;
  margin-top: 0.8rem;
  border-radius: 6px;
  background: #ececec;
`;

/* ✅ 썸네일 리스트 그리드 */
const SpecialVideoGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

/* ✅ 개별 영상 카드 */
const SpecialVideoCard = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const SpecialThumbnail = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
`;

const SpecialVideoTitle = styled.p`
  margin-top: 0.8rem;
  font-size: 1rem;
  text-align: center;
`;

/* ✅ 새로운 페이지네이션 스타일 */
const SpecialPaginationWrapper = styled.div`
  margin-top: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;

  ${({ theme }) => theme.media.mobile} {
    gap: 0.4rem;
  }
`;

const SpecialPageNationButton = styled.button<{ active?: boolean }>`
  min-width: 40px;
  height: 40px;
  padding: 0 0.8rem;
  border: none;
  background: transparent;
  color: ${({ active }) => (active ? '#0056ff' : '#444')};
  font-size: 1rem;
  font-weight: ${({ active }) => (active ? '700' : '500')};
  border-bottom: 3px solid ${({ active }) => (active ? '#0056ff' : 'transparent')};
  cursor: pointer;
  transition: all 0.25s ease;

  &:hover {
    color: #0056ff;
    border-bottom: 3px solid #0056ff;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }

  ${({ theme }) => theme.media.mobile} {
    min-width: 34px;
    height: 34px;
    font-size: 0.9rem;
  }
`;

const SpecialPagnationArrowButton = styled(SpecialPageNationButton)`
  color: #777;
  font-size: 1.2rem;
  border: none;
  &:hover {
    color: #0056ff;
    transform: translateY(-1px);
  }
  &:disabled {
    color: #ccc;
    border: none;
    transform: none;
  }
`;
