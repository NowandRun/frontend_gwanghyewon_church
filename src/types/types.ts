export interface MenuItem {
  path: string;
  subtitle?: string;
  label: string;
  children?: MenuItem[];
}

interface Thumbnail {
  url: string;
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
  videoId?: string; // ✅ 우리가 추가하는 필드
  snippet: {
    title: string;
    description: string;
    publishedAt: string;
    thumbnails: {
      default?: { url: string };
      medium?: { url: string };
      high?: { url: string };
      maxres?: Thumbnail; // ✅ 추가
    };
    resourceId: {
      kind: string;
      videoId: string;
    };
  };
}

export interface MainVideos {
  sunday: Video[];
  friday: Video[];
}

// src/constants/subPageBannerImages.ts
export const SubPageBannerImages = {
  Pastor: process.env.PUBLIC_URL + '/images/SubPage/250923-SubPage-배너-담임목사-사진.png',
  School: process.env.PUBLIC_URL + '/images/SubPage/250923-SubPage-배너-주일학교.png',
  Worship: process.env.PUBLIC_URL + '/images/SubPage/250923-SubPage-배너-예배.png',
} as const;

// 타입은 객체의 key를 그대로 활용
export type SubPageBannerImageKey = keyof typeof SubPageBannerImages;
