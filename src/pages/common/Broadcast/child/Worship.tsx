import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { IGetPlaylist, Video } from '../../../../types/types';
import {
  fetchFromSundayWorshipPlaylists,
  fetchYouTubeChannelInfo,
} from '../../../../types/youtube-api';

function Worship() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [allVidoes, setAllVideos] = useState<IGetPlaylist[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageGroup, setPageGroup] = useState<number>(0); // 현재 페이지 그룹 (0부터 시작)
  const maxVisible = 6; // 한 번에 보일 페이지 버튼 수

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const { videos, totalPages } = await fetchFromSundayWorshipPlaylists(currentPage, 9);
        const allVideosData = await fetchYouTubeChannelInfo();
        setAllVideos(allVideosData);
        setVideos(videos);
        setTotalPages(totalPages);
      } catch (err) {
        console.error(err);
      }
    };

    loadVideos();
  }, [currentPage]);

  //console.log('videos❤️❤️❤️👀👀', videos);
  console.log('allVideos✨✨✨🍬', allVidoes);
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

  return (
    <WorshipWrapper>
      <WorshipTitle>주일설교</WorshipTitle>

      {/* 영상 리스트 */}
      <WorshipVideoGrid>
        {videos.map((video) => (
          <WorshipVideoCard key={video.videoId}>
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
