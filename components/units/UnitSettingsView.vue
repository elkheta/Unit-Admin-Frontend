<template>
  <div class="flex flex-col h-full animate-fade-in">
    <h2 class="text-2xl font-bold text-gray-900 mb-6">Unit Settings</h2>
    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div class="border-b border-gray-100 pb-4 mb-4">
        <h3 class="text-lg font-medium text-gray-900">General Information</h3>
        <p class="text-sm text-gray-500">Update unit details and configurations.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Main Name</label>
          <input 
            type="text" 
            :value="selectedUnit?.title"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" 
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
          <input 
            type="number" 
            placeholder="Enter capacity"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" 
          />
        </div>
      </div>
      <div class="mt-6 flex justify-end">
        <BaseButton variant="primary" size="md">Save Changes</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BaseButton } from '../ui';

defineProps({
  selectedUnit: {
    type: Object,
    default: null
  }
});
</script>

