<template>
  <div
    :class="[
      'bg-white rounded-lg border-2 p-4 transition-all',
      day.isToday ? 'border-blue-500 bg-blue-50' : 'border-gray-200',
      day.isHoliday ? 'bg-green-50 border-green-200' : ''
    ]"
  >
    <!-- Day Header -->
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-3">
        <div class="flex flex-col">
          <h3 class="text-lg font-bold text-gray-900">{{ day.dayName }}</h3>
          <p class="text-sm text-gray-500">{{ day.dayNumber }} {{ day.month }}</p>
        </div>
        <span
          v-if="day.isToday"
          class="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full"
        >
          Today
        </span>
      </div>
      <div
        v-if="!day.isHoliday"
        :class="[
          'text-2xl font-bold',
          day.dailyProgress >= 80 ? 'text-green-600' : 'text-orange-600'
        ]"
      >
        {{ day.dailyProgress }}%
      </div>
    </div>

    <!-- Holiday Display -->
    <div v-if="day.isHoliday" class="flex items-center justify-center py-8">
      <div class="flex items-center gap-3 px-4 py-3 bg-green-100 rounded-lg border border-green-200">
        <TreePine :size="24" class="text-green-600" />
        <span class="text-green-700 font-semibold">إجازة</span>
      </div>
    </div>

    <!-- Subjects List -->
    <div v-else class="space-y-3">
      <SubjectPartRow
        v-for="subject in day.subjects"
        :key="subject.id"
        :subject-part="subject"
        @view-details="() => $emit('view-details', subject, day)"
      />
    </div>
  </div>
</template>

<script setup>
import { TreePine } from 'lucide-vue-next';
import SubjectPartRow from './SubjectPartRow.vue';

defineProps({
  day: {
    type: Object,
    required: true
  },
  isToday: {
    type: Boolean,
    default: false
  }
});

defineEmits(['view-details']);
</script>

