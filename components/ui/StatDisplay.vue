<template>
  <div class="flex flex-col items-center">
    <span :class="valueClasses">{{ value }}</span>
    <span :class="labelClasses">{{ label }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  value: {
    type: [String, Number],
    required: true
  },
  label: {
    type: String,
    required: true
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'success', 'warning', 'danger', 'info'].includes(value)
  },
  size: {
    type: String,
    default: 'md',
    validator: (value) => ['sm', 'md', 'lg'].includes(value)
  }
});

const valueClasses = computed(() => {
  const size = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl'
  };
  
  const variants = {
    primary: 'font-bold text-blue-600',
    success: 'font-bold text-green-600',
    warning: 'font-bold text-yellow-500',
    danger: 'font-bold text-red-500',
    info: 'font-bold text-gray-600'
  };
  
  return `${size[props.size]} ${variants[props.variant]}`;
});

const labelClasses = computed(() => {
  const size = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-xs'
  };
  
  return `${size[props.size]} text-gray-500 font-medium`;
});
</script>

