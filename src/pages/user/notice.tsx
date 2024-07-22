import { gql, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  NoticeQuery,
  NoticeQueryVariables,
  NoticesQuery,
  NoticesQueryVariables,
} from '../../gql/graphql';
import { format } from 'date-fns';
import { client } from '../../apollo';
import { NOTICES_QUERY } from '../client/notices';
import { Link } from 'react-router-dom';

const NOTICE_QUERY = gql`
  query notice($input: NoticeInput!) {
    notice(input: $input) {
      error
      ok
      notice {
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

export const Notice = () => {
  const { id } = useParams() as TNoticeParams;

  const noticeId = Number(id);

  const { data } = useQuery<NoticeQuery, NoticeQueryVariables>(NOTICE_QUERY, {
    variables: {
      input: {
        noticeId,
      },
    },
  });

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

  const [prevNoticeId, setPrevNoticeId] = useState<number | null>(null);
  const [prevNoticeTitle, setPrevNoticeTitle] = useState<string | null>(null);
  const [prevNoticeCreateAt, setPrevNoticeCreateAt] = useState<string | null>(
    null
  );

  const [nextNoticeId, setNextNoticeId] = useState<number | null>(null);
  const [nextNoticeTitle, setNextNoticeTitle] = useState<string | null>(null);
  const [nextNoticeCreateAt, setNextNoticeCreateAt] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchNearbyNotices = async () => {
      try {
        const result = await client.query<NoticesQuery, NoticesQueryVariables>({
          query: NOTICES_QUERY,
          variables: {
            input: {
              page: 1,
            },
          },
        });

        const notices = result.data.notices.results;

        if (!notices) {
          // Handle case where notices array is not available
          setPrevNoticeId(null);
          setNextNoticeId(null);
          return;
        }

        const currentIndex = notices?.findIndex(
          (notice) => notice.id === noticeId
        );
        if (currentIndex !== -1) {
          if (currentIndex > 0) {
            setPrevNoticeId(notices[currentIndex - 1]?.id);
            setPrevNoticeTitle(notices[currentIndex - 1]?.title);
            setPrevNoticeCreateAt(notices[currentIndex - 1]?.createdAt);
          } else {
            setPrevNoticeId(null);
          }

          if (currentIndex < notices.length - 1) {
            setNextNoticeId(notices[currentIndex + 1].id);
            setNextNoticeTitle(notices[currentIndex + 1].title);
            setNextNoticeCreateAt(notices[currentIndex + 1]?.createdAt);
          } else {
            setNextNoticeId(null);
          }
        } else {
          setPrevNoticeId(null);
          setNextNoticeId(null);
        }
      } catch (error) {
        console.error('Error fetching nearby notices:', error);
      }
    };

    fetchNearbyNotices();
  }, [noticeId]);

  const shortenText = (text: string | null | undefined) => {
    if (!text) return '';

    if (text.length > 10) {
      return `${text.substring(0, 15)}...`;
    } else {
      return text;
    }
  };

  return (
    <>
      <div>
        <div className=' w-full  mx-auto  flex flex-col items-center bg-center px-10'>
          {/* Intro section */}
          <div className='w-full max-w-screen-2xl xl:px-40 mb-20'>
            <div className='max-w-screen-2xl pb-14 mx-auto mt-8 '>
              <div className='text-2xl md:text-4xl font-bold text-gray-600 flex justify-between mt-16   gap-y-10'>
                <span>{data?.notice.notice?.title}</span>
              </div>
            </div>
            <table className='table-auto w-full mx-auto '>
              <tbody>
                <tr>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-l-0 border-gray-400 md:px-2 md:py-2  font-bold w-52 md:w-12'>
                    작성자
                  </td>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-r-0 border-gray-400 md:px-2 md:py-2  font-bold w-52 md:w-28'>
                    {data?.notice.notice?.userName}
                  </td>
                  <td className=' md:px-2 md:py-2  font-bold text-center w-0 md:w-10'></td>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-l-0 border-gray-400  px-2 py-2  font-bold w-56  md:w-12'>
                    작성일
                  </td>
                  <td className='text-xs border md:text-lg border-t-0 border-b-0 border-r-0 border-gray-400 px-2 py-2  font-bold  w-14'>
                    {formatDate(data?.notice.notice?.createdAt)}
                  </td>
                  <td className=' md:px-2 md:py-2  font-bold text-center w-0 md:w-10'></td>
                  <td className='w-56 text-xs border md:text-lg border-t-0 border-b-0 border-l-0 border-gray-400 px-2 py-2  font-bold  md:w-12'>
                    조회수
                  </td>
                  <td className='text-xs px-2 py-2 md:text-lg font-bold text-center w-14'>
                    {data?.notice.notice?.views}
                  </td>
                  <td className=' px-2 py-2  font-bold text-center w-20 md:w-64'></td>
                </tr>
                <tr>
                  <td colSpan={9} className=' px-2 py-2  font-bold '></td>
                </tr>
                <tr>
                  <td
                    colSpan={9}
                    className=' px-2 py-2  font-bold text-lg md:text-xl md:text-2xl'
                  >
                    {data?.notice.notice?.description}
                  </td>
                </tr>
              </tbody>
            </table>
            <div className='flex justify-between w-full mx-auto pt-20  '>
              <div
                className={`w-full border border-gray-400 ${
                  prevNoticeId === null
                    ? 'bg-gray-200 bg-opacity-90 disabled-link text'
                    : ''
                }`}
              >
                {prevNoticeId === null ? (
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
                    to={`/notice/${prevNoticeId}`}
                    className='flex flex-col h-28 justify-center ml-5'
                  >
                    <div className='flex flex-row justify-start'>
                      <span>&larr;</span>
                      <div className='flex flex-col ml-3'>
                        <span>이전글</span>
                        <span className='md:text-xl py-1'>
                          {shortenText(prevNoticeTitle)}
                        </span>
                        <span>
                          {prevNoticeCreateAt && formatDate(prevNoticeCreateAt)}
                        </span>
                      </div>
                    </div>
                  </Link>
                )}
              </div>

              <div
                className={`w-full text-right border border-gray-400 ${
                  nextNoticeId === null
                    ? 'bg-gray-200 bg-opacity-90 disabled-link text'
                    : ''
                }`}
              >
                {nextNoticeId === null ? (
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
                    to={`/notice/${nextNoticeId}`}
                    className='flex flex-col h-28 justify-center mr-5'
                  >
                    <div className='flex flex-row justify-end'>
                      <div className='flex flex-col mr-3'>
                        <span>다음글</span>
                        <span className='md:text-xl text-sm py-1'>
                          {shortenText(nextNoticeTitle)}
                        </span>
                        <span>
                          {nextNoticeCreateAt && formatDate(nextNoticeCreateAt)}
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
