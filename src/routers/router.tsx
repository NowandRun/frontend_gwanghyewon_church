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
import CreateCharchInformationBoard from '../pages/admin/Charch-Information/Charch-Information-Board-Create';
import EditCharchInformationBoard from '../pages/admin/Charch-Information/EditCharchInformationBoard';

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
                    to="charch-info"
                    replace
                  />
                ),
              },

              // 📌 메뉴 기반 라우트
              ...adminGeneratedRoutes,

              // 📌 메뉴에 안 보이는 라우트 (중요)
              {
                path: 'charch-info/create',
                element: <CreateCharchInformationBoard />,
              },
              {
                path: 'charch-info/edit/:id', // 👈 수정 페이지 라우트 추가
                element: <EditCharchInformationBoard />,
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
