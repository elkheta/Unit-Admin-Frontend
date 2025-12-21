<template>
  <div :class="cardClasses">
    <div v-if="title || $slots.header" class="mb-4">
      <div v-if="title" class="flex items-center justify-between">
        <div>
          <h3 v-if="title" class="text-lg font-bold text-gray-900">{{ title }}</h3>
          <p v-if="subtitle" class="text-sm text-gray-500 mt-1">{{ subtitle }}</p>
        </div>
        <slot name="header-actions" />
      </div>
      <slot v-else name="header" />
    </div>
    <div class="flex-1">
      <slot />
    </div>
    <div v-if="$slots.footer" class="mt-4 pt-4 border-t border-gray-100">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  padding: {
    type: String,
    default: 'md',
    validator: (value) => ['none', 'sm', 'md', 'lg'].includes(value)
  },
  shadow: {
    type: Boolean,
    default: true
  },
  border: {
    type: Boolean,
    default: true
  }
});

const cardClasses = computed(() => {
  const base = 'bg-white rounded-xl flex flex-col';
  const padding = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  };
  const shadowClass = props.shadow ? 'shadow-sm hover:shadow-md transition-shadow' : '';
  const borderClass = props.border ? 'border border-gray-100' : '';
  
  return `${base} ${padding[props.padding]} ${shadowClass} ${borderClass}`;
});
</script>

