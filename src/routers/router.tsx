// 변경
import { createBrowserRouter } from 'react-router-dom';
import { generateRoutes } from './generateRoutes';
import React from 'react';
import Root from "../Root";
import Home from "../pages/common/Home";
import { menuItems } from "../components/Header/Header";

const generatedRoutes = generateRoutes(menuItems);

const router = createBrowserRouter(
  [
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
    },
  ],
  {
    basename: '/frontend_gwanghyewon_church', // ✅ 이 부분 추가!
  }
);

export default router;
