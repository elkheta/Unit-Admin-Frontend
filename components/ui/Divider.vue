<template>
  <div :class="dividerClasses" :style="dividerStyle"></div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  orientation: {
    type: String,
    default: 'vertical',
    validator: (value) => ['vertical', 'horizontal'].includes(value)
  },
  spacing: {
    type: String,
    default: 'md'
  },
  color: {
    type: String,
    default: 'gray-200'
  }
});

const dividerClasses = computed(() => {
  if (props.orientation === 'vertical') {
    const spacing = {
      sm: 'mx-1',
      md: 'mx-2',
      lg: 'mx-4'
    };
    return `h-8 w-px bg-${props.color} ${spacing[props.spacing]}`;
  } else {
    const spacing = {
      sm: 'my-1',
      md: 'my-2',
      lg: 'my-4'
    };
    return `w-full h-px bg-${props.color} ${spacing[props.spacing]}`;
  }
});

const dividerStyle = computed(() => {
  // Fallback for dynamic color classes that Tailwind might not detect
  return {};
});
</script>

