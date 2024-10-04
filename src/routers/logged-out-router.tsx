import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import Root from '../Root';

const loggedOutRouter = createBrowserRouter([{ path: '/', element: <Root /> }]);

export default loggedOutRouter;
