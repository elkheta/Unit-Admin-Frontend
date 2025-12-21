<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="buttonClasses"
    @click="$emit('click', $event)"
  >
    <div v-if="loading" class="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
    <component v-else-if="icon" :is="icon" class="w-5 h-5" />
    <span v-if="!loading && icon && $slots.default" class="ml-2">
      <slot />
    </span>
    <span v-else-if="!loading">
      <slot />
    </span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'danger', 'success', 'warning'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: Object,
    default: null
  },
  type: {
    type: String,
    default: 'button'
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  },
  customClass: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);

const buttonClasses = computed(() => {
  const base = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md',
    success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md',
    warning: 'bg-orange-600 text-white hover:bg-orange-700 shadow-sm hover:shadow-md'
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };
  
  return `${base} ${variants[props.variant]} ${sizes[props.size]} ${props.customClass}`;
});
</script>

