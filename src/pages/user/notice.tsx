import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Favicon from '../../styles/images/wavenexus-logo-two.png';
import MyLogo from '../../styles/images/wavenexus.png';
import { gql, useApolloClient, useQuery } from '@apollo/client';
import { NoticesQuery, NoticesQueryVariables } from '../../gql/graphql';
import NoticeWrite from '../../components/notice-write';

export const NOTICE_QUERY = gql`
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
      }
    }
  }
`;

export const Notice = () => {
  const client = useApolloClient();

  useEffect(() => {
    const queryResult = client.readQuery({ query: NOTICE_QUERY });
    console.log(queryResult);
  }, []);

  const [page, setPage] = useState(1);
  const { loading, error, data } = useQuery<
    NoticesQuery,
    NoticesQueryVariables
  >(NOTICE_QUERY, {
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

  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const openNoticeModal = () => setIsNoticeModalOpen(true);
  const closeNoticeModal = () => setIsNoticeModalOpen(false);

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
            <div className='max-w-screen-2xl pb-5 mx-auto mt-8'>
              <div className='text-5xl font-bold text-gray-600 grid mt-16 md:grid-cols-2 justify-between gap-y-10 '>
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
                  <th className='border border-gray-400 px-2 py-2 '>글번호</th>
                  <th className='border border-gray-400 px-2 py-2 '>제목</th>
                  <th className='border border-gray-400 px-2 py-2 '>등록일</th>
                  <th className='border border-gray-400 px-2 py-2 '>조회수</th>
                </tr>
              </thead>
              <tbody>
                {data?.notices.results
                  ?.map((notice, index) => (
                    <tr key={index}>
                      <td className='border border-gray-400 px-2 py-2 font-bold text-center'>
                        {index + 1}
                      </td>
                      <td className='border border-gray-400 px-2 py-2'>
                        {notice.title}
                      </td>
                      <td className='border border-gray-400 px-2 py-2 text-center'>
                        {formatDate(notice.createdAt)}
                      </td>
                      <td className='text-center border border-gray-400 px-2 py-2'>
                        6
                      </td>
                    </tr>
                  ))
                  .reverse()}
              </tbody>
            </table>
            <div className='grid grid-cols-3 text-center max-w-md items-center mx-auto mt-10'>
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

export default Notice;
