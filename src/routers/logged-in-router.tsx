import { createBrowserRouter } from 'react-router-dom';
import Root from '../Root';
import React from 'react';
import Home from '../pages/common/Home';
import Info from '../pages/common/Info';

const loggedInRouter = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
  },
]);

export default loggedInRouter;
