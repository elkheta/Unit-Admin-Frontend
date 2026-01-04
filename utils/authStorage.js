/**
 * Very small auth storage helper.
 * "Encryption" here is intentionally simple (base64) to avoid complexity.
 * If you later want real encryption or cookies, you only change this file.
 */

const TOKEN_KEY = 'authToken';
const USER_KEY = 'userData';

function encode(value) {
  try {
    // btoa expects latin1; encodeURIComponent handles unicode safely.
    return btoa(encodeURIComponent(value));
  } catch {
    return value;
  }
}

function decode(value) {
  try {
    return decodeURIComponent(atob(value));
  } catch {
    return value;
  }
}

export const authStorage = {
  setToken(token) {
    if (!token) return;
    localStorage.setItem(TOKEN_KEY, encode(String(token)));
  },

  getToken() {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const token = decode(raw);
    return token || null;
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  setUser(user) {
    if (!user) return;
    try {
      localStorage.setItem(USER_KEY, encode(JSON.stringify(user)));
    } catch {
      // ignore
    }
  },

  getUser() {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(decode(raw));
    } catch {
      return null;
    }
  },

  removeUser() {
    localStorage.removeItem(USER_KEY);
  },

  clear() {
    this.removeToken();
    this.removeUser();
  }
};


