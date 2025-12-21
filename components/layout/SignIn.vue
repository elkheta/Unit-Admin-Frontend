<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" :style="{ animationDelay: '1s' }"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" :style="{ animationDelay: '2s' }"></div>
    </div>

    <!-- Grid pattern overlay -->
    <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.02)_1px,transparent_1px)] bg-[size:50px_50px]"></div>

    <!-- Sign In Card -->
    <div class="relative z-10 w-full max-w-md mx-4">
      <div class="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl shadow-lg mb-4 transform hover:scale-105 transition-transform">
            <GraduationCap class="w-10 h-10 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-white mb-2" style="font-family: 'Poppins', sans-serif">
            EduDash
          </h1>
          <p class="text-gray-300 text-sm">Educational Management System</p>
        </div>

        <!-- Form -->
        <form class="space-y-5" @submit.prevent="handleSubmit">
          <!-- Phone Input -->
          <BaseInput
            v-model="phone"
            type="tel"
            label="Phone Number"
            :icon="Phone"
            :error="phoneError"
            placeholder="01xxxxxxxxx"
            dir="ltr"
            label-class="text-gray-300"
            input-class="bg-white/5 text-white placeholder-gray-400 focus:ring-cyan-400 border-white/10"
            error-dir="rtl"
            @update:model-value="phoneError = ''"
          />

          <!-- Password Input -->
          <BaseInput
            v-model="password"
            :type="showPassword ? 'text' : 'password'"
            label="Password"
            :icon="Lock"
            :error="passwordError"
            placeholder="••••••••"
            label-class="text-gray-300"
            input-class="bg-white/5 text-white placeholder-gray-400 focus:ring-cyan-400 border-white/10"
            error-dir="rtl"
            @update:model-value="passwordError = ''"
          >
            <template #suffix>
              <button
                type="button"
                class="text-gray-400 hover:text-gray-200 transition-colors"
                @click="showPassword = !showPassword"
              >
                <EyeOff v-if="showPassword" class="h-5 w-5" />
                <Eye v-else class="h-5 w-5" />
              </button>
            </template>
          </BaseInput>

          <!-- Submit Button -->
          <BaseButton
            type="submit"
            :disabled="isLoading"
            :loading="isLoading"
            :icon="LogIn"
            variant="primary"
            size="lg"
            custom-class="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 shadow-lg hover:shadow-cyan-500/25 transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign In
          </BaseButton>
        </form>

        <!-- Footer -->
        <p class="text-center text-gray-400 text-xs mt-6">
          © 2025 EduDash. All rights reserved.
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Phone, Lock, LogIn, GraduationCap, Eye, EyeOff } from 'lucide-vue-next';
import { login } from '../../utils/auth.js';
import { BaseInput, BaseButton } from '../ui';

const emit = defineEmits(['signIn']);

const phone = ref('');
const password = ref('');
const phoneError = ref('');
const passwordError = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

const handleSubmit = async () => {
  phoneError.value = '';
  passwordError.value = '';
  isLoading.value = true;

  try {
    const result = await login(phone.value, password.value);
    
    if (result.success) {
      emit('signIn');
    } else {
      // Set error based on which field failed
      if (result.error.includes('هاتف')) {
        phoneError.value = result.error;
      } else {
        passwordError.value = result.error;
      }
    }
  } catch {
    passwordError.value = 'حدث خطأ أثناء تسجيل الدخول';
  } finally {
    isLoading.value = false;
  }
};
</script>
