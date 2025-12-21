<template>
  <SignIn @sign-in="handleSignIn" />
</template>

<script setup>
import { useRouter } from 'vue-router';
import { SignIn } from '../../components/layout';

const router = useRouter();

const handleSignIn = () => {
  localStorage.setItem('isAuthenticated', 'true');
  router.push('/dashboard/main');
};
</script>

