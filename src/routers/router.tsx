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
import CreateMainPopupBoard from 'src/pages/admin/Main-Popup/CreateMainPopupBoard';
import EditMainPopupBoard from 'src/pages/admin/Main-Popup/EditMainPopupBoard';

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

  // ✅ 로그인/회원가입 영역 (로그인한 사람은 접근 불가)
  {
    element: <PublicOnlyRouter />,
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
              // ⭐ 중요: index는 하나만 설정합니다.
              // /admin으로 들어오면 기본적으로 'church-info'로 보냅니다.
              {
                index: true,
                element: (
                  <Navigate
                    to="church-info"
                    replace
                  />
                ),
              },

              // 📌 메뉴 기반 자동 생성 라우트
              ...adminGeneratedRoutes,

              // 📌 상세 편집/생성 페이지 (중복 제거 및 정리)
              {
                path: 'church-info',
                children: [
                  { path: 'create', element: <CreateChurchInformationBoard /> },
                  { path: 'edit/:id', element: <EditChurchInformationBoard /> },
                ],
              },
              {
                path: 'church-album',
                children: [
                  { path: 'create', element: <CreateChurchAlbumBoard /> },
                  { path: 'edit/:id', element: <EditChurchAlbumBoard /> },
                ],
              },
              {
                path: 'church-bulletin',
                children: [
                  { path: 'create', element: <CreateChurchBulletinBoard /> },
                  { path: 'edit/:id', element: <EditChurchBulletinBoard /> },
                ],
              },
              {
                path: 'main-popup',
                children: [
                  { path: 'create', element: <CreateMainPopupBoard /> },
                  { path: 'edit/:id', element: <EditMainPopupBoard /> },
                ],
              },
            ],
          },
        ],
      },
    ],
  },

  // 404 페이지
  { path: '*', element: <NotFound /> },
]);

export default router;
