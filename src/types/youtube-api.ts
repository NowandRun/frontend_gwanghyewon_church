import { IGetPlaylist, Video } from './types';

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
const channelId = process.env.REACT_APP_YOUTUBE_CHANNEL_ID;

const sundayPlaylistId = process.env.REACT_APP_YOUTUBE_SUNDAYPLAYLIST_ID;
const fridayPlaylistId = process.env.REACT_APP_YOUTUBE_FRIDAYPLAYLIST_ID;

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

/* 

export async function fetchLatestVideosFromMainPlaylists(): Promise<MainVideos> {
	if (!sundayPlaylistId || !fridayPlaylistId) {
	  throw new Error("Playlist IDs are not defined in environment variables");
	}
  
	const [sundayVideos, fridayVideos] = await Promise.all([
	  fetchPlaylistVideos(sundayPlaylistId),
	  fetchPlaylistVideos(fridayPlaylistId),
	]);
  
	const allVideos = {"sunday": [...sundayVideos],"friday": [...fridayVideos]};
  
	// 최신순 정렬
	const sundaySorted = allVideos.sunday.sort(
	  (a, b) =>
		new Date(b.snippet.publishedAt).getTime() -
		new Date(a.snippet.publishedAt).getTime()
	).slice(0, 12);

	// 최신순 정렬
	const fridaySorted = allVideos.friday.sort(
		(a, b) =>
		  new Date(b.snippet.publishedAt).getTime() -
		  new Date(a.snippet.publishedAt).getTime()
	  ).slice(0, 12);
  
	// 최신 12개만 반환
	return {"sunday":sundaySorted, "friday":fridaySorted};
  } */
