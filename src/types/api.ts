import { IGetPlaylist, Video } from "./types";

const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
const channelId = "UCnzWgg8gW2dNAEH_6EiCD3A";

export async function fetchYouTubeChannelInfo(): Promise<IGetPlaylist[]> {

		// 1️⃣ 채널 재생목록 가져오기
		const res = await fetch(
		  `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${apiKey}`
		);
		const data = await res.json();
		let playlistsWithVideos: IGetPlaylist[] = data.items || [];

		// 마지막 요소 제거
		playlistsWithVideos = playlistsWithVideos.slice(0, -2);

		// 2️⃣ 각 재생목록에 있는 영상 모두 가져오기
		for (let playlist of playlistsWithVideos) {
		  let videos: Video[] = [];
		  let nextPageToken = "";
		  do {
			const videoRes = await fetch(
			  `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlist.id}&maxResults=50&pageToken=${nextPageToken}&key=${apiKey}`
			);
			const videoData = await videoRes.json();

						// ❌ title이 "Private video"인 영상 제외
			const filteredVideos = videoData.items.filter(
				(video: Video) => video.snippet.title !== "Private video"
				);
			
			videos = [...videos, ...filteredVideos];
			nextPageToken = videoData.nextPageToken || "";
		  } while (nextPageToken);

		  playlist.videos = videos; // playlist에 videos 속성 추가
		}

		return playlistsWithVideos; // ✅ useState 없이 순수 반환
	};


