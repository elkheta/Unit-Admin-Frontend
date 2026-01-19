<template>
  <div class="bg-white rounded-lg border border-gray-200 p-3 hover:shadow-md transition-shadow">
    <div class="flex flex-col gap-2">
      <!-- Top Row: Subject Name, Diamonds, and More Button -->
      <div class="flex items-center justify-between">
        
        <!-- Right:  More Button-->
        <button class="flex items-center gap-1.5 text-blue-600 hover:text-blue-700 font-medium text-sm flex-shrink-0"
          @click="$emit('view-details')">
          <Eye :size="16" />
          <span>المزيد</span>
        </button>

        <!-- Left:  Subject Name and Diamonds -->
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1.5 flex-shrink-0">
            <!-- First Diamond (30% threshold) -->
            <div class="flex flex-col items-end">
            <h2 class="text-sm font-semibold text-gray-900">{{ subjectPart.subjectName }} - {{ subjectPart.partName }}</h2>
            
          </div>
            <div :class="subjectPart.progress >= 30 ? 'opacity-100' : 'opacity-30'">
              <DiamondIcon :size="18" :color="subjectPart.progress >= 30 ? '#16B3E1' : '#d1d5db'" />
            </div>
            <!-- Second Diamond (80% threshold) -->
            <div :class="subjectPart.progress >= 80 ? 'opacity-100' : 'opacity-30'">
              <DiamondIcon :size="18" :color="subjectPart.progress >= 80 ? '#16B3E1' : '#d1d5db'" />
            </div>
          </div>
       
        </div>
      </div>

      <!-- Bottom Row: Progress Bar and Percentage -->
      <div class="flex items-center gap-3">
        <span :class="[
          'text-sm font-semibold flex-shrink-0',
          subjectPart.progress >= 80 ? 'text-green-600' : 'text-orange-600'
        ]">
          {{ subjectPart.progress }}%
        </span>
        <div class="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div :class="[
            'h-full transition-all',
            subjectPart.progress >= 80 ? 'bg-green-500' : 'bg-orange-500'
          ]" :style="{ width: `${subjectPart.progress}%` }" />
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
