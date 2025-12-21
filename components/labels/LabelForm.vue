<template>
  <div class="space-y-4">
    <BaseInput 
      :model-value="label.name" 
      label="Label Name"
      placeholder="e.g. VIP, Urgent" 
      @update:model-value="$emit('update:label', { ...label, name: $event })" 
    />
    <BaseSelect
      :model-value="label.category"
      label="Linked Category"
      placeholder="Select Category"
      :options="categoryOptions"
      @update:model-value="$emit('update:label', { ...label, category: $event })"
    />
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
      <textarea 
        :value="label.description"
        placeholder="Describe the purpose of this label..."
        class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none text-gray-700 bg-white"
        @input="$emit('update:label', { ...label, description: $event.target.value })"
      ></textarea>
    </div>
  </div>
</template>

<script setup>
import { BaseInput, BaseSelect } from '../ui';

const categoryOptions = [
  { value: 'status', label: 'Status' },
  { value: 'behavior', label: 'Behavior' },
  { value: 'academic', label: 'Academic' },
  { value: 'general', label: 'General' }
];

defineProps({
  label: {
    type: Object,
    default: () => ({ name: '', category: '', description: '' })
  }
});

defineEmits(['update:label']);
</script>

