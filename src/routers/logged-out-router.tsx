import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Root from '../Root';
import Home from '../pages/common/Home';
import Info from '../pages/common/Info';
import Ministro from '../pages/common/Ministro';
import Sermon from '../pages/common/Sermon';
import Youth from '../pages/common/Youth';
import Missionary from '../pages/common/Missionary';
import News from '../pages/common/News';
import Group from '../pages/common/Group';

const loggedOutRouter = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'info',
        element: <Info />,
      },
      {
        path: 'ministro',
        element: <Ministro />,
      },
      {
        path: 'sermon',
        element: <Sermon />,
      },
      {
        path: 'youth',
        element: <Youth />,
      },
      {
        path: 'group',
        element: <Group />,
      },
      {
        path: 'missionary',
        element: <Missionary />,
      },
      {
        path: 'news',
        element: <News />,
      },
    ],
  },
]);

export default loggedOutRouter;
