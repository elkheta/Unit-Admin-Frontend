<template>
  <div class="grid grid-cols-4 gap-6 flex-1">
    <StatDisplay :value="unit.students" label="Students" variant="primary" />
    <StatDisplay :value="unit.outside" label="Outside" variant="danger" />
    <StatDisplay :value="unit.availableCapacity" label="Available Capacity" variant="success" />
    <StatDisplay :value="unit.reminders" label="Reminders" variant="warning" />
  </div>
</template>

<script setup>
import { StatDisplay } from '../ui';

defineProps({
  unit: {
    type: Object,
    required: true
  }
});
</script>

