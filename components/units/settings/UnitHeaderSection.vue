<template>
  <div class="mb-6">
    <div class="flex items-center gap-3 mb-2">
      <Settings :size="24" class="text-gray-700" />
      <h2 class="text-2xl font-bold text-gray-900">Unit Settings</h2>
    </div>
    <a href="#" class="text-sm text-blue-600 hover:text-blue-700" @click.prevent="$emit('back')">
      ← Back to Unit
    </a>
  </div>
</template>

<script setup>
import { Settings } from 'lucide-vue-next';

defineEmits(['back']);
</script>

