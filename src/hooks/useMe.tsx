import { gql, useQuery } from '@apollo/client';
import { MeQuery } from '../gql/graphql';

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
  return useQuery<MeQuery>(ME_QUERY);
};
