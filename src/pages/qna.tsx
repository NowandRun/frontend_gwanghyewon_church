import React from 'react';
import { Link } from 'react-router-dom';

import { HelmetProvider, Helmet } from 'react-helmet-async';
import Favicon from '../styles/images/wavenexus-logo-two.png';
import MyLogo from '../styles/images/wavenexus.png';

function Qna() {
  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link rel='icon' type='image/png' href={Favicon} />
          <title>Home | WAVENEXUS</title>
        </Helmet>
      </HelmetProvider>

      {/* 로딩이 완료되면 실제 애플리케이션을 렌더링합니다. */}
      <div>
        <header className='py-4'>
          <div className='w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-center'>
            <Link to='/'>
              <img src={MyLogo} className='h-16 max-h-full py-2' />
            </Link>
            <span className='text-xs'>
              <Link to='/edit-profile'>
                {/* FontAwesome 사용법 */}
                {/* <FontAwesomeIcon icon={faUser} className='text-xl' /> */}
              </Link>
            </span>
          </div>
        </header>

        <div className=' w-full  mx-auto  flex flex-col items-center bg-center px-10'>
          {/* Intro section */}
          <div className='w-full max-w-screen-2xl xl:px-0'>
            <div className='text-5xl font-bold pb-5 text-gray-600'>
              <span>QNA</span>
            </div>
            <table className='table-auto w-full mx-auto '>
              <thead>
                <tr className='bg-gray-700 text-white'>
                  <th className='border border-gray-400 px-2 py-2 '>글번호</th>
                  <th className='border border-gray-400 px-2 py-2 '>제목</th>
                  <th className='border border-gray-400 px-2 py-2 '>등록일</th>
                  <th className='border border-gray-400 px-2 py-2 '>조회수</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className='border border-gray-400 px-2 py-2 font-bold text-center'>
                    1
                  </td>
                  <td className='border border-gray-400 px-2 py-2'>
                    첫번째 게시글입니다.
                  </td>
                  <td className='border border-gray-400 px-2 py-2 text-center'>
                    2020-10-25
                  </td>
                  <td className='text-center border border-gray-400 px-2 py-2'>
                    6
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default Qna;
