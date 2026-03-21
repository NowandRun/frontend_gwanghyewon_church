import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { Link } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import styled, { keyframes } from 'styled-components';
import { authTokenVar, isLoggedInAccessTokenVar } from '../../types/apollo';
import { Button } from '../../components/User-Element/button';
import { FormError } from '../../components/User-Element/form-error';
import { LoginMutation, LoginMutationVariables } from '../../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { LOCALSTORAGE_TOKEN } from '../../types/constants';

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

type AuthAlertType = 'token-expired' | 'idle-timeout';

const REMEMBER_ME_KEY = 'remember_admin_id'; // 로컬스토리지 키값

export const Login = () => {
  const navigate = useNavigate();
  const [authAlert, setAuthAlert] = useState<AuthAlertType | null>(null);

  // 1️⃣ 초기값 설정: 로컬 스토리지에서 저장된 아이디 가져오기
  const savedId = localStorage.getItem(REMEMBER_ME_KEY) || '';

  useEffect(() => {
    const authError = sessionStorage.getItem('authError') as AuthAlertType | null;

    if (authError) {
      setAuthAlert(authError);
      sessionStorage.removeItem('authError');
    }
  }, []);

  const {
    register,
    getValues,
    setValue, // 수동으로 값을 넣기 위해 추가
    formState: { errors, isValid },
    handleSubmit,
    watch, // 체크박스 상태 감시를 위해 추가
  } = useForm<ILoginForm>({
    mode: 'onChange',
    defaultValues: {
      userId: savedId, // 저장된 아이디가 있으면 입력창에 미리 채움
    },
  });

  // 아이디 기억하기 체크박스 상태 감시
  const rememberMe = watch('rememberMe' as any);

  useEffect(() => {
    const authError = sessionStorage.getItem('authError') as AuthAlertType | null;
    if (authError) {
      setAuthAlert(authError);
      sessionStorage.removeItem('authError');
    }
  }, []);

  const onCompleted = (data: LoginMutation) => {
    const {
      login: { ok, token },
    } = data;
    if (ok && token) {
      // 2️⃣ 로그인 성공 시 아이디 기억 로직 실행
      const { userId } = getValues();
      if (rememberMe) {
        localStorage.setItem(REMEMBER_ME_KEY, userId);
      } else {
        localStorage.removeItem(REMEMBER_ME_KEY);
      }

      setAuthAlert(null);
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInAccessTokenVar(true);
      navigate('/admin');
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
          <title>Login | 광혜원순복음교회 관리자</title>
        </Helmet>
      </HelmetProvider>

      <Card>
        <Header>
          <LogoWrapper>
            {/* 교회 로고 SVG 혹은 아이콘 */}
            <LogoIcon viewBox="0 0 24 24">
              <path
                d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"
                fill="currentColor"
              />
            </LogoIcon>
          </LogoWrapper>
          <Title>Admin Center</Title>
          <Subtitle>광혜원순복음교회 관리자 사이트</Subtitle>
        </Header>

        {authAlert && (
          <AuthAlert isTimeout={authAlert === 'idle-timeout'}>
            <AlertIcon>{authAlert === 'idle-timeout' ? '⏱' : '⏰'}</AlertIcon>
            <AlertText>
              {authAlert === 'idle-timeout'
                ? '장시간 활동이 없어 자동 로그아웃되었습니다.'
                : '세션이 만료되었습니다. 다시 로그인해주세요.'}
            </AlertText>
          </AuthAlert>
        )}

        <Form onSubmit={handleSubmit(onSubmit)}>
          <InputGroup>
            <Label>Admin ID</Label>
            <Input
              {...register('userId', { required: '아이디를 입력해주세요.' })}
              placeholder="아이디를 입력하세요"
            />
            {errors.userId?.message && <FormError errorMessage={errors.userId.message} />}
          </InputGroup>

          <InputGroup>
            <Label>Password</Label>
            <Input
              {...register('password', { required: '비밀번호를 입력해주세요.' })}
              type="password"
              placeholder="••••••••"
            />
            {errors.password?.message && <FormError errorMessage={errors.password.message} />}
          </InputGroup>

          <HelperRow>
            <RememberMe>
              {/* 3️⃣ 체크박스에 register 연결 및 초기 체크 상태 설정 */}
              <input
                {...register('rememberMe' as any)}
                type="checkbox"
                id="remember"
                defaultChecked={!!savedId}
              />
              <label htmlFor="remember">아이디 기억하기</label>
            </RememberMe>
          </HelperRow>

          <StyledButton
            type="submit" // handleSubmit을 실행하기 위해 필수
            canClick={isValid && !loading} // 유효성 검사 + 로딩 중 아님 체크
            disabled={!isValid || loading}
          >
            {loading ? '로그인 중...' : '로그인'}
          </StyledButton>

          {loginMutationResult?.login.error && (
            <ErrorMessageWrapper>
              <FormError errorMessage={loginMutationResult.login.error} />
            </ErrorMessageWrapper>
          )}
        </Form>
      </Card>
    </Container>
  );
};

//
// ---------- styled-components ----------
//

const gradientAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const Container = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(-45deg, #f7fee7, #ecfccb, #f0fdf4, #ffffff);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  padding: 1.5rem;
`;

const Card = styled.div`
  width: 100%;
  max-width: 440px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 24px;
  padding: 3rem 2.5rem;
  box-shadow:
    0 20px 40px rgba(0, 0, 0, 0.05),
    0 1px 3px rgba(0, 0, 0, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.7);
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const LogoWrapper = styled.div`
  width: 60px;
  height: 60px;
  background: #ecfccb;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.2rem;
  color: #65a30d;
`;

const LogoIcon = styled.svg`
  width: 32px;
  height: 32px;
`;

const Title = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: #1f2937;
  letter-spacing: -0.02em;
`;

const Subtitle = styled.p`
  font-size: 0.95rem;
  color: #6b7280;
  margin-top: 0.4rem;
`;

const AuthAlert = styled.div<{ isTimeout: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 2rem;
  padding: 1rem;
  border-radius: 12px;
  background: ${(props) => (props.isTimeout ? '#fff7ed' : '#fef2f2')};
  border: 1px solid ${(props) => (props.isTimeout ? '#fdba74' : '#fecaca')};
  animation: slideDown 0.4s ease;

  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const AlertIcon = styled.span`
  font-size: 1.2rem;
`;
const AlertText = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
  color: #9a3412;
  line-height: 1.4;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 700;
  color: #4b5563;
  margin-left: 2px;
`;

const Input = styled.input`
  padding: 1rem 1.2rem; /* 패딩을 조금 더 키움 */
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  transition: all 0.2s ease;
  background: #fcfdfb; /* 미세한 연두빛 화이트 */

  &:focus {
    background: #fff;
    border-color: #84cc16;
    box-shadow: 0 0 0 4px rgba(132, 204, 22, 0.1);
    outline: none;
  }
`;

const HelperRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
`;

const RememberMe = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  color: #6b7280;
  cursor: pointer;
  input {
    cursor: pointer;
    accent-color: #84cc16;
  }
`;

const StyledButton = styled.button<{ canClick: boolean }>`
  all: unset; /* 기본 버튼 스타일 초기화 */
  width: 100%;
  padding: 1rem 0;
  margin-top: 1rem;
  border-radius: 12px;
  background: ${(props) =>
    props.canClick ? 'linear-gradient(135deg, #84cc16 0%, #65a30d 100%)' : '#e5e7eb'};
  color: ${(props) => (props.canClick ? 'white' : '#9ca3af')};
  text-align: center;
  font-size: 1rem;
  font-weight: 700;
  cursor: ${(props) => (props.canClick ? 'pointer' : 'not-allowed')};
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.canClick ? '0 10px 15px -3px rgba(101, 163, 13, 0.3)' : 'none')};

  /* 호버 효과: 활성화 상태일 때만 */
  &:hover {
    ${(props) =>
      props.canClick &&
      `
      transform: translateY(-2px);
      box-shadow: 0 15px 20px -5px rgba(101, 163, 13, 0.4);
      filter: brightness(1.05);
    `}
  }

  /* 클릭 효과 */
  &:active {
    ${(props) => props.canClick && `transform: translateY(0);`}
  }
`;

const ErrorMessageWrapper = styled.div`
  background: #fff1f2;
  padding: 0.8rem;
  border-radius: 8px;
  border-left: 4px solid #f43f5e;
`;
