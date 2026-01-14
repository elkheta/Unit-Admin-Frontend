<template>
  <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 p-4 pointer-events-none">
    <TransitionGroup name="toast">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="pointer-events-auto min-w-[320px] max-w-md bg-white dark:bg-gray-800 border shadow-lg rounded-lg p-4 flex items-start gap-3 transform transition-all duration-300"
        :class="getToastClasses(toast.type)"
      >
        <!-- Icon -->
        <component 
          :is="getIcon(toast.type)" 
          class="w-5 h-5 flex-shrink-0 mt-0.5" 
          :class="[getIconClasses(toast.type), toast.type === 'loading' ? 'animate-spin' : '']" 
        />
        
        <!-- Content -->
        <div class="flex-1">
          <p class="text-sm font-medium text-gray-800 dark:text-gray-100 leading-tight">
            {{ toast.message }}
          </p>
        </div>

        <!-- Close Button -->
        <button @click="removeToast(toast.id)" class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
          <X class="w-4 h-4" />
        </button>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useToast } from '../../composables/useToast';
import { CheckCircle, AlertCircle, AlertTriangle, Info, X, Loader2 } from 'lucide-vue-next';

const { toasts, removeToast } = useToast();

const getToastClasses = (type) => {
  switch (type) {
    case 'success': return 'border-l-4 border-l-green-500';
    case 'error': return 'border-l-4 border-l-red-500';
    case 'warning': return 'border-l-4 border-l-orange-500';
    case 'loading': return 'border-l-4 border-l-blue-500 bg-blue-50';
    default: return 'border-l-4 border-l-blue-500';
  }
};

const getIcon = (type) => {
  switch (type) {
    case 'success': return CheckCircle;
    case 'error': return AlertCircle;
    case 'warning': return AlertTriangle;
    case 'loading': return Loader2;
    default: return Info;
  }
};

const getIconClasses = (type) => {
  switch (type) {
    case 'success': return 'text-green-500';
    case 'error': return 'text-red-500';
    case 'warning': return 'text-orange-500';
    case 'loading': return 'text-blue-500';
    default: return 'text-blue-500';
  }
};
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}
</style>
