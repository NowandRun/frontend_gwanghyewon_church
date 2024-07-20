/* eslint-disable */
import * as types from './graphql';
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  mutation logout($input: LogoutInput!) {\n    logout(input: $input) {\n      error\n      ok\n    }\n  }\n": types.LogoutDocument,
    "\n  mutation createNotice($input: CreateNoticeInput!) {\n    createNotice(input: $input) {\n      error\n      ok\n      noticeId\n    }\n  }\n": types.CreateNoticeDocument,
    "\n  query me {\n    me {\n      id\n      userName\n      role\n    }\n  }\n": types.MeDocument,
    "\n  mutation createAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n": types.CreateAccountDocument,
    "\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      accessToken\n      refreshToken\n      error\n    }\n  }\n": types.LoginDocument,
    "\n  query notices($input: NoticesInput!) {\n    notices(input: $input) {\n      error\n      ok\n      totalPages\n      totalResults\n      results {\n        id\n        createdAt\n        userId\n        userName\n        title\n        description\n      }\n    }\n  }\n": types.NoticesDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation logout($input: LogoutInput!) {\n    logout(input: $input) {\n      error\n      ok\n    }\n  }\n"): (typeof documents)["\n  mutation logout($input: LogoutInput!) {\n    logout(input: $input) {\n      error\n      ok\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createNotice($input: CreateNoticeInput!) {\n    createNotice(input: $input) {\n      error\n      ok\n      noticeId\n    }\n  }\n"): (typeof documents)["\n  mutation createNotice($input: CreateNoticeInput!) {\n    createNotice(input: $input) {\n      error\n      ok\n      noticeId\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query me {\n    me {\n      id\n      userName\n      role\n    }\n  }\n"): (typeof documents)["\n  query me {\n    me {\n      id\n      userName\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation createAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation createAccount($createAccountInput: CreateAccountInput!) {\n    createAccount(input: $createAccountInput) {\n      ok\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      accessToken\n      refreshToken\n      error\n    }\n  }\n"): (typeof documents)["\n  mutation login($loginInput: LoginInput!) {\n    login(input: $loginInput) {\n      ok\n      accessToken\n      refreshToken\n      error\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query notices($input: NoticesInput!) {\n    notices(input: $input) {\n      error\n      ok\n      totalPages\n      totalResults\n      results {\n        id\n        createdAt\n        userId\n        userName\n        title\n        description\n      }\n    }\n  }\n"): (typeof documents)["\n  query notices($input: NoticesInput!) {\n    notices(input: $input) {\n      error\n      ok\n      totalPages\n      totalResults\n      results {\n        id\n        createdAt\n        userId\n        userName\n        title\n        description\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;