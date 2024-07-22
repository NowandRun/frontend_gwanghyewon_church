import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { format, isToday } from 'date-fns';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Favicon from '../../styles/images/wavenexus-logo-two.png';
import { gql, useQuery } from '@apollo/client';
import { QnasQuery, QnasQueryVariables } from '../../gql/graphql';
import QnaWrite from '../../components/qna-write';

export const QNAS_QUERY = gql`
  query qnas($input: QnasInput!) {
    qnas(input: $input) {
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
        qnaComment {
          id
          createdAt
          commentOwner
          userId
          comment
        }
      }
    }
  }
`;

export const Qnas = () => {
  /* const client = useApolloClient();

  useEffect(() => {
    const queryResult = client.readQuery({ query: NOTICES_QUERY });
    console.log(queryResult);
  }, []); */

  const [page, setPage] = useState(1);
  const { loading, error, data } = useQuery<QnasQuery, QnasQueryVariables>(
    QNAS_QUERY,
    {
      variables: {
        input: {
          page,
        },
      },
    }
  );

  const onNextPageClick = () => setPage((current) => current + 1);
  const onPrevPageClick = () => setPage((current) => current - 1);

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

  const isTitleNew = (createdAt: string | undefined) => {
    if (!createdAt) return false;
    const date = new Date(createdAt);
    return isToday(date);
  };

  const hasCommentsToday = (comments: any[] | undefined) => {
    if (!comments) return false;
    return comments.some((comment) => isToday(new Date(comment.createdAt)));
  };

  const [isQnaModalOpen, setIsQnaModalOpen] = useState(false);
  const openQnaModal = () => setIsQnaModalOpen(true);
  const closeQnaModal = () => setIsQnaModalOpen(false);

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
        <div className=' w-full  mx-auto  flex flex-col items-center bg-center px-10'>
          {/* Intro section */}
          <div className='w-full max-w-screen-2xl xl:px-0'>
            <div className='max-w-screen-2xl md:pb-14 pb-5 mx-auto mt-8 '>
              <div className='md:text-4xl text-2xl font-bold text-gray-600 flex justify-between mt-16   gap-y-10'>
                <span>QNA</span>
                <QnaWrite
                  closeQnaModal={closeQnaModal}
                  isQnaModalOpen={isQnaModalOpen}
                  openQnaModal={openQnaModal}
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
                {data?.qnas.ok && data.qnas.results?.length === 0 ? (
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
                  data?.qnas.results?.map((qna, index) => (
                    <tr key={qna.id}>
                      <td className='border border-gray-400 md:px-2 md:py-2 px-1 py-1 font-bold text-center text-xs md:text-base'>
                        {qna.id}
                      </td>
                      <td className='border border-gray-400 md:px-2 md:py-2 px-1 py-1 text-xs md:text-base'>
                        <Link to={`${qna.id}`}>
                          {isTitleNew(qna.createdAt) && (
                            <span className='text-xs text-green-500 font-bold'>
                              New
                            </span>
                          )}{' '}
                          {qna.title}{' '}
                          {qna.qnaComment &&
                            hasCommentsToday(qna.qnaComment) && (
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
                Page {page} of {data?.qnas.totalPages}
              </span>
              {page !== data?.qnas.totalPages ? (
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
