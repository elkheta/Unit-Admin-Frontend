import { useMutation } from '@vue/apollo-composable';
import { LOGIN_MUTATION, LOGOUT_MUTATION } from '../login.js';
import { authStorage } from '../../../utils/authStorage.js';
import { handleApolloException, handleResponse } from '../../../utils/graphqlResponseHandler.js';

export const loginUser = async (phone, password) => {
  const { mutate } = useMutation(LOGIN_MUTATION, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache',
    variables: {
      input: {
        phone_number: phone,
        password
      }
    }
  });

  try {
    const response = await mutate();
    const handled = handleResponse(response, 'loginUser');

    if (handled.success && handled.data?.token) {
      authStorage.setToken(handled.data.token);
      authStorage.setUser(handled.data.user);
      return { success: true, user: handled.data.user, token: handled.data.token };
    }

    return {
      success: false,
      error: handled.message || 'فشل في تسجيل الدخول',
      displayValidationMessages: handled.displayValidationMessages
    };
  } catch (error) {
    const handled = handleApolloException(error);
    return {
      success: false,
      error: handled.message || 'حدث خطأ أثناء تسجيل الدخول',
      displayValidationMessages: handled.displayValidationMessages
    };
  }
};

export const logoutUser = async () => {
  const { mutate } = useMutation(LOGOUT_MUTATION, {
    errorPolicy: 'all',
    fetchPolicy: 'no-cache'
  });

  try {
    const response = await mutate();
    authStorage.clear();

    const handled = handleResponse(response, 'logoutUser');
    return {
      success: true,
      message: handled.success ? (handled.data?.message || 'تم تسجيل الخروج بنجاح') : 'تم تسجيل الخروج بنجاح'
    };
  } catch (error) {
    authStorage.clear();
    const handled = handleApolloException(error);
    return { success: false, error: handled.message || 'حدث خطأ أثناء تسجيل الخروج' };
  }
};


