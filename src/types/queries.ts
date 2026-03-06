import { gql } from '@apollo/client';

export const GET_CHURCH_BOARDS = gql`
  query findAllCharchInformationBoards($input: FindAllCharchInformationBoardsPaginationInput!) {
    findAllCharchInformationBoards(input: $input) {
      ok
      error
      totalResults
      totalPages
      results {
        id
        title
        author
        thumbnailUrl
        createdAt
      }
    }
  }
`;
