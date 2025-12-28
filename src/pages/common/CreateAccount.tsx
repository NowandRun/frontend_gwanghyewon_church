import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { gql, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import styled from 'styled-components';
import { FormError } from '../../components/User-Element/form-error';
import {
  CreateAccountMutation,
  CreateAccountMutationVariables,
  PasswordCheakRole,
  UserRole,
} from '../../gql/graphql';

export const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      ok
      error
    }
  }
`;

interface ICreateAccountForm {
  userId: string;
  password: string;
  verifyPassword: string;
  userName?: string;
  address?: string;
  parish?: string;
  religious?: string;
  passwordCheakRole: PasswordCheakRole;
  passwordCheakFindWord: string;

  // ✅ 추가
  termsOfService: boolean;
  consentToCollectPersonalData: boolean;
  outsourcingTheProcessingOfPersonalData: boolean;
}

const PASSWORD_QUESTION_LABEL: Record<PasswordCheakRole, string> = {
  A: '보물 1호는?',
  B: '첫 애완동물 이름은?',
  C: '출생지는?',
  D: '어머니 성함은?',
  E: '아버지 성함은?',
  F: '초등학교 이름은?',
  G: '중학교 이름은?',
  H: '고등학교 이름은?',
  I: '대학 이름은?',
  J: '첫 직장 이름은?',
  K: '첫 자동차 모델은?',
  L: '인생 좌우명은?',
  M: '첫번째 가장 큰 목표는?',
};

export const CreateAccount = () => {
  const navigate = useNavigate();

  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ICreateAccountForm>({
    defaultValues: {
      passwordCheakRole: undefined,
      // ✅ 동의 기본값
      termsOfService: false,
      consentToCollectPersonalData: false,
      outsourcingTheProcessingOfPersonalData: false,
    },
  });

  const [createAccount, { loading, data }] = useMutation<
    CreateAccountMutation,
    CreateAccountMutationVariables
  >(CREATE_ACCOUNT_MUTATION);

  const onSubmit = (formData: ICreateAccountForm) => {
    if (loading) return;

    createAccount({
      variables: {
        input: {
          userId: formData.userId,
          password: formData.password,
          verifyPassword: formData.verifyPassword,
          userName: formData.userName,
          address: formData.address,
          parish: formData.parish,
          religious: formData.religious,
          // ✅ 핵심 수정
          role: UserRole.Client,

          passwordCheakFindWord: formData.passwordCheakFindWord,
          passwordCheakRole: formData.passwordCheakRole,

          termsOfService: formData.termsOfService,
          consentToCollectPersonalData: formData.consentToCollectPersonalData,
          outsourcingTheProcessingOfPersonalData: formData.outsourcingTheProcessingOfPersonalData,
        },
      },
      onCompleted: (data) => {
        if (data.createAccount.ok) {
          alert('회원가입 완료');
          navigate('/admin/login');
        }
      },
    });
  };

  const passwordRoleList = Object.values(PasswordCheakRole) as PasswordCheakRole[];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <HelmetProvider>
      <Helmet>
        <title>회원가입</title>
      </Helmet>

      <Wrapper>
        <Card>
          <Title>회원가입</Title>

          <form onSubmit={handleSubmit(onSubmit)}>
            <Input
              {...register('userId', { required: '아이디는 필수입니다.' })}
              placeholder="아이디"
            />
            <FormError errorMessage={errors.userId?.message} />

            <Input
              type="password"
              {...register('password', { required: '비밀번호는 필수입니다.' })}
              placeholder="비밀번호"
            />
            <FormError errorMessage={errors.password?.message} />

            <Input
              type="password"
              {...register('verifyPassword', { required: '비밀번호 확인은 필수입니다.' })}
              placeholder="비밀번호 확인"
            />
            <FormError errorMessage={errors.verifyPassword?.message} />

            <MakeAnswerWrapper>
              <QuestionLabel>비밀번호 찾기 질문</QuestionLabel>
              <QuestionDescription>
                추후 비밀번호 재설정 시 본인 확인에 사용됩니다.
              </QuestionDescription>

              <input
                type="hidden"
                {...register('passwordCheakRole', {
                  required: '질문을 선택해주세요.',
                })}
              />

              <CustomSelectWrapper ref={selectRef}>
                <CustomSelectButton
                  type="button"
                  onClick={() => setIsOpen((prev) => !prev)}
                >
                  {watch('passwordCheakRole')
                    ? PASSWORD_QUESTION_LABEL[watch('passwordCheakRole')]
                    : '질문을 선택하세요'}
                </CustomSelectButton>

                {isOpen && (
                  <CustomSelectDropdown>
                    {passwordRoleList.map((role) => (
                      <CustomSelectItem
                        key={role}
                        onClick={() => {
                          setValue('passwordCheakRole', role, {
                            shouldValidate: true,
                            shouldDirty: true,
                          });
                          setIsOpen(false);
                        }}
                      >
                        {PASSWORD_QUESTION_LABEL[role]}
                      </CustomSelectItem>
                    ))}
                  </CustomSelectDropdown>
                )}
              </CustomSelectWrapper>

              <FormError errorMessage={errors.passwordCheakRole?.message} />
            </MakeAnswerWrapper>

            <Input
              {...register('passwordCheakFindWord', {
                required: '답변을 입력해주세요.',
              })}
              placeholder="질문답변"
            />
            <FormError errorMessage={errors.passwordCheakFindWord?.message} />

            <OptionalSection>
              <OptionalTitle>추가 정보 (선택)</OptionalTitle>

              <Input
                {...register('userName')}
                placeholder="이름"
              />

              <Input
                {...register('parish')}
                placeholder="소속 교구"
              />

              <Input
                {...register('religious')}
                placeholder="종교"
              />

              <Input
                {...register('address')}
                placeholder="주소"
              />
            </OptionalSection>

            <ConsentSection>
              <ConsentTitle>약관 동의 (필수)</ConsentTitle>

              <ConsentItem>
                <input
                  type="checkbox"
                  {...register('termsOfService', {
                    required: '이용약관에 동의해주세요.',
                  })}
                />
                <span>[필수] 이용약관 동의</span>
              </ConsentItem>
              <FormError errorMessage={errors.termsOfService?.message} />

              <ConsentItem>
                <input
                  type="checkbox"
                  {...register('consentToCollectPersonalData', {
                    required: '개인정보 수집 및 이용에 동의해주세요.',
                  })}
                />
                <span>[필수] 개인정보 수집 및 이용 동의</span>
              </ConsentItem>
              <FormError errorMessage={errors.consentToCollectPersonalData?.message} />

              <ConsentItem>
                <input
                  type="checkbox"
                  {...register('outsourcingTheProcessingOfPersonalData', {
                    required: '개인정보 처리 위탁에 동의해주세요.',
                  })}
                />
                <span>[필수] 개인정보 처리 위탁 동의</span>
              </ConsentItem>
              <FormError errorMessage={errors.outsourcingTheProcessingOfPersonalData?.message} />
            </ConsentSection>

            <SubmitButton
              type="submit"
              disabled={loading}
            >
              {loading ? '생성 중...' : '계정 생성'}
            </SubmitButton>

            {data?.createAccount.error && (
              <ApiError>
                <FormError errorMessage={data.createAccount.error} />
              </ApiError>
            )}

            <BottomText>
              이미 계정이 있으신가요?
              <StyledLink to="/admin/login">로그인</StyledLink>
            </BottomText>
          </form>
        </Card>
      </Wrapper>
    </HelmetProvider>
  );
};

const Wrapper = styled.div`
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #eef2f3, #d9e4ec);
`;

const Card = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 40px;
  background: white;
  border-radius: 14px;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h1`
  text-align: center;
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 30px;
  color: #1f2937;
