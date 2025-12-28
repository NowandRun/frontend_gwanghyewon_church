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
  {
    path: '/admin',
    element: <LoggedInRouter />,
    children: [
      {
        element: <AdminIdleGuard />, // ⭐ 추가
        children: [
          {
            element: <AdminRoot />,
            children: [
              {
                index: true,
                element: (
                  <Navigate
                    to="dashboard"
                    replace
                  />
                ),
              },
              ...adminGeneratedRoutes,
            ],
          },
        ],
      },
    ],
  },

  { path: '*', element: <NotFound /> },
]);

export default router;
