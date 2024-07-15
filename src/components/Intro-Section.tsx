import React from 'react';
import { Box } from '@mui/material';
import meImage from '../styles/images/me.jpg';
import CustomModal from './Modal';

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
        <img
          className='object-cover h-64'
          src='https://contenthub-static.grammarly.com/blog/wp-content/uploads/2018/05/BMD-3700.png'
          alt='Intro-Section'
        />
      </div>
      <CustomModal isOpen={isIntroModalOpen} closeModal={closeIntroModal}>
        <Box sx={{ border: 'none' }}>
          <div>
            <div className='bg-blue-100 py-2 flex items-center w-full  h-full'>
              <span className='text-2xl font-bold ml-5 md:text-5xl'>Intro</span>
            </div>
            <div className='flex items-center p-6'>
              <img
                src={meImage}
                alt='Me'
                className='w-48 h-auto mr-4 md:w-96'
              />

              <div className='flex flex-col md:text-center  w-full justify-center h-full'>
                <div className=' flex flex-col '>
                  <span className='break-words md:text-4xl md:text-center '>
                    고객의 가치가 서비스의 가치
                  </span>
                  <span className='break-words mb-5 md:text-lg'></span>
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
