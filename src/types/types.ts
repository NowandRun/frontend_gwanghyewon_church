  export interface MenuItem {
	path: string;
	subtitle?: string;
	label: string;
	children?: MenuItem[];
  }

// src/types/types.ts
  export interface Playlist {
	id: string;
	snippet: {
	  title: string;
	  description: string;
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
	id: string;
	snippet: {
	  title: string;
	  description: string;
	  thumbnails: {
		default: { url: string };
		medium: { url: string };
		high: { url: string };
	  };
	};
  }