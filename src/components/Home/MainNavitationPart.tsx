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
