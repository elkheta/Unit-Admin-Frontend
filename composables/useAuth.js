import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { logout, getCurrentUser, isAuthenticated } from '../utils/auth.js';

export function useAuth() {
  const router = useRouter();
  const isLoading = ref(false);
  const error = ref('');

  // Reactive user state
  const user = ref(getCurrentUser());
  const authenticated = ref(isAuthenticated());

  // Computed properties
  const isLoggedIn = computed(() => authenticated.value);
  const currentUser = computed(() => user.value);

  /**
   * Handle user logout with GraphQL
   */
  const handleLogout = async () => {
    isLoading.value = true;
    error.value = '';

    try {
      const result = await logout();
      
      if (result.success) {
        // Update reactive state
        user.value = null;
        authenticated.value = false;
        
        // Redirect to sign in page
        router.push('/signin');
      } else {
        error.value = result.error || 'فشل في تسجيل الخروج';
      }
    } catch (err) {
      console.error('Logout error:', err);
      error.value = 'حدث خطأ أثناء تسجيل الخروج';
    } finally {
      isLoading.value = false;
    }
  };

  /**
   * Update user state after successful login
   */
  const setUser = (userData) => {
    user.value = userData;
    authenticated.value = true;
  };

  /**
   * Clear user state
   */
  const clearUser = () => {
    user.value = null;
    authenticated.value = false;
  };

  /**
   * Refresh user state from localStorage
   */
  const refreshAuth = () => {
    user.value = getCurrentUser();
    authenticated.value = isAuthenticated();
  };

  return {
    // State
    user: currentUser,
    isLoggedIn,
    isLoading,
    error,
    
    // Methods
    handleLogout,
    setUser,
    clearUser,
    refreshAuth
  };
}

