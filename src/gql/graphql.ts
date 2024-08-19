/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: any; output: any; }
};

export type CreateAccountInput = {
  password: Scalars['String']['input'];
  role: UserRole;
  service?: InputMaybe<Scalars['String']['input']>;
  userId: Scalars['String']['input'];
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAccountOutput = {
  __typename?: 'CreateAccountOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type CreateNoticeInput = {
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateNoticeOutput = {
  __typename?: 'CreateNoticeOutput';
  error?: Maybe<Scalars['String']['output']>;
  noticeId: Scalars['Int']['output'];
  ok: Scalars['Boolean']['output'];
};

export type CreateQnaCommentInput = {
  comment: Scalars['String']['input'];
  qnaId: Scalars['Int']['input'];
};

export type CreateQnaCommentOutput = {
  __typename?: 'CreateQnaCommentOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  results?: Maybe<Array<QnaComment>>;
};

export type CreateQnaInput = {
  description: Scalars['String']['input'];
  title: Scalars['String']['input'];
};

export type CreateQnaOutput = {
  __typename?: 'CreateQnaOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  qnaId: Scalars['Int']['output'];
};

export type LoginInput = {
  password: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  accessToken?: Maybe<Scalars['String']['output']>;
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type LogoutInput = {
  id: Scalars['Float']['input'];
};

export type LogoutOutput = {
  __typename?: 'LogoutOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: CreateAccountOutput;
  createNotice: CreateNoticeOutput;
  createQna: CreateQnaOutput;
  createQnaComment: CreateQnaCommentOutput;
  login: LoginOutput;
  logout: LogoutOutput;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateNoticeArgs = {
  input: CreateNoticeInput;
};


export type MutationCreateQnaArgs = {
  input: CreateQnaInput;
};


export type MutationCreateQnaCommentArgs = {
  input: CreateQnaCommentInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationLogoutArgs = {
  input: LogoutInput;
};

export type Notice = {
  __typename?: 'Notice';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['Int']['output'];
  userName: Scalars['String']['output'];
  views: Scalars['Int']['output'];
};

export type NoticeInput = {
  noticeId: Scalars['Int']['input'];
};

export type NoticeOutput = {
  __typename?: 'NoticeOutput';
  error?: Maybe<Scalars['String']['output']>;
  notice?: Maybe<Notice>;
  ok: Scalars['Boolean']['output'];
};

export type NoticesInput = {
  page?: Scalars['Int']['input'];
};

export type NoticesOutput = {
  __typename?: 'NoticesOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  results?: Maybe<Array<Notice>>;
  totalPages?: Maybe<Scalars['Int']['output']>;
  totalResults?: Maybe<Scalars['Int']['output']>;
};

export type Qna = {
  __typename?: 'Qna';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  qnaComment?: Maybe<Array<QnaComment>>;
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['Int']['output'];
  userName: Scalars['String']['output'];
  views: Scalars['Int']['output'];
};

export type QnaComment = {
  __typename?: 'QnaComment';
  comment: Scalars['String']['output'];
  commentOwner: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  qna: Qna;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
};

export type QnaInput = {
  qnaId: Scalars['Int']['input'];
};

export type QnaNotice = {
  __typename?: 'QnaNotice';
  createdAt: Scalars['DateTime']['output'];
  description: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  title: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['Int']['output'];
  userName: Scalars['String']['output'];
  views: Scalars['Int']['output'];
};

export type QnaNoticeInput = {
  qnaNoticeId: Scalars['Int']['input'];
};

export type QnaNoticeOutput = {
  __typename?: 'QnaNoticeOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  qnaNotice?: Maybe<QnaNotice>;
};

export type QnaOutput = {
  __typename?: 'QnaOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  qna?: Maybe<Qna>;
};

export type QnasInput = {
  page?: Scalars['Int']['input'];
};

export type QnasNoticeOutput = {
  __typename?: 'QnasNoticeOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  results?: Maybe<Array<QnaNotice>>;
};

export type QnasOutput = {
  __typename?: 'QnasOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  results?: Maybe<Array<Qna>>;
  totalPages?: Maybe<Scalars['Int']['output']>;
  totalResults?: Maybe<Scalars['Int']['output']>;
};

export type Query = {
  __typename?: 'Query';
  me: User;
  notice: NoticeOutput;
  notices: NoticesOutput;
  qna: QnaOutput;
  qnaNotice: QnaNoticeOutput;
  qnaNotices: QnasNoticeOutput;
  qnas: QnasOutput;
  userProfile: UserProfileOutput;
};


export type QueryNoticeArgs = {
  input: NoticeInput;
};


export type QueryNoticesArgs = {
  input: NoticesInput;
};


export type QueryQnaArgs = {
  input: QnaInput;
};


export type QueryQnaNoticeArgs = {
  input: QnaNoticeInput;
};


export type QueryQnasArgs = {
  input: QnasInput;
};


export type QueryUserProfileArgs = {
  userId: Scalars['Float']['input'];
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  currentRefreshToken: Scalars['String']['output'];
  id: Scalars['Float']['output'];
  password: Scalars['String']['output'];
  role: UserRole;
  service?: Maybe<Scalars['String']['output']>;
  updatedAt: Scalars['DateTime']['output'];
  userId: Scalars['String']['output'];
  userName?: Maybe<Scalars['String']['output']>;
};

export type UserProfileOutput = {
  __typename?: 'UserProfileOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  user?: Maybe<User>;
};

export enum UserRole {
  Client = 'Client',
  Manager = 'Manager'
}

export type CreateNoticeMutationVariables = Exact<{
  input: CreateNoticeInput;
}>;


export type CreateNoticeMutation = { __typename?: 'Mutation', createNotice: { __typename?: 'CreateNoticeOutput', error?: string | null, ok: boolean, noticeId: number } };

export type CreateQnaMutationVariables = Exact<{
  input: CreateQnaInput;
}>;


export type CreateQnaMutation = { __typename?: 'Mutation', createQna: { __typename?: 'CreateQnaOutput', error?: string | null, ok: boolean, qnaId: number } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, userName?: string | null, role: UserRole } };

export type NoticesQueryVariables = Exact<{
  input: NoticesInput;
}>;


export type NoticesQuery = { __typename?: 'Query', notices: { __typename?: 'NoticesOutput', error?: string | null, ok: boolean, totalPages?: number | null, totalResults?: number | null, results?: Array<{ __typename?: 'Notice', id: number, createdAt: any, userId: number, userName: string, title: string, description: string, views: number }> | null } };

export type QnaNoticeQueryVariables = Exact<{
  input: QnaNoticeInput;
}>;


export type QnaNoticeQuery = { __typename?: 'Query', qnaNotice: { __typename?: 'QnaNoticeOutput', error?: string | null, ok: boolean, qnaNotice?: { __typename?: 'QnaNotice', id: number, createdAt: any, userName: string, title: string, description: string, views: number } | null } };

export type QnaQueryVariables = Exact<{
  input: QnaInput;
}>;


export type QnaQuery = { __typename?: 'Query', qna: { __typename?: 'QnaOutput', error?: string | null, ok: boolean, qna?: { __typename?: 'Qna', id: number, createdAt: any, userName: string, title: string, description: string, views: number, qnaComment?: Array<{ __typename?: 'QnaComment', id: number, createdAt: any, commentOwner: string, userId: string, comment: string }> | null } | null } };

export type CreateQnaCommentMutationVariables = Exact<{
  input: CreateQnaCommentInput;
}>;


export type CreateQnaCommentMutation = { __typename?: 'Mutation', createQnaComment: { __typename?: 'CreateQnaCommentOutput', error?: string | null, ok: boolean, results?: Array<{ __typename?: 'QnaComment', id: number, createdAt: any, commentOwner: string, userId: string, comment: string }> | null } };

export type QnaNoticesQueryVariables = Exact<{ [key: string]: never; }>;


export type QnaNoticesQuery = { __typename?: 'Query', qnaNotices: { __typename?: 'QnasNoticeOutput', error?: string | null, ok: boolean, results?: Array<{ __typename?: 'QnaNotice', id: number, createdAt: any, userId: number, userName: string, title: string, description: string, views: number }> | null } };

export type QnasQueryVariables = Exact<{
  input: QnasInput;
}>;


export type QnasQuery = { __typename?: 'Query', qnas: { __typename?: 'QnasOutput', error?: string | null, ok: boolean, totalPages?: number | null, totalResults?: number | null, results?: Array<{ __typename?: 'Qna', id: number, createdAt: any, userId: number, userName: string, title: string, description: string, views: number, qnaComment?: Array<{ __typename?: 'QnaComment', id: number, createdAt: any, commentOwner: string, userId: string, comment: string }> | null }> | null } };

export type CreateAccountMutationVariables = Exact<{
  createAccountInput: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'CreateAccountOutput', ok: boolean, error?: string | null } };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', ok: boolean, accessToken?: string | null, error?: string | null } };

export type NoticeQueryVariables = Exact<{
  input: NoticeInput;
}>;


export type NoticeQuery = { __typename?: 'Query', notice: { __typename?: 'NoticeOutput', error?: string | null, ok: boolean, notice?: { __typename?: 'Notice', id: number, createdAt: any, userName: string, title: string, description: string, views: number } | null } };


export const CreateNoticeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createNotice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateNoticeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createNotice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"noticeId"}}]}}]}}]} as unknown as DocumentNode<CreateNoticeMutation, CreateNoticeMutationVariables>;
export const CreateQnaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createQna"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateQnaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQna"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"qnaId"}}]}}]}}]} as unknown as DocumentNode<CreateQnaMutation, CreateQnaMutationVariables>;
export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const NoticesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notices"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NoticesInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notices"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalResults"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]}}]}}]} as unknown as DocumentNode<NoticesQuery, NoticesQueryVariables>;
export const QnaNoticeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"qnaNotice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QnaNoticeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qnaNotice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"qnaNotice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]}}]}}]} as unknown as DocumentNode<QnaNoticeQuery, QnaNoticeQueryVariables>;
export const QnaDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"qna"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QnaInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qna"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"qna"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"qnaComment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"commentOwner"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]}}]}}]}}]} as unknown as DocumentNode<QnaQuery, QnaQueryVariables>;
export const CreateQnaCommentDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createQnaComment"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateQnaCommentInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createQnaComment"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"commentOwner"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]}}]}}]} as unknown as DocumentNode<CreateQnaCommentMutation, CreateQnaCommentMutationVariables>;
export const QnaNoticesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"qnaNotices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qnaNotices"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]}}]}}]} as unknown as DocumentNode<QnaNoticesQuery, QnaNoticesQueryVariables>;
export const QnasDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"qnas"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"QnasInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"qnas"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"totalPages"}},{"kind":"Field","name":{"kind":"Name","value":"totalResults"}},{"kind":"Field","name":{"kind":"Name","value":"results"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"views"}},{"kind":"Field","name":{"kind":"Name","value":"qnaComment"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"commentOwner"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"comment"}}]}}]}}]}}]}}]} as unknown as DocumentNode<QnasQuery, QnasQueryVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"createAccountInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"createAccountInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"accessToken"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;
export const NoticeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"notice"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"NoticeInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"notice"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"error"}},{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"notice"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"createdAt"}},{"kind":"Field","name":{"kind":"Name","value":"userName"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"description"}},{"kind":"Field","name":{"kind":"Name","value":"views"}}]}}]}}]}}]} as unknown as DocumentNode<NoticeQuery, NoticeQueryVariables>;