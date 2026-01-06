<template>
  <div class="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200">
    <div class="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
      <User :size="12" class="text-green-600" />
    </div>
    <span class="text-sm text-gray-700">{{ name }}</span>
  </div>
</template>

<script setup>
import { User } from 'lucide-vue-next';

defineProps({
  name: {
    type: String,
    required: true
  }
});
</script>

