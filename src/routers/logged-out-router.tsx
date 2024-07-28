// logged-out-router.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Login } from '../pages/user/login';
import { Link } from 'react-router-dom';
import MyLogo from '../styles/images/wavenexus.png';
import { Qnas } from '../pages/client/qnas';
import { Notice } from '../pages/user/notice';
import { Notices } from '../pages/client/notices';
import { Qna } from '../pages/client/qna';
import { NotFound } from '../pages/404';
import Client from '../pages/client/client';

const nonAuth = [
  {
    path: `/qna/:id`,
    component: <Qna />,
  },
  {
    path: `/notice/:id`,
    component: <Notice />,
  },
  {
    path: '/',
    component: <Client />,
  },
  {
    path: '/notice',
    component: <Notices />,
  },
  {
    path: '/login',
    component: <Login />,
  },

  {
    path: `/qna`,
    component: <Qnas />,
  },
];

export const LoggedOutRouter = () => {
  return (
    <Router>
      <header className='py-4'>
        <div className='w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-end'>
          <Link to='/'>
            <img src={MyLogo} className='h-16 max-h-full py-2' />
          </Link>

          <div className=' text-xl'>
            <Link to='/qna'>
              <span>QNA</span>
            </Link>
          </div>

          <div className='text-xl'>
            <Link to='/notice'>
              <span>공지</span>
            </Link>
          </div>

          <div>
            <span className='text-2xl'>
              <Link to='/login'>Login</Link>
            </span>
          </div>
        </div>
      </header>
      <Routes>
        {nonAuth.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};
