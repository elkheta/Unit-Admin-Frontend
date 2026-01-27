<template>
  <div :class="[
    'rounded-xl border overflow-hidden shadow-sm',
    day.isToday ? 'bg-blue-50 border-blue-300 ring-2 ring-blue-200' : 'bg-gray-50  border-gray-200',
  ]">
    <!-- Day Header -->
    <div class="flex items-center justify-between p-4 pb-3">
      <!-- Left: Overall Percentage -->
      <div v-if="!day.isHoliday && day.subjects.length > 0" :class="[
        'text-2xl font-bold',
        day.dailyProgress >= 80 ? 'text-green-600' : 'text-orange-600'
      ]">
        {{ day.dailyProgress }}%
      </div>
      <div v-else-if="day.subjects.length === 0" class="text-2xl font-bold text-gray-500"></div>
      <!-- Right: Day Name and Today Badge -->
      <div class="flex items-center gap-3">
        <span v-if="day.isToday" class="px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
          اليوم
        </span>
        <div class="flex flex-col items-end">
          <h3 class="text-lg font-bold text-gray-900">{{ day.dayName }}</h3>
          <p class="text-sm text-gray-500" dir="rtl">{{ day.dayNumber }} {{ day.month }} </p>
        </div>
      </div>
    </div>

    <!-- Holiday Display -->
    <div v-if="day.isHoliday" class="flex items-center justify-center py-6 bg-gray-50">
      <div class="flex items-center gap-2 px-4 py-2.5 bg-green-100 rounded-lg border border-green-200">
        <PalmTreeIcon :size="20" class="text-green-700 " />
        <span class="text-green-700 font-semibold text-sm">إجازة</span>
      </div>
    </div>
  <!-- No Subjects Display -->
    <div v-else-if="day.subjects.length === 0" class="flex items-center justify-center py-6 bg-gray-50">
      <div class="flex items-center gap-2 px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-200">
        <span class="text-gray-700 font-semibold text-sm">لا توجد مواد مجدولة        </span>
      </div>
    </div>
    <!-- Subjects List -->
    <div v-else class="bg-gray-50">
      <div class="space-y-3 p-3">
        <SubjectPartRow v-for="subject in day.subjects" :key="subject.id" :subject-part="subject"
          @view-details="() => $emit('view-details', subject, day)" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { PalmTreeIcon } from '../../../ui';
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
