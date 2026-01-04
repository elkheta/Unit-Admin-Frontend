import apolloClient from '../src/apollo.js';
import { LOGIN_MUTATION, LOGOUT_MUTATION } from '../graphql/mutations/login.js';
import { authStorage } from './authStorage.js';
import { handleApolloException, handleResponse } from './graphqlResponseHandler.js';

/**
 * GraphQL authentication utility
 */

/**
 * Attempts to login with phone and password using GraphQL
 * @param {string} phone - Phone number
 * @param {string} password - Password
 * @returns {Promise<{success: boolean, user?: object, error?: string}>}
 */
export async function login(phone, password) {
  try {
    const response = await apolloClient.mutate({
      mutation: LOGIN_MUTATION,
      errorPolicy: 'all',
      fetchPolicy: 'no-cache',
      variables: {
        input: {
          phone_number: phone,
          password: password
        }
      }
    });

    const handled = handleResponse(response, 'loginUser');

    if (handled.success && handled.data?.token) {
      // Store token and user data (simple encoding inside authStorage)
      authStorage.setToken(handled.data.token);
      authStorage.setUser(handled.data.user);

      return {
        success: true,
        user: handled.data.user,
        token: handled.data.token
      };
    }

    return {
      success: false,
      error: handled.message || 'فشل في تسجيل الدخول',
      messageCode: handled.messageCode,
      validationErrors: handled.validationErrors,
      validationMessages: handled.validationMessages,
      displayValidationMessages: handled.displayValidationMessages
    };
  } catch (error) {
    const handled = handleApolloException(error);
    return {
      success: false,
      error: handled.message || 'حدث خطأ أثناء تسجيل الدخول',
      messageCode: handled.messageCode,
      validationErrors: handled.validationErrors,
      validationMessages: handled.validationMessages,
      displayValidationMessages: handled.displayValidationMessages
    };
  }
}

/**
 * Attempts to logout using GraphQL
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function logout() {
  try {
    const response = await apolloClient.mutate({
      mutation: LOGOUT_MUTATION,
      errorPolicy: 'all',
      fetchPolicy: 'no-cache'
    });

    // Clear storage regardless of server response
    authStorage.clear();

    const handled = handleResponse(response, 'logoutUser');
    return {
      success: true,
      message: handled.success ? (handled.data?.message || 'تم تسجيل الخروج بنجاح') : 'تم تسجيل الخروج بنجاح'
    };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Clear storage even if logout fails on server
    authStorage.clear();

    const handled = handleApolloException(error);
    return {
      success: false,
      error: handled.message || 'حدث خطأ أثناء تسجيل الخروج',
      messageCode: handled.messageCode
    };
  }
}

/**
 * Get current user data from localStorage
 * @returns {object|null} User data or null if not authenticated
 */
export function getCurrentUser() {
  return authStorage.getUser();
}

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated
 */
export function isAuthenticated() {
  return !!authStorage.getToken();
}

