<template>
  <div class="flex flex-col gap-2 animate-fade-in max-w-7xl mx-auto">
    <!-- Units Grid -->
    <template v-if="units.length > 0">
      <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 items-stretch">
        <UnitCard
          v-for="unit in units"
          :key="unit.id"
          :unit="unit"
          :expired-count="unit.expiredCount"
          @unit-click="$emit('unit-click', $event)"
          @expired-click="$emit('expired-click', $event)"
          @settings-click="$emit('settings-click', $event)"
        />
      </div>
    </template>
    
    <!-- Empty State -->
    <template v-else>
      <EmptyState
        :icon="LayoutDashboard"
        title="No Units Assigned"
        message="You don't have any units assigned to you yet."
        variant="default"
        class="bg-white"
      />
    </template>

    <!-- Reminders Section -->
    <RemindersSection
      :reminders="reminders"
      @complete="$emit('complete-reminder', $event)"
      @dismiss="$emit('dismiss-reminder', $event)"
      @view="$emit('view-reminder', $event)"
    />
  </div>
</template>

<script setup>
import { LayoutDashboard } from 'lucide-vue-next';
import { EmptyState } from '../ui';
import UnitCard from '../units/UnitCard.vue';
import { RemindersSection } from './index.js';

defineProps({
  units: {
    type: Array,
    default: () => []
  },
  reminders: {
    type: Array,
    default: () => []
  }
});

defineEmits(['unit-click', 'expired-click', 'complete-reminder', 'dismiss-reminder', 'settings-click', 'view-reminder']);
</script>

