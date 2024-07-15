import React from 'react';
import { Helmet } from 'react-helmet';
import { HelmetProvider } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export const NotFound = () => (
  <div className='h-screen flex flex-col items-center justify-center'>
    <HelmetProvider>
      <Helmet>
        <title>Not Found | WAVENEXUS</title>
      </Helmet>
    </HelmetProvider>
    <h2 className='font-semibold text-2xl mb-3'>페이지를 찾을 수 없습니다.</h2>
    <h4 className='font-medium text-base mb-5'>
      찾고 있는 페이지가 존재하지 않거나 이동했습니다.
    </h4>
    <Link className='hover:underline text-gray-600' to='/'>
      Go back home &rarr;
    </Link>
  </div>
);
