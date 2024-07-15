import React from 'react';
import { useMe } from '../hooks/useMe';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { NotFound } from '../pages/404';
import { UserRole } from '../gql/graphql';
import { Signup } from '../pages/signup';
import Home from '../routes/home';
import Notice from '../pages/notice';
import Qna from '../pages/qna';

export const LoggedInRouter = () => {
  /* hook을 활용한 user data 사용 */
  const { data, loading, error } = useMe();
  /* 데이터가 없거나 로딩중이거나 에러가 있으면 if문 진행 */

  console.log(data);

  if (!data || loading || error) {
    return (
      <div className='h-screen flex justify-center items-center'>
        <span className='font-medium text-xl tracking-wide'>Loading...</span>
      </div>
    );
  }

  const commonRoutes = [
    {
      path: '/notice',
      component: <Notice />,
    },
    {
      path: '/qna',
      component: <Qna />,
    },
    {
      path: '/',
      component: <Home />,
    },
  ];
  return (
    <Router>
      <Routes>
        {data.me.role === UserRole.Manager && (
          <Route path='/signup' element={<Signup />} />
        )}
        {/* Common Route */}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  );
};
