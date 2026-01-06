<template>
  <div :class="badgeClasses">
    <component :is="icon" v-if="icon" :size="size" :stroke-width="strokeWidth" :class="iconClasses" />
    <slot v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: Function,
    default: null
  },
  size: {
    type: [String, Number],
    default: 20
  },
  strokeWidth: {
    type: [String, Number],
    default: 2
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'warning', 'danger', 'gray'].includes(value)
  },
  shape: {
    type: String,
    default: 'square',
    validator: (value) => ['square', 'circle'].includes(value)
  },
  customSize: {
    type: String,
    default: ''
  }
});

const badgeClasses = computed(() => {
  const base = 'flex items-center justify-center flex-shrink-0';
  const size = props.customSize || 'w-10 h-10';
  const shape = props.shape === 'circle' ? 'rounded-full' : 'rounded-lg';
  
  const variants = {
    primary: 'bg-blue-600 text-white',
    secondary: 'bg-gray-100 text-gray-600',
    success: 'bg-green-100 text-green-600',
    warning: 'bg-orange-100 text-orange-600',
    danger: 'bg-red-100 text-red-600',
    gray: 'bg-gray-100 text-gray-400'
  };
  
  return `${base} ${size} ${shape} ${variants[props.variant]}`;
});

const iconClasses = computed(() => {
  return 'text-current';
});
</script>