`;

const Input = styled.input`
  width: 100%;
  height: 46px;
  padding: 0 14px;
  margin-top: 14px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

const RoleWrapper = styled.div`
  margin-bottom: 18px;
`;

const RoleLabel = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 4px;
`;

const RoleDescription = styled.p`
  font-size: 12px;
  color: #9ca3af;
  margin-bottom: 10px;
`;

const RoleButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

const RoleButton = styled.button<{ active: boolean }>`
  flex: 1;
  height: 42px;
  border-radius: 10px;
  border: 1px solid ${({ active }) => (active ? '#6366f1' : '#d1d5db')};
  background: ${({ active }) => (active ? '#eef2ff' : '#ffffff')};
  color: ${({ active }) => (active ? '#4338ca' : '#374151')};
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;

  &:hover {
    border-color: #6366f1;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  height: 46px;
  margin-top: 24px;
  border: none;
  border-radius: 8px;
  background: #4f46e5;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover:not(:disabled) {
    background: #4338ca;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
`;

const ApiError = styled.div`
  margin-top: 12px;
  text-align: center;
`;

const BottomText = styled.div`
  margin-top: 26px;
  text-align: center;
  font-size: 14px;
  color: #6b7280;
`;

const StyledLink = styled(Link)`
  margin-left: 6px;
  color: #4f46e5;
  font-weight: 600;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const MakeAnswerWrapper = styled.div`
  margin-top: 22px;
`;

const QuestionLabel = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: #374151; /* 진한 회색 */
  margin-bottom: 4px;
`;

const QuestionDescription = styled.p`
  font-size: 12px;
  color: #9ca3af; /* 연한 회색 */
  margin-bottom: 10px;
  line-height: 1.4;
`;

const CustomSelectWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const CustomSelectButton = styled.button`
  width: 100%;
  height: 46px;
  padding: 0 12px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  background: white;
  text-align: left;
  cursor: pointer;
`;

const CustomSelectDropdown = styled.div`
  position: absolute;
  top: 50px;
  width: 100%;
  max-height: 230px;
  overflow-y: auto;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  background: white;
  z-index: 20;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);

  /* ✅ 스크롤은 가능하지만 바는 숨김 */
  -ms-overflow-style: none; /* IE, Edge */
  scrollbar-width: none; /* Firefox */

  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`;

const CustomSelectItem = styled.div`
  padding: 12px;
  cursor: pointer;
  font-size: 14px;

  &:hover {
    background: #eef2ff;
  }
`;

const OptionalSection = styled.div`
  margin-top: 28px;
  padding-top: 18px;
  border-top: 1px dashed #e5e7eb;
`;

const OptionalTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 10px;
`;

const ConsentSection = styled.div`
  margin-top: 30px;
  padding-top: 18px;
  border-top: 1px solid #e5e7eb;
`;

const ConsentTitle = styled.h3`
  font-size: 14px;
  font-weight: 700;
  color: #374151;
  margin-bottom: 12px;
`;

const ConsentItem = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #374151;
  margin-bottom: 8px;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
  }
`;
