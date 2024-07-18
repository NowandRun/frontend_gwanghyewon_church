import React, { useState } from 'react';
import { Box, TextareaAutosize } from '@mui/material';
import CustomModal from './Modal';
import MyLogo from '../styles/images/wavenexus-logo-two.png';
import { useForm } from 'react-hook-form';
import { ApolloError, gql, useMutation } from '@apollo/client';
import {
  CreateNoticeMutation,
  CreateNoticeMutationVariables,
  UserRole,
} from '../gql/graphql';
import { Button } from './button';
import { FormError } from './form-error';
import { useNavigate } from 'react-router-dom';
import { useMe } from '../hooks/useMe';

interface NoticeProps {
  openNoticeModal: () => void;
  isNoticeModalOpen: boolean;
  closeNoticeModal: () => void;
}

interface INoticeWriteForm {
  title: string;
  description: string;
}

/* mutation 적용하기 */
const NOTICE_WRITE_MUTATION = gql`
  mutation createNotice($input: CreateNoticeInput!) {
    createNotice(input: $input) {
      error
      ok
      noticeId
    }
  }
`;

const NoticeWrite: React.FC<NoticeProps> = ({
  isNoticeModalOpen,
  openNoticeModal,
  closeNoticeModal,
}) => {
  const {
    data: identifyData,
    loading: identifyLoading,
    error: identifyError,
  } = useMe();

  const onCompleted = (data: CreateNoticeMutation) => {
    const {
      createNotice: { ok, error, noticeId },
    } = data;
    if (ok) {
      setUploading(false);
      closeNoticeModal();
    }
  };
  const navigate = useNavigate();
  const [createNoticeMutation, { data, loading, error }] = useMutation<
    CreateNoticeMutation,
    CreateNoticeMutationVariables
  >(NOTICE_WRITE_MUTATION, {
    onCompleted,
    onError: (error: ApolloError) => {
      if (error.message === 'Forbidden resource') {
        alert('다시 시도해주세요');
        navigate('/notice'); // '/notice' 페이지로 리다이렉트
      }
    },
  });

  const [uploading, setUploading] = useState(false);

  const onSubmit = () => {
    setUploading(true);
    const { title, description } = getValues();
    createNoticeMutation({
      variables: {
        input: {
          title,
          description,
        },
      },
    });
  };

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<INoticeWriteForm>({
    mode: 'onChange',
  });

  return (
    <div>
      {identifyData && identifyData.me.role === UserRole.Manager && (
        <div
          className='cursor-pointer text-right hover:scale-95 '
          onClick={openNoticeModal}
        >
          <span className='ml-5 text-2xl font-extrabold'>글작성</span>
        </div>
      )}

      <CustomModal isOpen={isNoticeModalOpen} closeModal={closeNoticeModal}>
        <Box sx={{ border: 'none' }}>
          <div className='flex px-10 items-end  mt-5 pb-4 '>
            <img src={MyLogo} className='w-10  py-2' />
            <div className='mb-2 '>
              <span className='text-2xl   w-11/12 mx-auto px-2 pb-3 font-bold '>
                공지사항
              </span>
            </div>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <input
              className='input'
              placeholder='제목'
              {...register('title', { required: '제목을 입력해주세요.' })}
            />
            <TextareaAutosize
              {...register('description', {
                required: '메시지를 입력해주세요.',
              })}
              minRows={3} // 최소 행 수 설정
              maxRows={6} // 최대 행 수 설정
              placeholder='메시지를 입력하세요.'
              className='input'
            />
            <br />
            <Button loading={loading} canClick={isValid} actionText='확인' />
            {data?.createNotice.error && (
              <FormError errorMessage={data.createNotice.error} />
            )}
          </form>
        </Box>
      </CustomModal>
    </div>
  );
};

export default NoticeWrite;
