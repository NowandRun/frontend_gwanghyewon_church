import React, { useState } from 'react';
import Skill from '../../components/Skill-Section';
import Price from '../../components/Price';
import Intro from '../../components/Intro-Section';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Favicon from '../../styles/images/wavenexus-logo-two.png';
import { useQuery } from '@apollo/client';
import { QNAS_QUERY } from './qnas';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { NoticesQuery, NoticesQueryVariables } from '../../gql/graphql';
import { NOTICES_QUERY } from './notices';

function Client() {
  const {
    loading: qnasLoading,
    error: qnasError,
    data: qnasData,
  } = useQuery(QNAS_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });

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

  const isTitleNew = (createdAt: string | undefined) => {
    if (!createdAt) return false;

    try {
      const createdAtDate = new Date(createdAt);
      const currentTime = new Date();

      // 게시물 생성 시간에서 현재 시간까지의 시간 차이를 밀리초로 계산
      const timeDifference = currentTime.getTime() - createdAtDate.getTime();

      // 시간 차이를 시간 단위로 변환하여 계산
      const hoursDifference = timeDifference / (1000 * 3600);

      // 생성된 시간이 0에서 24시간 사이면 "New" 표시
      return hoursDifference >= 0 && hoursDifference <= 24;
    } catch (error) {
      console.error('제목이 새로운지 확인하는 도중 에러 발생:', error);
      return false; // 에러 발생 시 gracefully하게 처리
    }
  };

  const hasCommentsToday = (
    comments: any[] | undefined,
    postCreatedAt: string | undefined
  ) => {
    if (!comments || !postCreatedAt) return false;

    try {
      const postCreatedDate = new Date(postCreatedAt);
      const currentTime = new Date();

      // 24시간 이내의 댓글 여부를 확인
      const hasRecentComment = comments.some((comment) => {
        const commentDate = new Date(comment.createdAt);
        const timeDifference = currentTime.getTime() - commentDate.getTime();
        const hoursDifference = timeDifference / (1000 * 3600);
        return hoursDifference >= 0 && hoursDifference <= 24;
      });

      return hasRecentComment;
    } catch (error) {
      console.error('댓글이 오늘 생성되었는지 확인하는 도중 에러 발생:', error);
      return false; // 에러 발생 시 gracefully하게 처리
    }
  };

  const formatDate = (createdAt: string | undefined) => {
    if (!createdAt) return ''; // Handle undefined case or other invalid values

    try {
      const date = new Date(createdAt);
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return format(date, 'yyyy.MM.dd');
    } catch (error) {
      console.error('Error formatting date:', error);
      return ''; // Handle error case gracefully
    }
  };

  const limitedQnasData = qnasData?.qnas.results?.slice(0, 5);

  const {
    loading: noticeLoading,
    error: noticeError,
    data: noticeData,
  } = useQuery<NoticesQuery, NoticesQueryVariables>(NOTICES_QUERY, {
    variables: {
      input: {
        page: 1,
      },
    },
  });

  const limitedNoticeData = noticeData?.notices.results?.slice(0, 5);

  const shortenText = (text: string | null | undefined) => {
    if (!text) return '';

    if (text.length > 17) {
      return `${text.substring(0, 15)}...`;
    } else {
      return text;
    }
  };

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link rel='icon' type='image/png' href={Favicon} />
          <title>Home | WAVENEXUS</title>
        </Helmet>
      </HelmetProvider>

      <div>
        <div
          className='w-full text-gray-700 object-cover h-96 mx-auto flex flex-col items-center justify-center bg-gradient-to-tl from-pink-200 bg-center '
          style={{ userSelect: 'none' }}
        >
          <div className='text-3xl md:text-5xl font-extrabold mb-5 '>
            WAVENEXUS는
          </div>
          <div className='text-3xl md:text-5xl font-extrabold'>
            자체 웹개발 서비스입니다
          </div>
        </div>

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
              <div className='flex justify-between items-end'>
                <span className='ml-5 text-2xl font-extrabold block'>QNA</span>
                <Link to='/qna'>
                  <span className='ml-5 text-base font-extrabold block'>
                    <span className='items-start'>더보기 &rarr;</span>
                  </span>
                </Link>
              </div>
              <table className='table-auto w-full mx-auto '>
                <thead>
                  <tr className='bg-gray-700 text-white'>
                    <th className='border border-gray-400 px-2 py-2 md:w-32 text-xs md:text-base'>
                      번호
                    </th>
                    <th className='border border-gray-400 px-2 py-2 text-xs md:text-base'>
                      제목
                    </th>
                    <th className='border border-gray-400 px-2 py-2 md:w-32 text-xs md:text-base'>
                      등록일
                    </th>
                    <th className='border border-gray-400 px-2 py-2 md:w-32 text-xs md:text-base'>
                      조회수
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {qnasData?.qnas.ok && limitedQnasData.length === 0 ? (
                    <tr>
                      <td colSpan={4} className='text-center py-24'>
                        <h4 className='text-xl mb-2'>
                          게시물이 존재하지 않습니다.
                        </h4>
                        <h4 className='text-xl mb-2'>
                          여러분의 질문사항을 생성해주세요.
                        </h4>
                      </td>
                    </tr>
                  ) : (
                    limitedQnasData?.map((qna: any, index: any) => (
                      <tr key={qna.id}>
                        <td className='border border-gray-400 md:px-2 md:py-2 px-1 py-1 font-bold text-center text-xs md:text-base'>
                          {qna.id}
                        </td>
                        <td className='border border-gray-400 md:px-2 md:py-2 px-1 py-1 text-xs md:text-base'>
                          <Link to={`/qna/${qna.id}`}>
                            {isTitleNew(qna.createdAt) && (
                              <span className='text-xs text-green-500 font-bold'>
                                New
                              </span>
                            )}{' '}
                            {shortenText(qna.title)}{' '}
                            {qna.qnaComment &&
                              hasCommentsToday(
                                qna.qnaComment,
                                qna.createdAt
                              ) && (
                                <span className='text-xs text-red-500 font-bold'>
                                  댓글
                                </span>
                              )}
                          </Link>
                        </td>

                        <td className='border border-gray-400 md:px-2 md:py-2 text-center px-1 py-1 text-xs md:text-base'>
                          {formatDate(qna.createdAt)}
                        </td>
                        <td className='text-center border border-gray-400 md:px-2 md:py-2 px-1 py-1 text-xs md:text-base'>
                          {qna.views}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Skill section */}
            <div>
              <div className='flex justify-between items-end'>
                <span className='ml-5 text-2xl font-extrabold block'>
                  공지사항
                </span>
                <Link to='/notice'>
                  <span className='ml-5 text-base font-extrabold block'>
                    <span className='items-start'>더보기 &rarr;</span>
                  </span>
                </Link>
              </div>
              <table className='table-auto w-full mx-auto '>
                <thead>
                  <tr className='bg-gray-700 text-white'>
                    <th className='border border-gray-400  md:w-32 text-xs md:text-base'>
                      번호
                    </th>
                    <th className='border border-gray-400 px-2 py-2 text-xs md:text-base'>
                      제목
                    </th>
                    <th className='border border-gray-400 px-2 py-2 md:w-32 text-xs md:text-base'>
                      등록일
                    </th>
                    <th className='border border-gray-400 px-2 py-2 md:w-32 text-xs md:text-base'>
                      조회수
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {noticeData?.notices.ok && limitedNoticeData?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className='text-center py-24'>
                        <h4 className='text-xl mb-2'>
                          게시물이 존재하지 않습니다.
                        </h4>
                        <h4 className='text-xl mb-2'>
                          공지사항을 생성해주세요.
                        </h4>
                      </td>
                    </tr>
                  ) : (
                    limitedNoticeData?.map((notice, index) => (
                      <tr key={notice.id}>
                        <td className='border border-gray-400 md:px-2 md:py-2 px-1 py-1 font-bold text-center text-xs md:text-base'>
                          {notice.id}
                        </td>
                        <td className='border border-gray-400 md:px-2 md:py-2 px-1 py-1 text-xs md:text-base'>
                          <Link to={`/notice/${notice.id}`}>
                            {isTitleNew(notice.createdAt) && (
                              <span className='text-xs text-green-500 font-bold'>
                                New
                              </span>
                            )}{' '}
                            {shortenText(notice.title)}
                          </Link>
                        </td>

                        <td className='border border-gray-400 md:px-2 md:py-2 text-center px-1 py-1 text-xs md:text-base'>
                          {formatDate(notice.createdAt)}
                        </td>
                        <td className='text-center border border-gray-400 md:px-2 md:py-2 px-1 py-1 text-xs md:text-base'>
                          {notice.views}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Client;
