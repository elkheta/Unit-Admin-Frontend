import { authStorage } from './authStorage.js';
import { loginUser, logoutUser } from '../graphql/mutations/auth/handlingCalls.js';



/**
 * Use inside Vue `setup()` (or inside other composables).
 * Provides `login()` and `logout()` implemented with `useMutation(...)`.
 */
export async function login(phone, password) {
  return loginUser(phone, password);
}

export async function logout() {
  return logoutUser();
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

