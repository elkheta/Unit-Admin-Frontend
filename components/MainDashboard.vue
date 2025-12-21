<template>
  <div class="flex flex-col gap-2 animate-fade-in max-w-7xl mx-auto">
    <!-- Units Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <UnitCard
        v-for="unit in units"
        :key="unit.id"
        :unit="unit"
        :expired-count="getExpiredCount()"
        @unit-click="$emit('unit-click', $event)"
        @expired-click="$emit('expired-click', $event)"
      />
    </div>

    <!-- Reminders Section -->
    <RemindersSection
      :reminders="reminders"
      @complete="$emit('complete-reminder', $event)"
      @dismiss="$emit('dismiss-reminder', $event)"
    />
  </div>
</template>

<script setup>
import UnitCard from './UnitCard.vue';
import RemindersSection from './RemindersSection.vue';

const props = defineProps({
  units: {
    type: Array,
    default: () => []
  },
  reminders: {
    type: Array,
    default: () => []
  },
  allStudents: {
    type: Array,
    default: () => []
  }
});

defineEmits(['unit-click', 'expired-click', 'complete-reminder', 'dismiss-reminder']);

const getExpiredCount = () => {
  const now = new Date();
  return props.allStudents.filter(student =>
    student.expirationDate < now && student.status === 'Inactive'
  ).length;
};
</script>

