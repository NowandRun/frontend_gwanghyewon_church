  export interface MenuItem {
	path: string;
	subtitle?: string;
	label: string;
	children?: MenuItem[];
  }

// src/types/types.ts
  export interface IGetPlaylist {
	id: string;
	snippet: {
	  title: string;
	  description: string;
	  publishedAt: string;
	  thumbnails: {
		default: { url: string };
		medium: { url: string };
		high: { url: string };
	  };
	};
	contentDetails: {
	  itemCount: number;
	};
	videos?: Video[]; // 각 재생목록 영상 저장
  }
  
  export interface Video {
	id: string; // playlistItemId
	snippet: {
	  title: string;
	  description: string;
	  publishedAt: string;
	  thumbnails: {
		default?: { url: string };
		medium?: { url: string };
		high?: { url: string };
	  };
	  resourceId: {
		kind: string;
		videoId: string; // ✅ 실제 영상 id
	  };
	};
  }

  export interface MainVideos {
	sunday: Video[];
	friday: Video[];
  }
  