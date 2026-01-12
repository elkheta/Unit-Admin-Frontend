<template>
  <div class="fixed top-4 right-4 z-[9999] space-y-2">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium animate-slide-in"
        :class="{
          'bg-green-500': toast.type === 'success',
          'bg-red-500': toast.type === 'error',
          'bg-blue-500': toast.type === 'info',
          'bg-yellow-500': toast.type === 'warning',
          'bg-gray-700': toast.type === 'loading'
        }"
      >
        <div class="flex items-center gap-2">
            <component 
                :is="getIcon(toast.type)" 
                class="w-4 h-4" 
                :class="{ 'animate-spin': toast.type === 'loading' }" 
            />
            <span>{{ toast.message }}</span>
        </div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast';
import { CheckCircle, AlertCircle, Info, AlertTriangle, Loader2 } from 'lucide-vue-next';

const { toasts } = useToast();

const getIcon = (type) => {
  switch (type) {
    case 'success': return CheckCircle;
    case 'error': return AlertCircle;
    case 'warning': return AlertTriangle;
    case 'loading': return Loader2;
    default: return Info;
  }
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.toast-leave-to {
  transform: translateX(30px);
  opacity: 0;
}

.toast-move {
  transition: transform 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
</style>
