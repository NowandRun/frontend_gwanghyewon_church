import React from 'react';
import Box from '@mui/material/Box';
import CustomModal from './Modal';
import skillDiv from '../styles/images/project.png';
import wavenexusLogo from '../styles/images/wavenexus-logo-two.png';

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
        <span className='ml-5 text-2xl font-extrabold'>Portfolio</span>
        <img className='object-cover h-64' src={skillDiv} alt='Skill-Section' />
      </div>
      <CustomModal isOpen={isSkillModalOpen} closeModal={closeSkillModal}>
        <Box sx={{ border: 'none' }}>
          <div>
            <div className='flex flex-col items-center py-24 px-10'>
              <div className='flex flex-col  w-full justify-center h-full'>
                <div className='flex items-center '>
                  <img src={wavenexusLogo} alt='React' className='w-6 h-auto' />
                  <span className=' break-words mb-5 font-semibold mt-5 text-2xl ml-2'>
                    포트폴리오
                  </span>
                </div>

                <ul>
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
