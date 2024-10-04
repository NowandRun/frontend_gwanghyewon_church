import { createBrowserRouter } from 'react-router-dom';
import Root from '../Root';
import React from 'react';
import Home from '../pages/common/Home';

const loggedInRouter = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: '',
        element: <Home />,
      },
    ],
  },
]);

export default loggedInRouter;
