<template>
  <div class="flex items-center gap-3" :class="direction === 'rtl' ? 'text-right' : 'text-left'">
    <UserAvatar :icon="icon" :initials="initials" :size="avatarSize" :variant="avatarVariant" :custom-size="avatarCustomSize" />
    <div class="flex flex-col">
      <span class="text-sm font-semibold text-gray-900">{{ name }}</span>
      <span v-if="role" class="text-xs text-gray-500">{{ role }}</span>
    </div>
  </div>
</template>

<script setup>
import { UserAvatar } from './index.js';

defineProps({
  name: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  },
  initials: {
    type: String,
    default: ''
  },
  avatarSize: {
    type: [String, Number],
    default: 18
  },
  avatarVariant: {
    type: String,
    default: 'primary'
  },
  avatarCustomSize: {
    type: String,
    default: ''
  },
  direction: {
    type: String,
    default: 'ltr',
    validator: (value) => ['ltr', 'rtl'].includes(value)
  }
});
</script>

