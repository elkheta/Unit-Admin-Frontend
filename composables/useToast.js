import { ref } from 'vue';

const toasts = ref([]);
let toastId = 0;

export function useToast() {
  const addToast = (message, type = 'info', duration = 3000) => {
    const id = toastId++;
    const toast = { id, message, type };
    toasts.value.push(toast);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    const index = toasts.value.findIndex(t => t.id === id);
    if (index > -1) {
      toasts.value.splice(index, 1);
    }
  };

  const success = (message, duration = 3000) => {
    return addToast(message, 'success', duration);
  };

  const error = (message, duration = 3000) => {
    return addToast(message, 'error', duration);
  };

  const info = (message, duration = 3000) => {
    return addToast(message, 'info', duration);
  };

  const warning = (message, duration = 3000) => {
    return addToast(message, 'warning', duration);
  };

  const loading = (message) => {
    return addToast(message, 'loading', 0); // 0 duration = indefinite
  };

  const clear = () => {
    toasts.value = [];
  };

  return {
    toasts,
    success,
    error,
    info,
    warning,
    loading,
    removeToast,
    clear
  };
}
