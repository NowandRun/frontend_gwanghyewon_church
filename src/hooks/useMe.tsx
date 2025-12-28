import { gql, useQuery } from '@apollo/client';
import { MeQuery } from '../gql/graphql';

const ME_QUERY = gql`
  query me {
    me {
      id
      userId
      role
    }
  }
`;

export const useMe = () => {
  return useQuery<MeQuery>(ME_QUERY);
};
