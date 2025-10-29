// 변경
import { createHashRouter } from 'react-router-dom';
import React from 'react';
import Root from '../Root';
import Home from '../pages/common/Home';
import NotFound from '../components/ErrorPage/NotFound';
import { menuItems } from '../components/Navicaton';
import { generateRoutes } from '../components/Map';

const generatedRoutes = generateRoutes(menuItems);

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
]);

export default router;
