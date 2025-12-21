<template>
  <div class="flex flex-col h-full animate-fade-in">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-bold text-gray-900">Messages</h2>
      <BaseButton variant="primary" :icon="Send" size="md">
        New Broadcast
      </BaseButton>
    </div>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
      <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
        <Package :size="32" />
      </div>
      <h3 class="text-lg font-medium text-gray-900">Message Center</h3>
      <p class="text-gray-500 mt-2 max-w-md">
        Communicate with students and parents of {{ selectedUnit?.title }} directly from here.
      </p>
    </div>
  </div>
</template>

<script setup>
import { Send, Package } from 'lucide-vue-next';
import { BaseButton } from '../ui';

defineProps({
  selectedUnit: {
    type: Object,
    default: null
  }
});
</script>

