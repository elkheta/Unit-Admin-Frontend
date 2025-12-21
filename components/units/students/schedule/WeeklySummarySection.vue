<template>
  <div class="bg-blue-50 rounded-lg border border-blue-200 p-6 mt-6">
    <div class="flex items-center gap-2 mb-4">
      <BarChart3 :size="20" class="text-blue-600" />
      <h3 class="text-lg font-bold text-gray-900">ملخص الأسبوع</h3>
    </div>

    <div class="grid grid-cols-3 gap-4">
      <!-- Average Progress Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <p class="text-sm text-gray-600 mb-2">التقدم الأسبوعي</p>
        <p class="text-2xl font-bold text-blue-600">{{ summary.averageProgress }}%</p>
      </div>

      <!-- Completed Lessons Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <p class="text-sm text-gray-600 mb-2">الدروس المكتملة</p>
        <p class="text-2xl font-bold text-green-600">{{ summary.completedLessons }}</p>
      </div>

      <!-- Accumulated Sessions Card -->
      <div class="bg-white rounded-lg border border-gray-200 p-4">
        <p class="text-sm text-gray-600 mb-2">الحصص المتراكمة</p>
        <p class="text-2xl font-bold text-orange-600">{{ summary.accumulatedSessions }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { BarChart3 } from 'lucide-vue-next';

defineProps({
  summary: {
    type: Object,
    required: true
  }
});
</script>

