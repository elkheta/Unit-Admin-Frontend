<template>
  <section class="statistics-section">
    <h3 class="text-lg font-bold text-gray-900 mb-6">Statistics</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <StudentCapacityDisplay
        :current-capacity="unitData.currentCapacity"
        :max-capacity="unitData.maxCapacity"
      />
      
      <TotalGroupsDisplay :total-groups="unitData.totalGroups || 0" />
    </div>
  </section>
</template>

<script setup>
import { StudentCapacityDisplay, TotalGroupsDisplay } from './index.js';

defineProps({
  unitData: {
    type: Object,
    required: true
  }
});
</script>

