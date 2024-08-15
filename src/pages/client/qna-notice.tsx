import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet';
import Favicon from '../../styles/images/wavenexus-logo-two.png';
import {
  QnaNoticeQuery,
  QnaNoticeQueryVariables,
  QnaNoticesQuery,
  QnaNoticesQueryVariables,
} from '../../gql/graphql';
import { client } from '../../apollo';
import { QNAS_MANAGER_QUERY } from './qnas';

export const QNA_NOTICE_QUERY = gql`
  query qnaNotice($input: QnaNoticeInput!) {
    qnaNotice(input: $input) {
      error
      ok
      qnaNotice {
        id
        createdAt
        userName
        title
        description
        views
      }
    }
  }
`;

type TNoticeParams = {
  id: string;
};

interface IQnaCommentWriteForm {
  description: string;
}

export const QnaNotice = () => {
  const { id } = useParams() as TNoticeParams;

  const qnaNoticeId = Number(id);
  console.log(qnaNoticeId);

  const { data, refetch } = useQuery<QnaNoticeQuery, QnaNoticeQueryVariables>(
    QNA_NOTICE_QUERY,
    {
      variables: {
        input: {
          qnaNoticeId,
        },
      },
    }
  );
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

  const [prevQnaId, setPrevQnaId] = useState<number | null>(null);
  const [prevQnaTitle, setPrevQnaTitle] = useState<string | null>(null);
  const [prevQnaCreateAt, setPrevQnaCreateAt] = useState<string | null>(null);

  const [nextQnaId, setNextQnaId] = useState<number | null>(null);
  const [nextQnaTitle, setNextQnaTitle] = useState<string | null>(null);
  const [nextQnaCreateAt, setNextQnaCreateAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchNearbyNotices = async () => {
      try {
        const result = await client.query<
          QnaNoticesQuery,
          QnaNoticesQueryVariables
        >({
          query: QNAS_MANAGER_QUERY,
        });

        const qnasNotices = result.data.qnaNotices.results;

        if (!qnasNotices) {
          // Handle case where notices array is not available
          setPrevQnaId(null);
          setNextQnaId(null);
          return;
        }

        const currentIndex = qnasNotices?.findIndex(
          (qnaNotice) => qnaNotice.id === qnaNoticeId
        );
        if (currentIndex !== -1) {
          if (currentIndex > 0) {
            setPrevQnaId(qnasNotices[currentIndex - 1]?.id);
            setPrevQnaTitle(qnasNotices[currentIndex - 1]?.title);
            setPrevQnaCreateAt(qnasNotices[currentIndex - 1]?.createdAt);
          } else {
            setPrevQnaId(null);
          }

          if (currentIndex < qnasNotices.length - 1) {
            setNextQnaId(qnasNotices[currentIndex + 1].id);
            setNextQnaTitle(qnasNotices[currentIndex + 1].title);
            setNextQnaCreateAt(qnasNotices[currentIndex + 1]?.createdAt);
          } else {
            setNextQnaId(null);
          }
        } else {
          setPrevQnaId(null);
          setNextQnaId(null);
        }
      } catch (error) {
        console.error('Error fetching nearby notices:', error);
      }
    };

    fetchNearbyNotices();
  }, [qnaNoticeId]);

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
          <title>WAVENEXUS</title>
        </Helmet>
      </HelmetProvider>
      <div>
        <div className=' w-full  mx-auto  flex flex-col items-center bg-center px-10'>
          {/* Intro section */}
          <div className='w-full max-w-screen-2xl xl:px-0 mb-20'>
            <div className='max-w-screen-2xl pb-14 mx-auto mt-8 '>
              <div className='text-2xl md:text-4xl font-bold text-gray-600 flex justify-between mt-16   gap-y-10'>
                <span>{data?.qnaNotice.qnaNotice?.title}</span>
              </div>
            </div>
            <table className='table-auto w-full mx-auto '>
              <tbody>
                <tr>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-l-0 border-gray-400 md:px-2 md:py-2  font-bold w-52 md:w-12'>
                    작성자
                  </td>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-r-0 border-gray-400 md:px-2 md:py-2  font-bold w-52 md:w-28'>
                    {data?.qnaNotice.qnaNotice?.userName}
                  </td>
                  <td className=' md:px-2 md:py-2  font-bold text-center w-0 md:w-10'></td>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-l-0 border-gray-400  px-2 py-2  font-bold w-56  md:w-12'>
                    작성일
                  </td>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-r-0 border-gray-400 px-2 py-2  font-bold  w-14'>
                    {formatDate(data?.qnaNotice.qnaNotice?.createdAt)}
                  </td>
                  <td className=' md:px-2 md:py-2  font-bold text-center w-0 md:w-10'></td>
                  <td className='w-56 text-xs md:text-lg border border-t-0 border-b-0 border-l-0 border-gray-400 px-2 py-2  font-bold  md:w-12'>
                    조회수
                  </td>
                  <td className='text-xs px-2 md:text-lg py-2  font-bold text-center w-14'>
                    {data?.qnaNotice.qnaNotice?.views}
                  </td>
                  <td className=' px-2 py-2  font-bold text-center w-20 md:w-64'></td>
                </tr>
                <tr>
                  <td colSpan={9} className=' px-2 py-2  font-bold'></td>
                </tr>
                <tr>
                  <td
                    colSpan={9}
                    className=' px-2 py-2  font-bold text-lg md:text-2xl whitespace-pre-wrap'
                  >
                    {data?.qnaNotice.qnaNotice?.description}
                  </td>
                </tr>
              </tbody>
            </table>

            <div className='flex justify-between w-full mx-auto pt-20  '>
              <div
                className={`w-full border border-gray-400 ${
                  prevQnaId === null
                    ? 'bg-gray-200 bg-opacity-90 disabled-link text'
                    : ''
                }`}
              >
                {prevQnaId === null ? (
                  <div
                    className='flex flex-col h-28 justify-center ml-5'
                    style={{ userSelect: 'none' }}
                  >
                    <div className='flex flex-row justify-start'>
                      <div className='flex flex-col ml-3'>
                        <span className='md:text-xl'>첫번째 글</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={`/qna/${prevQnaId}`}
                    className='flex flex-col h-28 justify-center ml-5'
                  >
                    <div className='flex flex-row justify-start'>
                      <span>&larr;</span>
                      <div className='flex flex-col ml-3'>
                        <span>이전글</span>
                        <span className='md:text-xl py-1'>
                          {shortenText(prevQnaTitle)}
                        </span>
                        <span>
                          {prevQnaCreateAt && formatDate(prevQnaCreateAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              <div
                className={`w-full text-right border border-gray-400 ${
                  nextQnaId === null
                    ? 'bg-gray-200 bg-opacity-90 disabled-link text'
                    : ''
                }`}
              >
                {nextQnaId === null ? (
                  <div
                    className='flex flex-col h-28 justify-center mr-5 '
                    style={{ userSelect: 'none' }}
                  >
                    <div className='flex flex-row justify-end'>
                      <div className='flex flex-col mr-3'>
                        <span className='md:text-xl '>마지막 글</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    to={`/qna/${nextQnaId}`}
                    className='flex flex-col h-28 justify-center mr-5'
                  >
                    <div className='flex flex-row justify-end'>
                      <div className='flex flex-col mr-3'>
                        <span>다음글</span>
                        <span className='md:text-xl text-sm py-1'>
                          {shortenText(nextQnaTitle)}
                        </span>
                        <span>
                          {nextQnaCreateAt && formatDate(nextQnaCreateAt)}
                        </span>
                      </div>
                      <span>&rarr;</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
