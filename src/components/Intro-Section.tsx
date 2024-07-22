import React from 'react';
import { Box } from '@mui/material';
import meImage from '../styles/images/me.jpg';
import introDiv from '../styles/images/study.png';
import CustomModal from './Modal';
import wavenexusLogo from '../styles/images/wavenexus-logo-two.png';

interface PriceProps {
  openIntroModal: () => void;
  isIntroModalOpen: boolean;
  closeIntroModal: () => void;
}

const Intro: React.FC<PriceProps> = ({
  openIntroModal,
  isIntroModalOpen,
  closeIntroModal,
}) => {
  return (
    <div>
      <div
        className='w-11/12 rounded-2xl md:w-full mx-auto shadow-2xl cursor-pointer overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-95 flex flex-col'
        onClick={openIntroModal}
      >
        <span className='ml-5 text-2xl font-extrabold'>Intro</span>
        <img className='object-cover h-64' src={introDiv} alt='Intro-Section' />
      </div>
      <CustomModal isOpen={isIntroModalOpen} closeModal={closeIntroModal}>
        <Box sx={{ border: 'none' }}>
          <div className='bg-gradient-to-tl from-gray-200'>
            <div className='flex flex-col justify-center items-center py-24 px-10 '>
              {/* <img
                src={meImage}
                alt='Me'
                className='w-48 h-auto mr-4 md:w-96'
              /> */}

              <img
                src={wavenexusLogo}
                alt='Me'
                className='w-12 h-auto mr-4 md:w-12 mb-5'
              />

              <div className='flex flex-col md:text-center text-center w-full justify-center h-full'>
                <div className=' flex flex-col '>
                  <span className='break-words md:text-4xl md:text-center mt-5 font-extrabold'>
                    "WAVENEXUS"
                  </span>
                  <span className='break-words md:text-4xl md:text-center mt-7'>
                    웹 페이지 개발과
                  </span>
                  <span className='break-words md:text-4xl md:text-center mt-7'>
                    공감의 결합을 목표로
                  </span>
                  <span className='break-words md:text-4xl md:text-center mt-7 mb-12'>
                    서비스 공감을 제공합니다.
                  </span>
                </div>
                <div className='text-xs md:text-2xl '>
                  <ul>
                    <li className='pb-1'>
                      <a href='https://wlrma-123.tistory.com/'>
                        Blog: https://wlrma-123.tistory.com/
                      </a>
                    </li>
                    <li className='pb-1'>
                      <a href='https://github.com/whd617'>
                        Github: https://github.com/whd617
                      </a>
                    </li>
                    <li>
                      <a>Email: whd617@naver.com</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </Box>
      </CustomModal>
    </div>
  );
};

export default Intro;
