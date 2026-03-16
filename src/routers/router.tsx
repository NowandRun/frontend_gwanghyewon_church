// 변경
import { createHashRouter, Navigate } from 'react-router-dom';
import React from 'react';
import Root from '../Root';
import Home from '../pages/common/Home';
import NotFound from '../components/ErrorPage/NotFound';
import { menuItems } from '../components/Navicaton';
import { generateRoutes } from '../components/Map';
import { adminMenuItems } from '../components/AdminNavigation';
import { Login } from '../pages/common/Login';
import { CreateAccount } from '../pages/common/CreateAccount';
import LoggedInRouter from './logged-in-router';
import AdminRoot from '../AdminRoot';
import PublicOnlyRouter from './public-only-router';
import AdminIdleGuard from './AdminIdleGuard';
import EditChurchInformationBoard from '../pages/admin/Church-Information/EditChurchInformationBoard';
import CreateChurchInformationBoard from 'src/pages/admin/Church-Information/CreatChurchInformationBoard';
import EditChurchAlbumBoard from 'src/pages/admin/Church-Album/EditChurchAlbumBoard';
import CreateChurchAlbumBoard from 'src/pages/admin/Church-Album/CreateChurchAlbumBoard';
import CreateChurchBulletinBoard from 'src/pages/admin/Church-Bulletin/CreateChurchBulletinBoard';
import EditChurchBulletinBoard from 'src/pages/admin/Church-Bulletin/EditChurchBulletinBoard';

const generatedRoutes = generateRoutes(menuItems);

// 백오피스용 라우트
const adminGeneratedRoutes = generateRoutes(adminMenuItems, '', true);

const router = createHashRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      ...generatedRoutes,
    ],
    errorElement: <NotFound />,
  },

  // ✅ 로그인 전용 영역
  {
    element: <PublicOnlyRouter />, // ⭐ 추가
    children: [
      {
        path: '/admin/login',
        element: <Login />,
      },
      {
        path: '/admin/create-account',
        element: <CreateAccount />,
      },
    ],
  },

  // 🔐 관리자 영역 (로그인 필수)
  // 🔐 관리자 영역
  {
    path: '/admin',
    element: <LoggedInRouter />,
    children: [
      {
        element: <AdminIdleGuard />,
        children: [
          {
            element: <AdminRoot />,
            children: [
              {
                index: true,
                element: (
                  <Navigate
                    to="church-info"
                    replace
                  />
                ),
              },
              {
                index: true,
                element: (
                  <Navigate
                    to="church-album"
                    replace
                  />
                ),
              },
              {
                index: true,
                element: (
                  <Navigate
                    to="church-bulletin"
                    replace
                  />
                ),
              },
              // 📌 메뉴 기반 라우트
              ...adminGeneratedRoutes,

              // 📌 메뉴에 안 보이는 라우트 (중요)
              {
                path: 'church-info/create',
                element: <CreateChurchInformationBoard />,
              },
              {
                path: 'church-info/edit/:id', // 👈 수정 페이지 라우트 추가
                element: <EditChurchInformationBoard />,
              },
              {
                path: 'church-album/create',
                element: <CreateChurchAlbumBoard />,
              },
              {
                path: 'church-album/edit/:id', // 👈 수정 페이지 라우트 추가
                element: <EditChurchAlbumBoard />,
              },
              {
                path: 'church-bulletin/create',
                element: <CreateChurchBulletinBoard />,
              },
              {
                path: 'church-bulletin/edit/:id', // 👈 수정 페이지 라우트 추가
                element: <EditChurchBulletinBoard />,
              },
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);

export default router;
