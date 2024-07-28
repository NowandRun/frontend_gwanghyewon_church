import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Favicon from '../../styles/images/wavenexus-logo-two.png';
import { gql, useQuery } from '@apollo/client';
import { NoticesQuery, NoticesQueryVariables } from '../../gql/graphql';
import NoticeWrite from '../../components/notice-write';

export const NOTICES_QUERY = gql`
  query notices($input: NoticesInput!) {
    notices(input: $input) {
      error
      ok
      totalPages
      totalResults
      results {
        id
        createdAt
        userId
        userName
        title
        description
        views
      }
    }
  }
`;

export const Notices = () => {
  /* const client = useApolloClient();

  useEffect(() => {
    const queryResult = client.readQuery({ query: NOTICES_QUERY });
    console.log(queryResult);
  }, []); */

  const [page, setPage] = useState(1);
  const { loading, error, data } = useQuery<
    NoticesQuery,
    NoticesQueryVariables
  >(NOTICES_QUERY, {
    variables: {
      input: {
        page,
      },
    },
  });

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

  const formatDate = (createdAt: string) => {
    const date = new Date(createdAt);
    return format(date, 'yyyy.MM.dd');
  };

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

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const openNoticeModal = () => setIsNoticeModalOpen(true);
  const closeNoticeModal = () => setIsNoticeModalOpen(false);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link rel='icon' type='image/png' href={Favicon} />
          <title>Notice | WAVENEXUS</title>
        </Helmet>
      </HelmetProvider>

      {/* 로딩이 완료되면 실제 애플리케이션을 렌더링합니다. */}
      <div>
        <div className=' w-full  mx-auto  flex flex-col items-center bg-center px-10'>
          {/* Intro section */}
          <div className='w-full max-w-screen-2xl xl:px-0'>
            <div className='max-w-screen-2xl md:pb-14 pb-5 mx-auto mt-8 '>
              <div className='md:text-4xl text-2xl font-bold text-gray-600 flex justify-between mt-16   gap-y-10'>
                <span>공지사항</span>
                <NoticeWrite
                  isNoticeModalOpen={isNoticeModalOpen}
                  openNoticeModal={openNoticeModal}
                  closeNoticeModal={closeNoticeModal}
                />
              </div>
            </div>
            <table className='table-auto w-full mx-auto '>
              <thead>
                <tr className='bg-gray-700 text-white'>
                  <th className='border border-gray-400 px-2 py-2 md:w-32 text-xs md:text-base'>
                    글번호
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
                {data?.notices.ok && data.notices.results?.length === 0 ? (
                  <tr>
                    <td colSpan={4} className='text-center py-24'>
                      <h4 className='text-xl mb-2'>
                        게시물이 존재하지 않습니다.
                      </h4>
                      <h4 className='text-xl mb-2'>공지사항을 생성해주세요.</h4>
                    </td>
                  </tr>
                ) : (
                  data?.notices.results?.map((notice, index) => (
                    <tr key={notice.id}>
                      <td className='border border-gray-400 md:px-2 md:py-2 px-1 py-1 font-bold text-center text-xs md:text-base'>
                        {notice.id}
                      </td>
                      <td className='border border-gray-400 md:px-2 md:py-2 px-1 py-1 text-xs md:text-base'>
                        <Link to={`${notice.id}`}>
                          {isTitleNew(notice.createdAt) && (
                            <span className='text-xs text-green-500 font-bold'>
                              New
                            </span>
                          )}{' '}
                          {notice.title}
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
            <div className='grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10 mb-20'>
              {page > 1 ? (
                <button
                  onClick={onPrevPageClick}
                  className='focus:outline-none font-medium text-2xl'
                >
                  &larr;
                </button>
              ) : (
                <div></div>
              )}
              <span>
                Page {page} of {data?.notices.totalPages}
              </span>
              {page !== data?.notices.totalPages ? (
                <button
                  onClick={onNextPageClick}
                  className='focus:outline-none font-medium text-2xl'
                >
                  &rarr;
                </button>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
