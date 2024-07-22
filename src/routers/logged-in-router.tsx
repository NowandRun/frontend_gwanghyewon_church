import React from 'react';
import { useMe } from '../hooks/useMe';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { NotFound } from '../pages/404';
import { UserRole } from '../gql/graphql';
import { Header } from '../components/header';
import Client from '../pages/client/client';
import { ClipLoader } from 'react-spinners';
import { Signup } from '../pages/client/signup';
import { Notices } from '../pages/client/notices';
import { Notice } from '../pages/user/notice';
import { Qnas } from '../pages/client/qnas';
import { Qna } from '../pages/client/qna';

export const LoggedInRouter = () => {
  /* hook을 활용한 user data 사용 */
  const { data: identifyData, loading, error } = useMe();
  /* 데이터가 없거나 로딩중이거나 에러가 있으면 if문 진행 */
  if (!identifyData || loading || error) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <ClipLoader size={50} />
      </div>
    );
  }

  const commonRoutes = [
    {
      path: '/signup',
      component: <Signup />,
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
      path: `/notice/:id`,
      component: <Notice />,
    },
    {
      path: `/qna`,
      component: <Qnas />,
    },
    {
      path: `/qna/:id`,
      component: <Qna />,
    },
  ];
  return (
    <Router>
      <div>
        <h1>Logged IN</h1>
      </div>
      <Header />
      <Routes>
        {identifyData &&
          commonRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={route.component}
            />
          ))}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};
