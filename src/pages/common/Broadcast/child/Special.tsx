import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Video } from '../../../../types/types';
import { fetchFromSpecialPlaylists } from '../../../../types/youtube-api';
import styled from 'styled-components';

function Special() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageGroup, setPageGroup] = useState<number>(0); // 현재 페이지 그룹 (0부터 시작)
  const maxVisible = 6; // 한 번에 보일 페이지 버튼 수

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const { videos, totalPages } = await fetchFromSpecialPlaylists(currentPage, 9);
        setVideos(videos);
        setTotalPages(totalPages);
      } catch (err) {
        console.error(err);
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

  return (
    <SpecialWrapper>
      <SpecialTitle>기타영상</SpecialTitle>

      {/* 영상 리스트 */}
      <SpecialVideoGrid>
        {videos.map((video) => (
          <SpecialVideoCard key={video.id || video.videoId}>
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
