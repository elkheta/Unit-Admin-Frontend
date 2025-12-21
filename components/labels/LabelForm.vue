<template>
  <div class="space-y-4">
    <BaseInput 
      :model-value="label.name" 
      label="Label Name"
      placeholder="e.g. VIP, Urgent" 
      @update:model-value="$emit('update:label', { ...label, name: $event })" 
    />
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Linked Category</label>
      <div class="relative">
        <select 
          :value="label.category"
          class="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          @change="$emit('update:label', { ...label, category: $event.target.value })"
        >
          <option value="" disabled>Select Category</option>
          <option value="Status">Status</option>
          <option value="Behavior">Behavior</option>
          <option value="Academic">Academic</option>
          <option value="General">General</option>
        </select>
        <ChevronDown :size="14" class="absolute right-3 top-3 text-gray-400 pointer-events-none" />
      </div>
    </div>
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
import { ChevronDown } from 'lucide-vue-next';
import { BaseInput } from '../ui';

defineProps({
  label: {
    type: Object,
    default: () => ({ name: '', category: '', description: '' })
  }
});

defineEmits(['update:label']);
</script>

