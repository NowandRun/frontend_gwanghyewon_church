import React from 'react';
import { useMe } from '../hooks/useMe';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import MyLogo from '../styles/images/wavenexus.png';

export const Header: React.FC = () => {
  const { data: identifyData } = useMe();

  return (
    <>
      <header className='py-4'>
        <div className='w-full px-5 xl:px-0 max-w-screen-2xl mx-auto flex justify-between items-end'>
          <Link to='/'>
            <img src={MyLogo} alt='logo' className='h-16 max-h-full py-2' />
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

          {identifyData?.me.role === 'Manager' && (
            <Link to='/signup'>
              <div className='flex justify-center text-lg text-gray-800 font-semibold'>
                <FontAwesomeIcon icon={faUserCircle} className='text-2xl' />
                <span className=' pl-2'>{identifyData?.me.userName}</span>
              </div>
            </Link>
          )}
        </div>
      </header>
    </>
  );
};
