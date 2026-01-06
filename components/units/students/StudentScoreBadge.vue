<template>
  <div
    class="relative flex flex-col items-center justify-center w-11 h-11 rounded-full border-2 shrink-0 transition-all group cursor-pointer hover:shadow-lg"
    :class="badgeClasses"
    @click="$emit('click')"
    :title="tooltipText"
  >
    <span class="text-[10px] font-bold">{{ displayProgress }}%</span>
    <span class="text-[7px] leading-none">Score</span>
    
    <!-- Tooltip on hover -->
    <div 
      v-if="hasAccumulatedLessons"
      class="absolute bottom-full mb-2 hidden group-hover:block bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap z-10" 
      dir="rtl"
    >
      حصص متراكمة: {{ accumulatedLessons }}
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  accumulatedLessons: {
    type: Number,
    default: 0
  },
  accumulatedProgress: {
    type: Number,
    default: 0
  }
});

defineEmits(['click']);

const hasAccumulatedLessons = computed(() => {
  return props.accumulatedLessons && props.accumulatedLessons > 0;
});

const displayProgress = computed(() => {
  return hasAccumulatedLessons.value ? props.accumulatedProgress : 100;
});

const badgeClasses = computed(() => {
  if (!hasAccumulatedLessons.value) {
    return 'border-green-200 text-green-600';
  }
  
  const progress = props.accumulatedProgress || 0;
  if (progress >= 70) {
    return 'border-green-200 text-green-600 hover:border-green-300';
  } else if (progress >= 40) {
    return 'border-orange-200 text-orange-600 hover:border-orange-300';
  } else {
    return 'border-red-200 text-red-500 hover:border-red-300';
  }
});

const tooltipText = computed(() => {
  return hasAccumulatedLessons.value 
    ? `عدد الحصص المتراكمة: ${props.accumulatedLessons}`
    : 'لا توجد حصص متراكمة';
});
</script>