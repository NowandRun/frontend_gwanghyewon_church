// logged-out-router.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from '../routes/home';
import Qna from '../pages/qna';
import Notice from '../pages/notice';
import { Login } from '../pages/login';

export const LoggedOutRouter = () => {
  return (
    <Router>
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
    </Router>
  );
};
