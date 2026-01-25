<template>
  <div
    class="relative flex flex-col items-center justify-center w-11 h-11 rounded-full border-2 shrink-0 transition-all group cursor-pointer hover:shadow-lg"
    :class="[badgeClasses, { 'opacity-40 blur-[1px]': displayValue === null }]"
    @click="$emit('click')"
    :title="tooltipText"
  >
    <template v-if="displayValue !== null">
      <span class="text-[10px] font-bold">{{ displayValue }}<span v-if="isPercentage">%</span></span>
      <span class="text-[7px] leading-none">Score</span>
    </template>
    
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
  },
  score: {
    type: Number,
    default: 0
  }
});

defineEmits(['click']);

const hasAccumulatedLessons = computed(() => {
  return props.accumulatedLessons && props.accumulatedLessons > 0;
});

const displayValue = computed(() => {
 if (hasAccumulatedLessons.value) {
    return props.accumulatedProgress;
  }
  return null;
});

const isPercentage = computed(() => Math.abs(props.accumulatedProgress) >= 0.01);

const badgeClasses = computed(() => {
  const progress = props.accumulatedProgress || 0;
  
  if (progress < 0.01 || props.accumulatedLessons === 0) {
    // Neural/Gray for 0% and no accumulated lessons
    return 'border-gray-200 text-gray-500 hover:border-gray-300';
  } else if (progress < 60) {
    // Red for < 60%
    return 'border-red-200 text-red-500 hover:border-red-300';
  } else {
    // Green otherwise (>= 60%)
    return 'border-green-200 text-green-600 hover:border-green-300';
  }
});

const tooltipText = computed(() => {
  return hasAccumulatedLessons.value 
    ? `عدد الحصص المتراكمة: ${props.accumulatedLessons}`
    : 'لا توجد حصص متراكمة';
});
</script>