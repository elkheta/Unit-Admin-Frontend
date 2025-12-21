import { gql } from '@apollo/client';

/**
 * Login mutation
 * Authenticates a user with phone and password
 */
export const LOGIN_MUTATION = gql`
  mutation Login($phone: String!, $password: String!) {
    login(phone: $phone, password: $password) {
      success
      token
      user {
        id
        name
        phone
      }
      error
    }
  }
`;

