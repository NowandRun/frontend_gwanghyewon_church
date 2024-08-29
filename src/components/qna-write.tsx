import React, { useState } from 'react';
import { Box, TextareaAutosize } from '@mui/material';
import CustomModal from './Modal';
import MyLogo from '../styles/images/wavenexus-logo-two.png';
import { useForm } from 'react-hook-form';
import { ApolloError, gql, useApolloClient, useMutation } from '@apollo/client';
import {
  CreateQnaMutation,
  CreateQnaMutationVariables,
  UserRole,
} from '../gql/graphql';
import { FormError } from './form-error';
import { useNavigate } from 'react-router-dom';
import { useMe } from '../hooks/useMe';
import { ClipLoader } from 'react-spinners';

interface QnaProps {
  openQnaModal: () => void;
  isQnaModalOpen: boolean;
  closeQnaModal: () => void;
}

interface IQnaWriteForm {
  title: string;
  description: string;
}

/* mutation 적용하기 */
const QNA_WRITE_MUTATION = gql`
  mutation createQna($input: CreateQnaInput!) {
    createQna(input: $input) {
      error
      ok
      qnaId
    }
  }
`;

const QnaWrite: React.FC<QnaProps> = ({
  isQnaModalOpen,
  openQnaModal,
  closeQnaModal,
}) => {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<IQnaWriteForm>({
    mode: 'onChange',
  });
  const {
    data: identifyData,
    loading: identifyLoading,
    error: identifyError,
  } = useMe();

  const onCompleted = (data: CreateQnaMutation) => {
    const {
      createQna: { ok, qnaId, error },
    } = data;
    if (ok) {
      setUploading(false);
      closeQnaModal();
      window.location.reload();
    }
  };

  const [createQnaMutation, { data, loading, error }] = useMutation<
    CreateQnaMutation,
    CreateQnaMutationVariables
  >(QNA_WRITE_MUTATION, {
    onCompleted,
    onError: (error: ApolloError) => {
      if (error.message === 'Forbidden resource') {
        alert('다시 시도해주세요');
        navigate('/qna'); //
      }
    },
  });

  const onSubmit = () => {
    setUploading(true);
    const { title, description } = getValues();
    createQnaMutation({
      variables: {
        input: {
          title,
          description,
        },
      },
    });
  };

  return (
    <div>
      {identifyData?.me.role === UserRole.Client && (
        <div className='cursor-pointer text-right' onClick={openQnaModal}>
          <span className='text-lg md:text-2xl font-extrabold'>글작성</span>
        </div>
      )}
      {identifyData?.me.role === UserRole.Manager && (
        <div className='cursor-pointer text-right' onClick={openQnaModal}>
          <span className='text-lg md:text-2xl font-extrabold'>
            공지글 작성
          </span>
        </div>
      )}
      <CustomModal isOpen={isQnaModalOpen} closeModal={closeQnaModal}>
        <Box sx={{ border: 'none' }}>
          <div className='md:py-20 md:px-16 py-10 px-8'>
            <div className='flex px-10 items-end   pb-4 '>
              <img src={MyLogo} className='w-10  py-2' />
              <div className='mb-2 '>
                {identifyData?.me.role === UserRole.Client ? (
                  <span className='md:text-2xl text-xl  md:w-11/12 mx-auto px-2 pb-3 font-bold '>
                    QNA 작성하기
                  </span>
                ) : (
                  <span className='md:text-2xl text-xl  md:w-11/12 mx-auto px-2 pb-3 font-bold '>
                    QNA 공지하기
                  </span>
                )}
              </div>
            </div>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='flex flex-col text-xl font-semibold'
            >
              <div className='flex justify-center '>
                <div className='flex items-center w-20'>
                  <span className='mr-3 '>제목:</span>
                </div>
                <input
                  className='input w-11/12'
                  placeholder='제목을 입력하세요'
                  {...register('title', { required: '제목을 입력해주세요.' })}
                />
              </div>

              <div className='flex justify-center mt-5'>
                <div className='w-20'>
                  <span className='mr-3'>내용:</span>
                </div>
                <textarea
                  {...register('description', {
                    required: '메시지를 입력해주세요.',
                  })}
                  rows={3}
                  placeholder='메시지를 입력하세요.'
                  className='input  w-11/12 resize-none'
                />
              </div>

              <br />
              <div className='flex justify-center'>
                <button
                  aria-label='submit-button'
                  className={`text-lg px-10 focus:outline-none font-medium text-white py-4  transition-colors ${
                    isValid
                      ? 'bg-gray-800 hover:bg-gray-900'
                      : 'bg-gray-300 pointer-events-none'
                  }`}
                >
                  {loading ? 'Loading...' : '확인'}
                </button>
                {data?.createQna.error && (
                  <FormError errorMessage={data.createQna.error} />
                )}
              </div>
            </form>
          </div>
        </Box>
      </CustomModal>
    </div>
  );
};

export default QnaWrite;
