<template>
  <div class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
    <div class="flex-1">
      <div class="flex items-center gap-2 mb-1">
        <span class="text-sm font-bold text-gray-900">{{ reminder.personName }}</span>
        <span class="text-xs text-gray-500">•</span>
        <span class="text-xs text-gray-500">{{ reminder.group }}</span>
        <span class="text-xs text-gray-500">•</span>
        <span class="text-xs text-gray-500">{{ reminder.unit }}</span>
      </div>
      <p class="text-sm text-gray-700 mb-2">{{ reminder.description }}</p>
      <div class="flex items-center gap-3">
        <Badge 
          :text="reminder.statusIndicator"
          :variant="reminder.statusIndicator === 'Overdue' ? 'danger' : reminder.statusIndicator === 'Due Soon' ? 'warning' : 'primary'" 
        />
        <span class="text-xs text-gray-500">Due: {{ reminder.dueDate }}</span>
      </div>
    </div>
    <div class="flex items-center gap-2">
      <BaseButton 
        variant="success" 
        size="sm" 
        :icon="CheckCircle2"
        custom-class="p-2 !text-white" 
        title="Complete" 
        @click="$emit('complete', reminder.id)" 
      />
      <BaseButton 
        variant="danger" 
        size="sm" 
        :icon="X" 
        custom-class="p-2 !text-white"
        title="Dismiss" 
        @click="$emit('dismiss', reminder.id)" 
      />
    </div>
  </div>
</template>

<script setup>
import { CheckCircle2, X } from 'lucide-vue-next';
import { BaseButton, Badge } from '../ui';

defineProps({
  reminder: {
    type: Object,
    required: true
  }
});

defineEmits(['complete', 'dismiss']);
</script>

