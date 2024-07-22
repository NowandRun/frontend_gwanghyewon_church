// login.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../../components/form-error';
import { ApolloError, gql, useMutation } from '@apollo/client';
import { LoginMutation, LoginMutationVariables } from '../../gql/graphql';
import MyLogo from '../../styles/images/wavenexus.png';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Favicon from '../../styles/images/wavenexus-logo-two.png';

import { Button } from '../../components/button';
import { useNavigate } from 'react-router-dom';
import {
  authAccessToken,
  authRefreshToken,
  isLoggedInAcessTokenVar,
  isLoggedInRefresTokenVar,
} from '../../apollo';
import {
  LOCALSTORAGE_ACCESSTOKEN,
  LOCALSTORAGE_REFRESHTOKEN,
} from '../../constants';
import { useMe } from '../../hooks/useMe';

/* mutation 적용하기 */
const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      accessToken
      refreshToken
      error
    }
  }
`;

interface ILoginForm {
  userId: string;
  password: string;
}

export const Login = () => {
  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ILoginForm>();

  const navigate = useNavigate();

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, error, accessToken, refreshToken },
    } = data;
    if (ok && accessToken && refreshToken) {
      localStorage.setItem(LOCALSTORAGE_ACCESSTOKEN, accessToken);
      localStorage.setItem(LOCALSTORAGE_REFRESHTOKEN, refreshToken);
      authAccessToken(accessToken);
      authRefreshToken(refreshToken);
      isLoggedInAcessTokenVar(true);
      isLoggedInRefresTokenVar(true);
      navigate('/');
    }
  };

  const [buttonText, setButtonText] = useState('Login');

  const onError = (error: ApolloError) => {
    if (error.message === 'Response not successful: Received status code 500') {
      localStorage.removeItem(LOCALSTORAGE_ACCESSTOKEN);
      localStorage.removeItem(LOCALSTORAGE_REFRESHTOKEN);
      setButtonText('다시 시도해주세요'); // 버튼 텍스트를 '다시 시도해주세요'로 변경
    }
  };

  // codegen을 활용한 type 검증
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
    onError,
  });

  const onSubmit = () => {
    if (!loading) {
      const { userId, password } = getValues();
      /* mutation에 변수추가하기 */
      loginMutation({
        variables: {
          loginInput: {
            userId,
            password,
          },
        },
      });
    }
  };

  return (
    <div className='h-screen flex items-center flex-col  justify-center max-h-full '>
      <HelmetProvider>
        <Helmet>
          <link rel='icon' type='image/png' href={Favicon} />
          <title>로그인 | WAVENEXUS</title>
        </Helmet>
      </HelmetProvider>
      <div className='w-full max-w-screen-sm flex flex-col px-5 '>
        <div className='flex flex-col items-center'>
          <img src={MyLogo} className='w-40 mb-5' />
        </div>
        <div className=' text-sm'>
          <span className='w-full font-medium text-left text-sm mb-5'>
            WAVENEXUS에서 제공해드린 고객 아이디와 비밀번호를 입력해주시기
            바랍니다.
          </span>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='grid gap-3 mt-5 w-full'
        >
          <input
            {...register('userId', { required: 'ID is required' })}
            required
            name='userId'
            type='text'
            placeholder='ID'
            className='input '
          />

          {errors.userId?.message && (
            /* Function을 통한 error 처리하는 방법  */
            <FormError errorMessage={errors.userId?.message} />
          )}

          <input
            {...register('password', {
              required: 'Password is required',
            })}
            required
            name='password'
            type='password'
            placeholder='Password'
            className='input'
          />

          {errors.password?.message && (
            /* Function을 통한 error 처리하는 방법  */
            <FormError errorMessage={errors.password?.message} />
          )}

          {errors.password?.type === 'minLength' && (
            /* Function을 통한 error 처리하는 방법  */
            <FormError errorMessage='Password must be more than 10 chars.' />
          )}

          <Button
            canClick={isValid}
            loading={loading}
            actionText={buttonText}
          />
          <div className='text-center'>
            {loginMutationResult?.login.error && (
              <FormError errorMessage={loginMutationResult.login.error} />
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
