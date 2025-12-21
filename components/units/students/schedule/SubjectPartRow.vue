<template>
  <div class="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
    <div class="flex items-center justify-between">
      <!-- Left: More Button and Progress -->
      <div class="flex items-center gap-3 flex-1">
        <button
          class="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm"
          @click="$emit('view-details')"
        >
          <Eye :size="16" />
          <span>المزيد</span>
        </button>
        <div class="flex flex-col">
          <span
            :class="[
              'text-sm font-semibold',
              subjectPart.progress >= 80 ? 'text-green-600' : 'text-orange-600'
            ]"
          >
            {{ subjectPart.progress }}%
          </span>
          <div class="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              :class="[
                'h-full transition-all',
                subjectPart.progress >= 80 ? 'bg-green-500' : 'bg-orange-500'
              ]"
              :style="{ width: `${subjectPart.progress}%` }"
            />
          </div>
        </div>
      </div>

      <!-- Right: Subject Name and Diamonds -->
      <div class="flex items-center gap-3 flex-1 justify-end">
        <div class="flex flex-col items-end">
          <h4 class="text-sm font-semibold text-gray-900">{{ subjectPart.subjectName }}</h4>
          <p class="text-xs text-gray-500">{{ subjectPart.partName }}</p>
        </div>
        <div class="flex items-center gap-1.5">
          <!-- First Diamond (30% threshold) -->
          <div :class="subjectPart.progress >= 30 ? 'opacity-100' : 'opacity-30'">
            <DiamondIcon
              :size="20"
              :color="subjectPart.progress >= 30 ? '#3b82f6' : '#d1d5db'"
            />
          </div>
          <!-- Second Diamond (80% threshold) -->
          <div :class="subjectPart.progress >= 80 ? 'opacity-100' : 'opacity-30'">
            <DiamondIcon
              :size="20"
              :color="subjectPart.progress >= 80 ? '#3b82f6' : '#d1d5db'"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Eye } from 'lucide-vue-next';
import { DiamondIcon } from '../../../ui';

defineProps({
  subjectPart: {
    type: Object,
    required: true
  }
});

defineEmits(['view-details']);
</script>

