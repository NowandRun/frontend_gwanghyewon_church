import React from 'react';
import {
  ChurchIcon,
  ChartLineUpIcon,
  CrossIcon,
  GlobeHemisphereEastIcon,
  HandHeartIcon,
  HeartbeatIcon,
  CalendarCheckIcon,
  FilesIcon,
  YoutubeLogoIcon,
  MonitorArrowUpIcon,
} from '@phosphor-icons/react';

export const menuItems = [
  {
    path: 'info',
    subtitle: 'about church',
    label: '교회소개',
    children: [
      {
        path: '',
        label: '담임목사 인사말',
      },
      {
        path: 'minister',
        label: '섬기는분들',
      },
      {
        path: 'guide',
        label: '예배안내',
      },
      {
        path: 'location',
        label: '찾아오시는 길',
      },
    ],
  },
  {
    path: 'youth',
    subtitle: 'youth',
    label: '교회학교',
    children: [
      {
        path: '',
        label: '하꿈주일학교',
      },
      {
        path: 'students',
        label: '예람청소년부',
      },
      {
        path: 'young-adult',
        label: '하람청년부',
      },
    ],
  },
  {
    path: 'broadcast',
    subtitle: 'gs broadcast',
    label: 'GS방송',
    children: [
      {
        path: '',
        label: '주일설교',
      },
      {
        path: 'friday',
        label: '금요설교',
      },
      {
        path: 'special',
        label: '기타영상',
      },
    ],
  },
  {
    path: 'group',
    subtitle: '새가족',
    label: '새가족',
    children: [
      {
        path: '',
        label: '새가족',
      },
      {
        path: 'worship',
        label: '예배',
      },
      {
        path: 'nurture',
        label: '양육',
      },
      {
        path: 'baptism',
        label: '세례',
      },
      {
        path: 'ministration',
        label: '봉사',
      },
    ],
  },
  {
    path: 'news',
    subtitle: 'news',
    label: '교회소식',
    children: [
      {
        path: '',
        label: '교회소식',
      },
      {
        path: 'album',
        label: '교우동정',
      },
      {
        path: 'bulletin',
        label: '교회주보',
      },
    ],
  },
  {
    path: 'offering',
    subtitle: 'online offering',
    label: '온라인 헌금',
    children: [
      {
        path: '',
        label: '온라인 헌금',
      },
    ],
  },
];

export const mainVidoeTopText = `환영합니다!\n광혜원순복음교회입니다.`;

export const ministryItems = [
  {
    title: '교회소개',
    icon: <ChurchIcon />,
    description: ['하나님과 함께하는', '행복한 교회를', '소개합니다'],
    href: '/info',
  },
  {
    title: '교회학교',
    icon: <CrossIcon />,
    description: ['다음세대가', '성장하는', '교회학교입니다'],
    href: '/youth',
  },
  {
    title: 'GS방송',
    icon: <GlobeHemisphereEastIcon />,
    description: ['GS방송은', '말씀과 함께 성장하는', '온라인 방송입니다'],
    href: '/broadcast',
  },
  {
    title: '새가족',
    icon: <HandHeartIcon />,
    description: ['환영합니다', '축복합니다', '사랑합니다'],
    href: '/group',
  },
];

export const HomeSecondNavItems = [
  {
    title: '예배안내',
    icon: <CalendarCheckIcon />,
    href: '/info',
  },
  {
    title: '양육',
    icon: <ChartLineUpIcon />,
    href: '/group/nurture',
  },
  {
    title: '봉사',
    icon: <HeartbeatIcon />,
    href: '/group/ministration',
  },
  {
    title: '교회주보',
    icon: <FilesIcon />,
    href: '/youth',
  },
  {
    title: '유튜브채널',
    icon: <YoutubeLogoIcon />,
    href: 'https://www.youtube.com/@Mrssomman',
  },
  {
    title: '온라인행정',
    icon: <MonitorArrowUpIcon />,
    href: '/group',
  },
];
