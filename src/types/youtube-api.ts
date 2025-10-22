import { IGetPlaylist, Video } from './types';

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
const channelId = process.env.REACT_APP_YOUTUBE_CHANNEL_ID;

const sundayPlaylistId = process.env.REACT_APP_YOUTUBE_SUNDAYPLAYLIST_ID;
const fridayPlaylistId = process.env.REACT_APP_YOUTUBE_FRIDAYPLAYLIST_ID;
const specialPraiseId = process.env.REACT_APP_YOUTUBE_SPECIAL_PRAISE_ID;
const wednesdayPraiseId = process.env.REACT_APP_YOUTUBE_WEDNESDAY_PRAISE_ID;
const sundayPraiseId = process.env.REACT_APP_YOUTUBE_SUNDAY_PRAISE_ID;
const youthWorshipId = process.env.REACT_APP_YOUTUBE_YOUTH_WORSHIP_ID;

export async function fetchYouTubeChannelInfo(): Promise<IGetPlaylist[]> {
  // 1️⃣ 채널 재생목록 가져오기
  const res = await fetch(
    `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${apiKey}`,
  );
  const data = await res.json();
  let playlistsWithVideos: IGetPlaylist[] = data.items || [];

  // 마지막 요소 제거
  playlistsWithVideos = playlistsWithVideos.slice(0, -2);

  // 2️⃣ 각 재생목록에 있는 영상 모두 가져오기
  for (let playlist of playlistsWithVideos) {
    let videos: Video[] = [];
    let nextPageToken = '';
    do {
      const videoRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist.id}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`,
      );
      const videoData = await videoRes.json();

      // ❌ title이 "Private video"인 영상 제외
      const filteredVideos = videoData.items.filter(
        (video: Video) => video.snippet.title !== 'Private video',
      );

      videos = [...videos, ...filteredVideos];
      nextPageToken = videoData.nextPageToken || '';
    } while (nextPageToken);

    playlist.videos = videos; // playlist에 videos 속성 추가
  }

  return playlistsWithVideos; // ✅ useState 없이 순수 반환
}

/** 특정 playlistId 안의 모든 영상 조회 */
async function fetchPlaylistVideos(playlistId: string): Promise<Video[]> {
  let videos: Video[] = [];
  let nextPageToken = '';

  do {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`,
    );
    const data = await res.json();

    const filtered = (data.items || [])
      .filter((video: Video) => video.snippet.title !== 'Private video')
      .map((video: Video) => ({
        ...video,
        videoId: video.snippet.resourceId?.videoId ?? `${video.id}`,
      }));

    videos = [...videos, ...filtered];
    nextPageToken = data.nextPageToken || '';
  } while (nextPageToken);

  return videos;
}

async function getSortedVideos(playlistId: string): Promise<Video[]> {
  const videos = await fetchPlaylistVideos(playlistId);
  return videos
    .sort(
      (a, b) =>
        new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime(),
    )
    .slice(0, 12);
}

export async function fetchLatestVideosFromMainSundayWorshipPlaylists(): Promise<Video[]> {
  if (!sundayPlaylistId) {
    throw new Error('Sunday Playlist ID is not defined');
  }
  return getSortedVideos(sundayPlaylistId);
}

export async function fetchLatestVideosFromMainFridayWorshipPlaylists(): Promise<Video[]> {
  if (!fridayPlaylistId) {
    throw new Error('Friday Playlist ID is not defined');
  }
  return getSortedVideos(fridayPlaylistId);
}

/** 최신순 정렬 */
async function getSupPageVideoSortedVideos(playlistId: string): Promise<Video[]> {
  const videos = await fetchPlaylistVideos(playlistId);
  return videos.sort(
    (a, b) => new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime(),
  );
}

/** ✅ 페이지네이션 기능이 포함된 함수 */
async function getPageNationVideos(
  playlistId: string,
  page: number = 1,
  itemsPerPage: number = 16,
): Promise<{ videos: Video[]; totalPages: number }> {
  const allVideos = await getSupPageVideoSortedVideos(playlistId);

  const totalPages = Math.ceil(allVideos.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const paginatedVideos = allVideos.slice(startIndex, endIndex);

  return { videos: paginatedVideos, totalPages };
}

export async function fetchFromSundayWorshipPlaylists(
  page: number = 1,
  itemsPerPage: number = 16,
): Promise<{ videos: Video[]; totalPages: number }> {
  if (!sundayPlaylistId) {
    throw new Error('Sunday Playlist ID is not defined');
  }
  return getPageNationVideos(sundayPlaylistId, page, itemsPerPage);
}

export async function fetchFromFridayWorshipPlaylists(
  page: number = 1,
  itemsPerPage: number = 16,
): Promise<{ videos: Video[]; totalPages: number }> {
  if (!fridayPlaylistId) {
    throw new Error('Friday Playlist ID is not defined');
  }
  return getPageNationVideos(fridayPlaylistId, page, itemsPerPage);
}

export async function fetchFromSpecialPlaylists(
  page: number = 1,
  itemsPerPage: number = 16,
): Promise<{ videos: Video[]; totalPages: number }> {
  console.log('이거 왜없어?', specialPraiseId, wednesdayPraiseId, sundayPraiseId, youthWorshipId);
  if (!specialPraiseId || !wednesdayPraiseId || !sundayPraiseId || !youthWorshipId) {
    throw new Error('Special ID is not defined');
  }

  // ✅ 각 재생목록의 영상 불러오기
  const [specialVideos, wednesdayVideos, sundayVideos, youthVideos] = await Promise.all([
    getSupPageVideoSortedVideos(specialPraiseId),
    getSupPageVideoSortedVideos(wednesdayPraiseId),
    getSupPageVideoSortedVideos(sundayPraiseId),
    getSupPageVideoSortedVideos(youthWorshipId),
  ]);

  // ✅ 모든 영상 합치기
  const allVideos = [...specialVideos, ...wednesdayVideos, ...sundayVideos, ...youthVideos];

  // ✅ 최신순으로 정렬
  const sortedVideos = allVideos.sort(
    (a, b) => new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime(),
  );

  // ✅ 페이지네이션 계산
  const totalPages = Math.ceil(sortedVideos.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedVideos = sortedVideos.slice(startIndex, endIndex);

  // ✅ 결과 반환
  return { videos: paginatedVideos, totalPages };
}
