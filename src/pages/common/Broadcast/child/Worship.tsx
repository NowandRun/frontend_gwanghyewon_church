import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IGetPlaylist, Video } from '../../../../types/types';
import {
  fetchFromSundayWorshipPlaylists,
  fetchYouTubeChannelInfo,
} from '../../../../types/youtube-api';
import { useNavigate } from 'react-router-dom';

function Worship() {
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
        const { videos, totalPages } = await fetchFromSundayWorshipPlaylists(currentPage, 9);
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
    // 페이지 이동 시, 그룹이 바뀌었는데 현재 페이지가 범위 밖이면 맞춰줌
    if (currentPage < startPage || currentPage > endPage) {
      setCurrentPage(startPage);
    }
  }, [pageGroup]);

  /** ✅ 영상 클릭 시 VideoDetail로 이동 + video 데이터 전달 */
  const handleVideoClick = (video: Video) => {
    navigate(`${video.videoId}`, { state: { video, sectionName: '주일설교' } }); // /broadcast/friday/:videoId
  };

  return (
    <WorshipWrapper>
      <WorshipTitle>주일설교</WorshipTitle>

      {/* ✅ 로딩 중 */}
      {loading ? (
        <WorshipLoadingWrapper>
          <WorshipSkeletonGrid>
            {Array.from({ length: 9 }).map((_, idx) => (
              <WorshipSkeletonCard key={idx}>
                <WorshipSkeletonThumb />
                <WorshipSkeletonText />
              </WorshipSkeletonCard>
            ))}
          </WorshipSkeletonGrid>

          {/* ✅ 스켈레톤 위로 겹치게 올림 */}
          <WorshipLoadingOverlay>
            <Spinner />
            <WorshipLoadingText>영상을 불러오는 중입니다...</WorshipLoadingText>
          </WorshipLoadingOverlay>
        </WorshipLoadingWrapper>
      ) : (
        <>
          {/* ✅ 영상 리스트 */}
          <WorshipVideoGrid>
            {videos.map((video) => (
              <WorshipVideoCard
                key={video.videoId}
                onClick={() => handleVideoClick(video)}
              >
                <WorshipThumbnail
                  src={video.snippet.thumbnails?.medium?.url || ''}
                  alt={video.snippet.title}
                />
                <WorshipVideoTitle>{video.snippet.title}</WorshipVideoTitle>
              </WorshipVideoCard>
            ))}
          </WorshipVideoGrid>

          {/* ✅ 페이지네이션 */}
          <WorshipPaginationWrapper>
            {totalPages > maxVisible && (
              <WorshipPagnationArrowButton
                onClick={handlePrevGroup}
                disabled={pageGroup === 0}
              >
                〈
              </WorshipPagnationArrowButton>
            )}

            {pagesToShow.map((page) => (
              <WorshipPageNationButton
                key={page}
                onClick={() => setCurrentPage(page)}
                disabled={page === currentPage}
                active={page === currentPage}
              >
                {page}
              </WorshipPageNationButton>
            ))}

            {totalPages > maxVisible && (
              <WorshipPagnationArrowButton
                onClick={handleNextGroup}
                disabled={(pageGroup + 1) * maxVisible >= totalPages}
              >
                〉
              </WorshipPagnationArrowButton>
            )}
          </WorshipPaginationWrapper>
        </>
      )}
    </WorshipWrapper>
  );
}

export default Worship;

const WorshipWrapper = styled.div`
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

const WorshipTitle = styled.div`
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

const WorshipLoadingWrapper = styled.div`
  width: 100%;
  position: relative; /* ✅ overlay를 위한 기준 컨테이너 */
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 2rem;
`;

const WorshipLoadingOverlay = styled.div`
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

const WorshipLoadingText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #444;
  font-weight: 500;
`;

const WorshipSkeletonGrid = styled.div`
  margin-top: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  width: 100%;
`;

const WorshipSkeletonCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WorshipSkeletonThumb = styled.div`
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

const WorshipSkeletonText = styled.div`
  width: 80%;
  height: 16px;
  margin-top: 0.8rem;
  border-radius: 6px;
  background: #ececec;
`;

/* ✅ 썸네일 리스트 그리드 */
const WorshipVideoGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  list-style: none;
  padding: 0;
  margin-top: 2rem;
`;

/* ✅ 개별 영상 카드 */
const WorshipVideoCard = styled.li`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const WorshipThumbnail = styled.img`
  width: 100%;
  height: auto;
  border-radius: 10px;
  object-fit: cover;
`;

const WorshipVideoTitle = styled.p`
  margin-top: 0.8rem;
  font-size: 1rem;
  text-align: center;
`;

/* ✅ 새로운 페이지네이션 스타일 */
const WorshipPaginationWrapper = styled.div`
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

const WorshipPageNationButton = styled.button<{ active?: boolean }>`
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

const WorshipPagnationArrowButton = styled(WorshipPageNationButton)`
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
