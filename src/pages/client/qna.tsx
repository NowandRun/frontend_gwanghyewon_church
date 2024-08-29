import { gql, useMutation, useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  CreateQnaCommentMutation,
  CreateQnaCommentMutationVariables,
  QnaQuery,
  QnaQueryVariables,
  QnasQuery,
  QnasQueryVariables,
} from '../../gql/graphql';
import { format } from 'date-fns';
import { client } from '../../apollo';
import { Link } from 'react-router-dom';
import { QNAS_CLIENT_QUERY } from './qnas';
import { useForm } from 'react-hook-form';
import { useMe } from '../../hooks/useMe';
import { HelmetProvider } from 'react-helmet-async';
import { Helmet } from 'react-helmet';
import Favicon from '../../styles/images/wavenexus-logo-two.png';

const QNA_QUERY = gql`
  query qna($input: QnaInput!) {
    qna(input: $input) {
      error
      ok
      qna {
        id
        createdAt
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

const QNA_COMMENT_CREATE_MUTATIONS = gql`
  mutation createQnaComment($input: CreateQnaCommentInput!) {
    createQnaComment(input: $input) {
      error
      ok
      results {
        id
        createdAt
        commentOwner
        userId
        comment
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

export const Qna = () => {
  const { id } = useParams() as TNoticeParams;

  const qnaId = Number(id);

  const {
    data: identifyData,
    loading: identifyLoading,
    error: identifyError,
  } = useMe();

  const { data, refetch } = useQuery<QnaQuery, QnaQueryVariables>(QNA_QUERY, {
    variables: {
      input: {
        qnaId,
      },
    },
  });

  const onCompleted = (data: CreateQnaCommentMutation) => {
    const {
      createQnaComment: { ok, error, results },
    } = data;
    if (ok) {
      refetch();
      setValue('description', '');
    }
  };

  const [uploading, setUploading] = useState(false);

  const [
    createQnaCommentMutation,
    { data: createCommentData, loading, error },
  ] = useMutation<CreateQnaCommentMutation, CreateQnaCommentMutationVariables>(
    QNA_COMMENT_CREATE_MUTATIONS,
    {
      onCompleted,
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
        const result = await client.query<QnasQuery, QnasQueryVariables>({
          query: QNAS_CLIENT_QUERY,
          variables: {
            input: {
              page: 1,
            },
          },
        });

        const qnas = result.data.qnas.results;

        if (!qnas) {
          // Handle case where notices array is not available
          setPrevQnaId(null);
          setNextQnaId(null);
          return;
        }

        const currentIndex = qnas?.findIndex((qna) => qna.id === qnaId);
        if (currentIndex !== -1) {
          if (currentIndex > 0) {
            setPrevQnaId(qnas[currentIndex - 1]?.id);
            setPrevQnaTitle(qnas[currentIndex - 1]?.title);
            setPrevQnaCreateAt(qnas[currentIndex - 1]?.createdAt);
          } else {
            setPrevQnaId(null);
          }

          if (currentIndex < qnas.length - 1) {
            setNextQnaId(qnas[currentIndex + 1].id);
            setNextQnaTitle(qnas[currentIndex + 1].title);
            setNextQnaCreateAt(qnas[currentIndex + 1]?.createdAt);
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
  }, [qnaId]);

  const shortenText = (text: string | null | undefined) => {
    if (!text) return '';

    if (text.length > 17) {
      return `${text.substring(0, 15)}...`;
    } else {
      return text;
    }
  };

  const onSubmit = () => {
    setUploading(true);
    const { description } = getValues();
    createQnaCommentMutation({
      variables: {
        input: {
          comment: description,
          qnaId,
        },
      },
    });
  };

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value } = event.target;
    if (value.length <= 60) {
      setValue('description', value);
    }
  };

  const {
    register,
    setValue,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IQnaCommentWriteForm>({
    mode: 'onChange',
  });

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
                <span>{data?.qna.qna?.title}</span>
              </div>
            </div>
            <table className='table-auto w-full mx-auto '>
              <tbody>
                <tr>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-l-0 border-gray-400 md:px-2 md:py-2  font-bold w-52 md:w-12'>
                    작성자
                  </td>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-r-0 border-gray-400 md:px-2 md:py-2  font-bold w-52 md:w-28'>
                    {data?.qna.qna?.userName}
                  </td>
                  <td className=' md:px-2 md:py-2  font-bold text-center w-0 md:w-10'></td>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-l-0 border-gray-400  px-2 py-2  font-bold w-56  md:w-12'>
                    작성일
                  </td>
                  <td className='text-xs md:text-lg border border-t-0 border-b-0 border-r-0 border-gray-400 px-2 py-2  font-bold  w-14'>
                    {formatDate(data?.qna.qna?.createdAt)}
                  </td>
                  <td className=' md:px-2 md:py-2  font-bold text-center w-0 md:w-10'></td>
                  <td className='w-56 text-xs md:text-lg border border-t-0 border-b-0 border-l-0 border-gray-400 px-2 py-2  font-bold  md:w-12'>
                    조회수
                  </td>
                  <td className='text-xs px-2 md:text-lg py-2  font-bold text-center w-14'>
                    {data?.qna.qna?.views}
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
                    {data?.qna.qna?.description}
                  </td>
                </tr>
              </tbody>
            </table>
            {identifyData && (
              <form onSubmit={handleSubmit(onSubmit)} className='flex mt-5'>
                <div className='relative flex-1 '>
                  <textarea
                    {...register('description', {
                      required: '댓글을 작성하세요.',
                      maxLength: {
                        value: 60,
                        message: '댓글은 60자 이내로 작성해주세요.', // 최대 글자 수 초과 시 에러 메시지
                      },
                    })}
                    rows={3}
                    placeholder='댓글을 작성하세요.'
                    className={`input  w-full resize-none h-full pr-20 md:pr-32 ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                    onChange={handleChange}
                  />
                  {errors.description && (
                    <div className='text-center text-lg '>
                      <p className='text-red-500  mt-1'>
                        {errors.description.message}
                      </p>
                    </div>
                  )}

                  <button className='absolute  text-lg w-20 md:w-32 h-full text-white font-bold bg-gray-600 top-0 right-0'>
                    <span className='block'>댓글</span>
                    <span className='block'>작성</span>
                  </button>
                </div>
              </form>
            )}

            <table className='table-auto w-full  mx-auto mt-10'>
              {data?.qna.qna?.qnaComment
                ?.map((comment) => (
                  <tbody key={comment.id} className='text-xs md:text-base'>
                    <tr>
                      <td className='md:px-2 md:py-2 md:w-1/12 w-2/12 font-bold '>
                        {comment.commentOwner}
                      </td>
                      <td className='md:px-2 md:py-2 font-bold md:w-full whitespace-pre-wrap'>
                        {comment.comment}
                      </td>
                      <td className='md:px-2 md:py-2  font-bold '>
                        {formatDate(comment.createdAt)}
                      </td>
                    </tr>
                  </tbody>
                ))
                .reverse()}
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
