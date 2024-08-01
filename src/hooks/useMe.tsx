import { gql, useQuery } from '@apollo/client';
import { MeQuery } from '../gql/graphql';
import { isLoggedInAcessTokenVar } from '../apollo';
import { LOCALSTORAGE_ACCESSTOKEN } from '../constants';

export const ME_QUERY = gql`
  query me {
    me {
      id
      userName
      role
    }
  }
`;

export const useMe = () => {
  const data = useQuery<MeQuery>(ME_QUERY, {
    onError: (error) => {
      console.log(error.message);
      if (
        error.message === 'Forbidden resource' ||
        error.message === 'Response not successful: Received status code 500'
      ) {
        window.location.replace(
          `${'http' ? 'http' : 'https'}://localhost:3000/`
        );
      }
      if (error.message === 'User not authorized') {
        alert('Session이 만료되었습니다.');
        window.location.replace(
          `${'http' ? 'http' : 'https'}://localhost:3000/login`
        );
        localStorage.removeItem(LOCALSTORAGE_ACCESSTOKEN);
        isLoggedInAcessTokenVar(false);
      }
    },
  });
  return data;
};
