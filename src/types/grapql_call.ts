import { gql } from '@apollo/client';
/* ==== BOARD CHURCH INFORMATION ======= */
export const CREATE_CHURCH_INFORMATION_BOARD_MUTATION = gql`
  mutation createChurchInformationBoard($input: CreateChurchInformationBoardDto!) {
    createChurchInformationBoard(input: $input) {
      ok
      error
    }
  }
`;

export const FIND_ALL_CHURCH_INFORMATION_BOARD_QUERY = gql`
  query findAllChurchInformationBoard($input: FindAllChurchInformationBoardPaginationInput!) {
    findAllChurchInformationBoard(input: $input) {
      ok
      error
      results {
        id
        isPinned
        title
        author
        fileUrls
        createdAt
      }
      totalResults
      totalPages
    }
  }
`;

// 나머지는 수정할 필요가 없으나, 일관성을 위해 전체 코드를 유지합니다.
export const FIND_CHURCH_INFORMATION_BOARD_BY_ID_QUERY = gql`
  query findChurchInformationBoardById($id: Float!) {
    findChurchInformationBoardById(id: $id) {
      ok
      error
      result {
        id
        isPinned
        title
        author
        blocks
        fileUrls
        user {
          id
        }
      }
    }
  }
`;

export const EDIT_CHURCH_INFORMATION_BOARD_MUTATION = gql`
  mutation editChurchInformationBoard($input: EditChurchInformationBoardDto!) {
    editChurchInformationBoard(input: $input) {
      ok
      error
    }
  }
`;

export const DELETE_CHURCH_INFORMATION_BOARD_MUTATION = gql`
  mutation deleteChurchInformationBoard($input: DeleteChurchInformationBoardInput!) {
    deleteChurchInformationBoard(input: $input) {
      ok
      error
    }
  }
`;

/* ==== BOARD CHURCH ALBUM ======= */
export const CREATE_CHURCH_ALBUM_BOARD_MUTATION = gql`
  mutation createChurchAlbumBoard($input: CreateChurchAlbumBoardDto!) {
    createChurchAlbumBoard(input: $input) {
      ok
      error
    }
  }
`;

export const FIND_ALL_CHURCH_ALBUM_BOARD_QUERY = gql`
  query findAllChurchAlbumBoard($input: FindAllChurchAlbumBoardPaginationInput!) {
    findAllChurchAlbumBoard(input: $input) {
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

export const FIND_CHURCH_ALBUM_BOARD_BY_ID_QUERY = gql`
  query findChurchAlbumBoardById($id: Float!) {
    findChurchAlbumBoardById(id: $id) {
      ok
      error
      result {
        id
        title
        author
        thumbnailUrl
        blocks
        user {
          id
        }
      }
    }
  }
`;

export const EDIT_CHURCH_ALBUM_BOARD = gql`
  mutation editChurchAlbumBoard($input: EditChurchAlbumBoardDto!) {
    editChurchAlbumBoard(input: $input) {
      ok
      error
    }
  }
`;

export const DELETE_CHURCH_ALBUM_BOARD = gql`
  mutation deleteChurchAlbumBoard($input: DeleteChurchAlbumBoardInput!) {
    deleteChurchAlbumBoard(input: $input) {
      ok
      error
    }
  }
`;

/* ==== BOARD CHURCH BULLETIN ======= */
export const CREATE_CHURCH_BULLETIN_BOARD_MUTATION = gql`
  mutation createChurchBulletinBoard($input: CreateChurchBulletinBoardDto!) {
    createChurchBulletinBoard(input: $input) {
      ok
      error
    }
  }
`;

export const FIND_ALL_CHURCH_BULLETIN_BOARD_QUERY = gql`
  query findAllChurchBulletinBoard($input: FindAllChurchBulletinPaginationInput!) {
    findAllChurchBulletinBoard(input: $input) {
      ok
      error
      totalResults
      totalPages
      results {
        id
        title
        author
        thumbnailUrl
        fileUrls
        createdAt
      }
    }
  }
`;

export const FIND_CHURCH_BULLETIN_BOARD_BY_ID_QUERY = gql`
  query findChurchBulletinBoardById($id: Float!) {
    findChurchBulletinBoardById(id: $id) {
      ok
      error
      result {
        id
        title
        author
        thumbnailUrl
        fileUrls
        blocks
        user {
          id
        }
      }
    }
  }
`;

export const EDIT_CHURCH_BULLETIN_BOARD = gql`
  mutation editChurchBulletinBoard($input: EditChurchBulletinBoardDto!) {
    editChurchBulletinBoard(input: $input) {
      ok
      error
    }
  }
`;

export const DELETE_CHURCH_BULLETIN_BOARD = gql`
  mutation deleteChurchBulletinBoard($input: DeleteChurchBulletinBoardInput!) {
    deleteChurchBulletinBoard(input: $input) {
      ok
      error
    }
  }
`;
