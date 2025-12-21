<template>
  <div :class="avatarClasses">
    <component v-if="icon" :is="icon" :size="size" />
    <span v-else-if="initials" class="text-sm font-semibold">{{ initials }}</span>
    <slot v-else />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: Object,
    default: null
  },
  initials: {
    type: String,
    default: ''
  },
  size: {
    type: [String, Number],
    default: 18
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'gray'].includes(value)
  },
  customSize: {
    type: String,
    default: ''
  }
});

const avatarClasses = computed(() => {
  const base = 'rounded-full flex items-center justify-center border flex-shrink-0';
  const size = props.customSize || 'w-9 h-9';
  
  const variants = {
    primary: 'bg-blue-50 border-blue-100 text-blue-600',
    secondary: 'bg-gray-50 border-gray-100 text-gray-600',
    gray: 'bg-gray-100 border-gray-200 text-gray-500'
  };
  
  return `${base} ${size} ${variants[props.variant]}`;
});
</script>

