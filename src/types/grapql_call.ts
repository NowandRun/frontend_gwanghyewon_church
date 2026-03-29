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

/* ==== MAIN POPUO BOARD ======= */
export const CREATE_MAIN_POPUP_BOARD_MUTATION = gql`
  mutation createMainPopupBoard($input: CreateMainPopupBoardDto!) {
    createMainPopupBoard(input: $input) {
      ok
      error
    }
  }
`;

// 전체 조회 Query
export const FIND_ALL_MAIN_POPUP_BOARD_QUERY = gql`
  query findAllMainPopupBoard($input: FindAllMainPopupBoardPaginationInput!) {
    findAllMainPopupBoard(input: $input) {
      ok
      error
      totalResults
      totalPages
      results {
        id
        title
        author
        blocks # ✅ JSON 타입이므로 내부 필드를 쓰지 않습니다.
        createdAt
      }
    }
  }
`;

// 상세 조회 Query
export const FIND_MAIN_POPUP_BOARD_BY_ID_QUERY = gql`
  query findMainPopupBoardById($id: Float!) {
    findMainPopupBoardById(id: $id) {
      ok
      error
      result {
        id
        title
        author
        blocks # ✅ JSON 타입이므로 내부 필드를 쓰지 않습니다.
        createdAt
        user {
          id
        }
      }
    }
  }
`;

// 수정 Mutation
export const EDIT_MAIN_POPUP_BOARD = gql`
  mutation editMainPopupBoard($input: EditMainPopupBoardDto!) {
    editMainPopupBoard(input: $input) {
      ok
      error
    }
  }
`;

// 삭제 Mutation
export const DELETE_MAIN_POPUP_BOARD = gql`
  mutation deleteMainPopupBoard($input: DeleteMainPopupBoardInput!) {
    deleteMainPopupBoard(input: $input) {
      ok
      error
    }
  }
`;
