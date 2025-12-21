<template>
  <span
:class="`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
    visibility === 'visible' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
  }`">
    <Eye v-if="visibility === 'visible'" :size="12" />
    <EyeOff v-else :size="12" />
    {{ visibility === 'visible' ? 'Visible' : 'Hidden' }}
  </span>
</template>

<script setup>
import { Eye, EyeOff } from 'lucide-vue-next';

defineProps({
  visibility: {
    type: String,
    required: true
  }
});
</script>

