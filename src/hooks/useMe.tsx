import { gql, useQuery } from '@apollo/client';
import { MeQuery } from '../gql/graphql';
import { useNavigate } from 'react-router-dom';
import { isLoggedInAcessTokenVar, isLoggedInRefresTokenVar } from '../apollo';

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
  return useQuery<MeQuery>(ME_QUERY, {
    onError: (error) => {
      if (error.message === 'Forbidden resource') {
        window.location.reload();
      } else if (
        error.message === "Cannot read properties of undefined (reading 'user')"
      ) {
        isLoggedInAcessTokenVar(false);
        isLoggedInRefresTokenVar(false);
      }
    },
  });
};
