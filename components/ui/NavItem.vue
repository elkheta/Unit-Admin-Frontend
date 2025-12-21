<template>
  <button
    @click="$emit('click', id)"
    :class="navItemClasses"
  >
    <div class="flex items-center gap-3">
      <component v-if="icon" :is="icon" :size="iconSize" :class="iconClasses" />
      <span>{{ label }}</span>
    </div>
    <div v-if="badge || $slots.badge" class="relative">
      <slot name="badge">
        <component v-if="badgeIcon" :is="badgeIcon" :size="16" :class="badgeIconClasses" />
        <span v-if="badgeCount" class="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
      </slot>
    </div>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  id: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    default: null
  },
  iconSize: {
    type: [String, Number],
    default: 20
  },
  active: {
    type: Boolean,
    default: false
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'action'].includes(value)
  },
  badge: {
    type: Boolean,
    default: false
  },
  badgeIcon: {
    type: Object,
    default: null
  },
  badgeCount: {
    type: Number,
    default: 0
  }
});

defineEmits(['click']);

const navItemClasses = computed(() => {
  const base = 'w-full text-left flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-150';
  const justify = props.variant === 'action' ? 'justify-start mb-2' : 'justify-between';
  
  if (props.active) {
    if (props.variant === 'action') {
      return `${base} ${justify} text-blue-600 bg-blue-50`;
    } else {
      return `${base} ${justify} bg-blue-600 text-white shadow-sm`;
    }
  } else {
    return `${base} ${justify} text-gray-600 hover:text-gray-900 hover:bg-gray-50`;
  }
});

const iconClasses = computed(() => {
  if (props.active && props.variant !== 'action') {
    return 'text-white';
  }
  return 'text-gray-500';
});

const badgeIconClasses = computed(() => {
  if (props.active && props.variant !== 'action') {
    return 'text-white';
  }
  return 'text-gray-400';
});
</script>

