import React from 'react';
import { RouteObject } from 'react-router-dom';
import {
  Home,
  Info,
  Greeting,
  Minister,
  Guide,
  Location,
  Youth,
  Elementary,
  Students,
  YoungAdult,
  Broadcast,
  Worship,
  Friday,
  Special,
  Group,
  NewPeople,
  NewPeopleWorship,
  Upbringing,
  Baptism,
  Service,
  News,
  Tidings,
  Album,
  Bulletin,
  Offering,
  Online,
  VideoDetail,
} from '../components/pageImports';

// ✅ 각 페이지를 key-value 형태로 정리
export const componentMap: Record<string, React.ComponentType<any>> = {
  '/': Home,

  'info': Info,
  'info/': Greeting,
  'info/minister': Minister,
  'info/guide': Guide,
  'info/location': Location,

  'youth': Youth,
  'youth/': Elementary,
  'youth/students': Students,
  'youth/young-adult': YoungAdult,

  'broadcast': Broadcast,
  'broadcast/': Worship,
  'broadcast/friday': Friday,
  'broadcast/special': Special,

  'group': Group,
  'group/': NewPeople,
  'group/worship': NewPeopleWorship,
  'group/nurture': Upbringing,
  'group/baptism': Baptism,
  'group/ministration': Service,

  'news': News,
  'news/': Tidings,
  'news/album': Album,
  'news/bulletin': Bulletin,

  'offering': Offering,
  'offering/': Online,
};

// ✅ menuItems 기반 중첩 라우트 + 동적 라우트 자동 추가
export function generateRoutes(menuItems: any[], parentPath = ''): RouteObject[] {
  return menuItems.map((menu: any) => {
    const fullPath = parentPath ? `${parentPath}/${menu.path}` : menu.path;
    const Component = componentMap[fullPath];

    // 자식 메뉴가 있는 경우 (Outlet 포함)
    if (menu.children && menu.children.length > 0) {
      const children = generateRoutes(menu.children, fullPath);

      // ✅ Broadcast 계열에 대해 동적 라우트 추가
      if (menu.path === 'broadcast') {
        children.push(
          { path: ':videoId', element: <VideoDetail /> },
          { path: 'friday/:videoId', element: <VideoDetail /> },
          { path: 'special/:videoId', element: <VideoDetail /> },
        );
      }

      return {
        path: menu.path,
        element: Component ? <Component /> : undefined,
        children,
      };
    }

    // 자식 메뉴가 없는 경우
    return {
      path: menu.path,
      element: Component ? <Component /> : undefined,
    };
  });
}
