import React, { useState, useEffect } from "react";
import { Playlist, Video } from "../types/types";

function YouTubeChannelInfo() {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const apiKey = process.env.REACT_APP_YOUTUBE_API_KEY;
  const channelId = "UCnzWgg8gW2dNAEH_6EiCD3A";

  useEffect(() => {
    const fetchPlaylists = async () => {
      try {
        // 1️⃣ 채널 재생목록 가져오기
        const res = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet,contentDetails&channelId=${channelId}&maxResults=50&key=${apiKey}`
        );
        const data = await res.json();
        let playlistsWithVideos: Playlist[] = data.items;

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

        setPlaylists(playlistsWithVideos);
      } catch (err) {
        console.error("Error fetching playlists:", err);
      }
    };

    fetchPlaylists();
  }, [apiKey, channelId]);

  if (!playlists.length) return <div>Loading playlists...</div>;
  console.log("❤️❤️❤️❤️❤️🤩🤩🤩🤩",playlists)
  return (
    <div>
      <h2>Playlists & Videos</h2>
      {playlists.map((playlist) => (
        <div key={playlist.id} style={{ marginBottom: "30px" }}>
          <h3>{playlist.snippet.title}</h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {playlist.videos?.map((video) => (
              <div key={video.id} style={{ width: "200px" }}>
                <img
                  src={
                    video.snippet.thumbnails?.medium?.url ||
                    video.snippet.thumbnails?.default?.url ||
                    ""
                  }
                  alt={video.snippet.title}
                  style={{ width: "100%" }}
                />
                <p>{video.snippet.title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default YouTubeChannelInfo;
