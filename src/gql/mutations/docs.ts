import { gql } from '@apollo/client';

export const FIND_ALL_CHARCH_INFORMATION_BOARD = gql`
  query findAll {
    findAllCharchInformationBoards {
      id
      title
      author
      blocks {
        type
        content
        url
      }
      thumbnailUrl
      createdAt
    }
  }
`;

export const FIND_ONE_BOARD = gql`
  query findOne($id: Int!) {
    findOne(id: $id) {
      id
      title
      author
      content
      thumbnailUrl
      createdAt
    }
  }
`;

export const CREATE_CHARCH_INFORMATION_BOARD = gql`
  mutation create($input: CreateCharchInformationBoardDto!) {
    create(input: $input) {
      id
      title
      author
      blocks {
        type
        content
        url
      }
      thumbnailUrl
      createdAt
    }
  }
`;
