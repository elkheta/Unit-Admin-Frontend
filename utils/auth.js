/**
 * Fake authentication utility
 * Hardcoded credentials for development
 */

const VALID_PHONE = '0111111111';
const VALID_PASSWORD = '11111111';

/**
 * Attempts to login with phone and password
 * @param {string} phone - Phone number
 * @param {string} password - Password
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export function login(phone, password) {
  return new Promise((resolve) => {
    // Simulate API delay
    setTimeout(() => {
      if (phone !== VALID_PHONE) {
        resolve({
          success: false,
          error: 'رقم الهاتف غير صحيح'
        });
        return;
      }

      if (password !== VALID_PASSWORD) {
        resolve({
          success: false,
          error: 'كلمة السر غير صحيحة'
        });
        return;
      }

      resolve({
        success: true
      });
    }, 500);
  });
}

