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
  address?: InputMaybe<Scalars['String']['input']>;
  consentToCollectPersonalData: Scalars['Boolean']['input'];
  numberOfLoginAttempts?: InputMaybe<Scalars['Int']['input']>;
  outsourcingTheProcessingOfPersonalData: Scalars['Boolean']['input'];
  parish?: InputMaybe<Scalars['String']['input']>;
  password: Scalars['String']['input'];
  passwordCheakFindWord: Scalars['String']['input'];
  passwordCheakRole: PasswordCheakRole;
  religious?: InputMaybe<Scalars['String']['input']>;
  role: UserRole;
  termsOfService: Scalars['Boolean']['input'];
  userId: Scalars['String']['input'];
  userName?: InputMaybe<Scalars['String']['input']>;
  verifyPassword: Scalars['String']['input'];
};

export type CreateAccountOutput = {
  __typename?: 'CreateAccountOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type FindUserIdInput = {
  userName?: InputMaybe<Scalars['String']['input']>;
};

export type FindUserIdOutput = {
  __typename?: 'FindUserIdOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  userId?: Maybe<Scalars['String']['output']>;
};

export type LoginInput = {
  password: Scalars['String']['input'];
  userId: Scalars['String']['input'];
};

export type LoginOutput = {
  __typename?: 'LoginOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
  token?: Maybe<Scalars['String']['output']>;
};

export type LogoutOutput = {
  __typename?: 'LogoutOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createAccount: CreateAccountOutput;
  createAdminAccount: CreateAccountOutput;
  login: LoginOutput;
  logout: LogoutOutput;
  updateByUserPassword: UpdateUserPasswordOutput;
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateAdminAccountArgs = {
  input: CreateAccountInput;
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationUpdateByUserPasswordArgs = {
  input: UpdateUserPasswordInput;
};

export enum PasswordCheakRole {
  A = 'A',
  B = 'B',
  C = 'C',
  D = 'D',
  E = 'E',
  F = 'F',
  G = 'G',
  H = 'H',
  I = 'I',
  J = 'J',
  K = 'K',
  L = 'L',
  M = 'M'
}

export type Query = {
  __typename?: 'Query';
  findByUserId: FindUserIdOutput;
  me: User;
  userProfile: UserProfileOutput;
};


export type QueryFindByUserIdArgs = {
  input: FindUserIdInput;
};


export type QueryUserProfileArgs = {
  userId: Scalars['Float']['input'];
};

export type Subscription = {
  __typename?: 'Subscription';
  sendingDeleteAccountMessage: User;
};

export type UpdateUserPasswordInput = {
  password: Scalars['String']['input'];
  selectFindUserQuestion: PasswordCheakRole;
  userId: Scalars['String']['input'];
  verifyQuestionAnswer: Scalars['String']['input'];
  verifyUpdatePassword: Scalars['String']['input'];
};

export type UpdateUserPasswordOutput = {
  __typename?: 'UpdateUserPasswordOutput';
  error?: Maybe<Scalars['String']['output']>;
  ok: Scalars['Boolean']['output'];
};

export type User = {
  __typename?: 'User';
  accessHistory: Scalars['DateTime']['output'];
  address?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Float']['output'];
  numberOfLoginAttempts?: Maybe<Scalars['Int']['output']>;
  parish?: Maybe<Scalars['String']['output']>;
  password: Scalars['String']['output'];
  passwordCheakFindWord: Scalars['String']['output'];
  passwordCheakRole: PasswordCheakRole;
  religious?: Maybe<Scalars['String']['output']>;
  role: UserRole;
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
  Admin = 'Admin',
  Client = 'Client'
}

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: number, userId: string, role: UserRole } };

export type CreateAccountMutationVariables = Exact<{
  input: CreateAccountInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'CreateAccountOutput', ok: boolean, error?: string | null } };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'LoginOutput', ok: boolean, token?: string | null, error?: string | null } };


export const MeDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"userId"}},{"kind":"Field","name":{"kind":"Name","value":"role"}}]}}]}}]} as unknown as DocumentNode<MeQuery, MeQueryVariables>;
export const CreateAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"createAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateAccountInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createAccount"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<CreateAccountMutation, CreateAccountMutationVariables>;
export const LoginDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"login"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"LoginInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"login"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"loginInput"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"ok"}},{"kind":"Field","name":{"kind":"Name","value":"token"}},{"kind":"Field","name":{"kind":"Name","value":"error"}}]}}]}}]} as unknown as DocumentNode<LoginMutation, LoginMutationVariables>;