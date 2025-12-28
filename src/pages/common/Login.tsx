import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import styled from 'styled-components';
import { authTokenVar, isLoggedInAccessTokenVar } from '../../types/apollo';
import { Button } from '../../components/User-Element/button';
import { FormError } from '../../components/User-Element/form-error';
import { LoginMutation, LoginMutationVariables } from '../../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { LOCALSTORAGE_TOKEN } from '../../types/constants';
import { useReactiveVar } from '@apollo/client';
import { authErrorReasonVar } from '../../types/apollo';
import { AuthErrorReason } from '../../types/types';

export const LOGIN_MUTATION = gql`
  mutation login($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;

interface ILoginForm {
  userId: string;
  password: string;
}

export const Login = () => {
  const navigate = useNavigate();
  const authErrorReason = useReactiveVar(authErrorReasonVar);

  // ⭐ 여기에 둔다
  useEffect(() => {
    const reason = localStorage.getItem('LAST_LOGOUT_REASON');

    if (reason) {
      authErrorReasonVar(reason as AuthErrorReason);
      localStorage.removeItem('LAST_LOGOUT_REASON'); // 1회성
    }
  }, []);

  const {
    register,
    getValues,
    formState: { errors, isValid },
    handleSubmit,
  } = useForm<ILoginForm>({ mode: 'onChange' });

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInAccessTokenVar(true);

      authErrorReasonVar(null); // ⭐ 반드시 초기화

      navigate('/admin'); // 여기까지만
    }
  };

  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    LoginMutation,
    LoginMutationVariables
  >(LOGIN_MUTATION, { onCompleted });

  const onSubmit = () => {
    if (!loading) {
      const { userId, password } = getValues();
      loginMutation({
        variables: { loginInput: { userId, password } },
      });
    }
  };

  return (
    <Container>
      <HelmetProvider>
        <Helmet>
          <title>Login | Admin site</title>
        </Helmet>
      </HelmetProvider>

      <Card>
        {authErrorReason === 'EXPIRED' && (
          <AuthAlert type="token-expired">
            ⏰ 로그인 시간이 만료되었습니다.
            <br />
            보안을 위해 다시 로그인해주세요.
          </AuthAlert>
        )}

        {authErrorReason === 'INVALID' && (
          <AuthAlert type="token-invalid">
            ⚠️ 인증 정보가 유효하지 않습니다.
            <br />
            다시 로그인해주세요.
          </AuthAlert>
        )}

        {authErrorReason === 'IDLE_TIMEOUT' && (
          <AuthAlert type="idle-timeout">
            ⏰ 장시간 활동이 없어 로그아웃되었습니다.
            <br />
            보안을 위해 다시 로그인해주세요.
          </AuthAlert>
        )}
        <Title>관리자 사이트</Title>
        <Subtitle>광혜원순복음교회</Subtitle>

        <Form onSubmit={handleSubmit(onSubmit)}>
          <Input
            {...register('userId', {
              required: '아이디를 작성해주십시요.',
              /* pattern:
                /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, */
            })}
            /* type="email" */
            placeholder="Enter your ID"
          />
          {errors.userId?.message && <FormError errorMessage={errors.userId.message} />}
          {errors.userId?.type === 'pattern' && (
            <FormError errorMessage={'Please enter a valid email'} />
          )}

          <Input
            {...register('password', { required: '비밀번호를 입력해주십시요.' })}
            type="password"
            placeholder="Password"
          />
          {errors.password?.message && <FormError errorMessage={errors.password.message} />}

          <CreateAccountlinkDiv>
            <StyledLink to="/admin/create-account">Create an Account</StyledLink>
          </CreateAccountlinkDiv>

          <StyledButton
            as={Button}
            canClick={isValid}
            loading={loading}
            actionText="Log in"
          />

          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult.login.error} />
          )}
        </Form>

        {/* <SignupText>
          New to Nuber? <StyledLink to="/create-account">Create an Account</StyledLink>
        </SignupText> */}
      </Card>
    </Container>
  );
};

//
// ---------- styled-components ----------
//

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(145deg, #d9f99d, #fefefe, #ecfccb);
  padding: 1rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 400px;
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transition: 0.3s ease all;

  &:hover {
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

type AuthAlertType = 'token-expired' | 'token-invalid' | 'idle-timeout';

const alertTheme: Record<AuthAlertType, { bg: string; shadow: string }> = {
  'token-expired': {
    bg: 'linear-gradient(135deg, #f97316, #ea580c)',
    shadow: 'rgba(249, 115, 22, 0.35)',
  },
  'idle-timeout': {
    bg: 'linear-gradient(135deg, #eab308, #ca8a04)',
    shadow: 'rgba(234, 179, 8, 0.35)',
  },
  'token-invalid': {
    bg: 'linear-gradient(135deg, #ef4444, #b91c1c)',
    shadow: 'rgba(239, 68, 68, 0.45)',
  },
};

const AuthAlert = styled.div<{ type: AuthAlertType }>`
  margin-bottom: 1.5rem;
  padding: 1.1rem 1.3rem;
  border-radius: 14px;

  font-weight: 800;
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: center;
  letter-spacing: -0.01em;

  color: #ffffff;

  background: ${({ type }) => alertTheme[type].bg};
  box-shadow: 0 12px 30px ${({ type }) => alertTheme[type].shadow};

  animation:
    shake 0.35s ease,
    fadeIn 0.25s ease;

  /* 접근성 */
  role: alert;
  aria-live: assertive;

  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    20% {
      transform: translateX(-4px);
    }
    40% {
      transform: translateX(4px);
    }
    60% {
      transform: translateX(-4px);
    }
    80% {
      transform: translateX(4px);
    }
    100% {
      transform: translateX(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 800;
  text-align: center;
  color: #65a30d;
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #6b7280;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.9rem 1rem;
  border: 1px solid #d1d5db;
  border-radius: 10px;
  font-size: 1rem;
  color: #374151;
  transition: all 0.25s ease;

  &:focus {
    border-color: #84cc16;
    box-shadow: 0 0 0 3px rgba(132, 204, 22, 0.2);
    outline: none;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 0.5rem;
`;

const CreateAccountlinkDiv = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #6b7280;
  font-size: 0.95rem;
`;

const StyledLink = styled(Link)`
  color: #65a30d;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
