import { gql } from '@apollo/client';

/**
 * Login mutation
 * Authenticates a user with phone and password
 */
export const LOGIN_MUTATION = gql`
  mutation LoginUser($input: LoginUserInput!) {
    loginUser(input: $input) {
      token
      user {
        id
        name
        phone_number
        email
        roles
      }
    }
  }
`;

/**
 * Logout mutation
 * Logs out the current user
 */
export const LOGOUT_MUTATION = gql`
  mutation LogoutUser {
    logoutUser {
      status
      message
    }
  }
`;

