import React from 'react';
import Box from '@mui/material/Box';
import nestjsImage from '../styles/images/NestJS.png';
import reactjsImage from '../styles/images/Reactjs.png';
import typescriptImage from '../styles/images/TypeScript.png';
import mongodbImage from '../styles/images/mongodb.png';
import mysqlImage from '../styles/images/mysql.png';
import nodejsImage from '../styles/images/nodejs.png';
import postgresqlImage from '../styles/images/postgresql.png';
import CustomModal from './Modal';

interface SkillProps {
  openSkillModal: () => void;
  isSkillModalOpen: boolean;
  closeSkillModal: () => void;
}

const Skill: React.FC<SkillProps> = ({
  openSkillModal,
  isSkillModalOpen,
  closeSkillModal,
}) => {
  return (
    <div>
      <div
        className='w-11/12 rounded-2xl md:w-full mx-auto shadow-2xl cursor-pointer overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-95 flex flex-col'
        onClick={openSkillModal}
      >
        <span className='ml-5 text-2xl font-extrabold'>Skill</span>
        <img
          className='object-cover h-64'
          src='https://www.talentlms.com/blog/wp-content/uploads/2022/10/difference-knowledge-vs-skill.png'
          alt='Skill-Section'
        />
      </div>
      <CustomModal isOpen={isSkillModalOpen} closeModal={closeSkillModal}>
        <Box sx={{ border: 'none' }}>
          <div>
            <div className='bg-blue-100 py-2 flex items-center w-full  h-full'>
              <span className='text-2xl font-bold ml-5 md:text-5xl'>Skill</span>
            </div>
            <div className='flex flex-col items-center p-6'>
              <div className='flex flex-col  w-full justify-center h-full'>
                <span className=' break-words mb-5 font-semibold text-xl'>
                  프론트엔드
                </span>
                <div className=' flex flex-col '>
                  <div className='flex flex-col items-center w-20'>
                    <img
                      src={reactjsImage}
                      alt='React'
                      className='w-48 h-auto'
                    />
                    <span className='mt-2 break-words mb-5 font-semibold text-lg'>
                      ReactJS
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col  w-full justify-center h-full'>
                <span className=' break-words mb-5 font-semibold mt-5 text-xl'>
                  백엔드
                </span>
                <div className=' flex flex-wrap'>
                  <div className='flex flex-col justify-end items-center  w-20'>
                    <img
                      src={nodejsImage}
                      alt='React'
                      className='w-48 h-auto'
                    />
                    <span className='mt-2 break-words mb-5 font-semibold text-lg'>
                      NodeJS
                    </span>
                  </div>

                  <div className='flex flex-col items-center justify-end ml-8 w-20'>
                    <img
                      src={typescriptImage}
                      alt='React'
                      className='w-48 h-auto'
                    />
                    <span className='mt-2 break-words mb-5 font-semibold  text-lg'>
                      TypeScript
                    </span>
                  </div>

                  <div className='flex flex-col items-center ml-8 justify-end w-20'>
                    <img
                      src={nestjsImage}
                      alt='React'
                      className='w-48 h-auto'
                    />
                    <span className='mt-2 break-words mb-5 font-semibold text-lg'>
                      NestJS
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col  w-full justify-center h-full'>
                <span className=' break-words mb-5 font-semibold mt-5 text-2xl'>
                  데이터베이스
                </span>
                <div className=' flex flex-wrap'>
                  <div className='flex flex-col justify-end items-center  w-20'>
                    <img
                      src={mongodbImage}
                      alt='React'
                      className='w-48 h-auto'
                    />
                    <span className='mt-2 break-words mb-5 font-semibold text-lg'>
                      MongoDB
                    </span>
                  </div>

                  <div className='flex flex-col items-center justify-end ml-8 w-20'>
                    <img src={mysqlImage} alt='React' className='w-48 h-auto' />
                    <span className='mt-2 break-words mb-5 font-semibold  text-lg'>
                      MySQL
                    </span>
                  </div>

                  <div className='flex flex-col items-center ml-8 justify-end w-20'>
                    <img
                      src={postgresqlImage}
                      alt='React'
                      className='w-48 h-auto'
                    />
                    <span className='mt-2 break-words mb-5 font-semibold text-lg'>
                      PostgreSQL
                    </span>
                  </div>
                </div>
              </div>
              <div className='flex flex-col  w-full justify-center h-full'>
                <span className=' break-words mb-5 font-semibold mt-5 text-2xl'>
                  프로젝트
                </span>
                <ul>
                  <li className='pb-1'>
                    <h1 className='mt-2 break-words font-semibold text-lg'>
                      레스토랑서비스:
                    </h1>
                    <a
                      className='mt-2 break-words mb-5  text-lg'
                      href='https://splendorous-florentine-db3f35.netlify.app/'
                    >
                      https://splendorous-florentine-db3f35.netlify.app/
                    </a>
                  </li>
                  <li className='pb-1'>
                    <h1 className='mt-2 break-words font-semibold text-lg'>
                      영화추천서비스:
                    </h1>
                    <a
                      className='mt-2 break-words mb-5  text-lg'
                      href='https://whd617.github.io/react-for-beginners/'
                    >
                      https://whd617.github.io/react-for-beginners/
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Box>
      </CustomModal>
    </div>
  );
};

export default Skill;
