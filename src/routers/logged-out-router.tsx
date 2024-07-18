// logged-out-router.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../pages/user/home';
import Qna from '../pages/user/qna';
import Notice from '../pages/user/notice';
import { Login } from '../pages/user/login';
import { Link } from 'react-router-dom';
import MyLogo from '../styles/images/wavenexus.png';

export const LoggedOutRouter = () => {
  return (
    <>
      <div>
        <span>Logged out</span>
      </div>
      <header className='py-4'>
        <div className='w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-end'>
          <Link to='/'>
            <img src={MyLogo} className='h-16 max-h-full py-2' />
          </Link>
          <div>
            <span className='text-2xl'>
              <Link to='/login'>Login</Link>
            </span>
          </div>
        </div>
      </header>
      <Routes>
        <Route path='/' element={<Home />} />
      </Routes>
      <Routes>
        <Route path='/login' element={<Login />} />
      </Routes>
      <Routes>
        <Route path='/qna' element={<Qna />} />
      </Routes>
      <Routes>
        <Route path='/notice' element={<Notice />} />
      </Routes>
    </>
  );
};
