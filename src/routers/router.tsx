// 변경
import { createHashRouter } from 'react-router-dom';
import { generateRoutes } from './generateRoutes';
import React from 'react';
import Root from "../Root";
import Home from "../pages/common/Home";
import { menuItems } from "../components/Header/Header";
import NotFound from "../components/ErrorPage/NotFound";

const generatedRoutes = generateRoutes(menuItems);

const router = createHashRouter(
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
      errorElement: <NotFound />,
    },
  ],
);

export default router;
