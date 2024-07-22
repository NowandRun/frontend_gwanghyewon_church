import React, { useState } from 'react';
import Skill from '../../components/Skill-Section';
import Price from '../../components/Price';
import Intro from '../../components/Intro-Section';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Favicon from '../../styles/images/wavenexus-logo-two.png';
import MainImage from '../../styles/images/mainscreen.png';
import { useCookies } from 'react-cookie';
import { ClipLoader } from 'react-spinners';

function Home() {
  const [cookies] = useCookies(['accesstoken']);
  /* Intro Modal */
  const [isIntroModalOpen, setIsIntroModalOpen] = useState(false);

  const openIntroModal = () => setIsIntroModalOpen(true);
  const closeIntroModal = () => setIsIntroModalOpen(false);

  /* Skill Modal */
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);

  const openSkillModal = () => setIsSkillModalOpen(true);
  const closeSkillModal = () => setIsSkillModalOpen(false);

  /* Price Modal */
  const [isPriceModalOpen, setIsPriceModalOpen] = useState(false);
  const openPriceModal = () => setIsPriceModalOpen(true);
  const closePriceModal = () => setIsPriceModalOpen(false);
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
        <img
          src={MainImage}
          alt='MainImage'
          className=' w-full object-cover h-96 mx-auto flex flex-col items-center bg-gray-700 bg-center'
        />

        <div className='max-w-screen-2xl pb-14 mx-auto mt-8'>
          <div className='grid mt-16 md:grid-cols-3 gap-x-8 gap-y-10'>
            {/* Intro section */}
            <Intro
              isIntroModalOpen={isIntroModalOpen}
              openIntroModal={openIntroModal}
              closeIntroModal={closeIntroModal}
            />

            {/* Skill section */}
            <Skill
              isSkillModalOpen={isSkillModalOpen}
              openSkillModal={openSkillModal}
              closeSkillModal={closeSkillModal}
            />

            <Price
              isPriceModalOpen={isPriceModalOpen}
              openPriceModal={openPriceModal}
              closePriceModal={closePriceModal}
            />
          </div>
        </div>

        <div className='max-w-screen-2xl pb-14 mx-auto mt-8'>
          <div className='grid mt-16 md:grid-cols-2 gap-x-8 gap-y-10'>
            {/* Intro section */}
            <div>
              <span>QNA</span>
              <table>
                <thead>
                  <tr>
                    <th>글번호</th>
                    <th>제목</th>
                    <th>등록일</th>
                    <th>조회수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>첫번째 게시글입니다.</td>
                    <td>2020-10-25</td>
                    <td>6</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Skill section */}
            <div>
              <span>QNA</span>
              <table>
                <thead>
                  <tr>
                    <th>글번호</th>
                    <th>제목</th>
                    <th>등록일</th>
                    <th>조회수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>1</td>
                    <td>첫번째 게시글입니다.</td>
                    <td>2020-10-25</td>
                    <td>6</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
