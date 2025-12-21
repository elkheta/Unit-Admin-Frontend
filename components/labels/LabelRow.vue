<template>
  <tr class="hover:bg-gray-50 transition-colors group">
    <td class="px-6 py-4 text-sm text-gray-500 font-mono">#{{ label.id }}</td>
    <td class="px-6 py-4">
      <div class="flex items-center gap-3">
        <IconBadge :icon="Tag" :size="14" variant="success" shape="circle" custom-size="w-8 h-8" />
        <span class="text-sm font-bold text-gray-900">{{ label.name }}</span>
      </div>
    </td>
    <td class="px-6 py-4">
      <Badge :text="label.category" variant="default" />
    </td>
    <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{{ label.description }}</td>
    <td class="px-6 py-4 text-sm text-gray-500">{{ label.creationDate }}</td>
    <td class="px-6 py-4 text-right">
      <div class="flex items-center justify-end gap-2">
        <BaseButton 
          variant="primary" 
          size="sm" 
          :icon="Edit3" 
          custom-class="p-1.5 text-blue-600 hover:bg-blue-50"
          title="Edit" 
          @click="$emit('edit', label)" 
        />
        <BaseButton 
          variant="danger" 
          size="sm" 
          :icon="Trash2" 
          custom-class="p-1.5 text-red-600 hover:bg-red-50"
          title="Delete" 
          @click="$emit('delete', label.id)" 
        />
      </div>
    </td>
  </tr>
</template>

<script setup>
import { Tag, Edit3, Trash2 } from 'lucide-vue-next';
import { BaseButton, IconBadge, Badge } from '../ui';

defineProps({
  label: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);
</script>

