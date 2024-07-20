import { gql, useQuery } from '@apollo/client';
import { MeQuery } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { isLoggedInAcessTokenVar, isLoggedInRefresTokenVar } from '../apollo';
import {
  LOCALSTORAGE_ACCESSTOKEN,
  LOCALSTORAGE_REFRESHTOKEN,
} from '../constants';

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
  const navicate = useNavigate();
  const data = useQuery<MeQuery>(ME_QUERY, {
    onError: (error) => {
      console.log(error.message);
      if (error.message === 'Forbidden resource') {
        window.location.reload();
      }
      if (
        error.message === 'Response not successful: Received status code 500' ||
        error.message ===
          "Cannot read properties of undefined (reading 'user')" ||
        error.message === 'User not authorized'
      ) {
        localStorage.removeItem(LOCALSTORAGE_ACCESSTOKEN);
        localStorage.removeItem(LOCALSTORAGE_REFRESHTOKEN);
        isLoggedInAcessTokenVar(false);
        isLoggedInRefresTokenVar(false);
        alert('Session이 만료되었습니다.');
        navicate('/login');
      }
    },
  });

  return data;
};
