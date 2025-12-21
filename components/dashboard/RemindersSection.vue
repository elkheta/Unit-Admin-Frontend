<template>
  <BaseCard title="Upcoming Actions & Reminders" padding="lg" class="mt-2">
    <EmptyState 
      v-if="reminders.length === 0" 
      :icon="CheckCircle2" 
      title="No Pending Reminders"
      message="You're all caught up!" 
      variant="success" 
    />
    
    <div v-else class="space-y-3">
      <ReminderItem
        v-for="reminder in reminders"
        :key="reminder.id"
        :reminder="reminder"
        @complete="$emit('complete', $event)"
        @dismiss="$emit('dismiss', $event)"
      />
    </div>
  </BaseCard>
</template>

<script setup>
import { CheckCircle2 } from 'lucide-vue-next';
import { BaseCard, EmptyState } from '../ui';
import { ReminderItem } from './index.js';

defineProps({
  reminders: {
    type: Array,
    default: () => []
  }
});

defineEmits(['complete', 'dismiss']);
</script>

