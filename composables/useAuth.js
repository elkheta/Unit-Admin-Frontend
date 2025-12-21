import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push('/signin');
  };

  return {
    handleLogout
  };
}

