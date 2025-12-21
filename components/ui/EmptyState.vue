<template>
  <div class="flex flex-col items-center justify-center py-6">
    <div v-if="icon" :class="iconContainerClasses">
      <component :is="icon" :size="iconSize" />
    </div>
    <h4 v-if="title" :class="titleClasses">{{ title }}</h4>
    <p v-if="message" :class="messageClasses">{{ message }}</p>
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  icon: {
    type: Object,
    default: null
  },
  iconSize: {
    type: [String, Number],
    default: 24
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'info'].includes(value)
  }
});

const iconContainerClasses = computed(() => {
  const base = 'rounded-full flex items-center justify-center mb-4';
  const variants = {
    default: 'w-12 h-12 bg-gray-100 text-gray-400',
    success: 'w-12 h-12 bg-green-100 text-green-500',
    info: 'w-12 h-12 bg-blue-100 text-blue-500'
  };
  
  return `${base} ${variants[props.variant]}`;
});

const titleClasses = computed(() => {
  return 'text-sm font-bold text-gray-900 mb-1';
});

const messageClasses = computed(() => {
  return 'text-xs text-gray-500';
});
</script>

