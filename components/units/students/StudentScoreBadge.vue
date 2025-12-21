<template>
  <button
    class="w-12 h-12 rounded-full flex flex-col items-center justify-center text-xs font-bold cursor-pointer hover:opacity-80 transition-opacity"
    :class="scoreClasses"
    @click="$emit('click')"
  >
    <span>{{ score }}%</span>
    <span class="text-[10px] font-normal">Score</span>
  </button>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  score: {
    type: Number,
    required: true
  }
});

defineEmits(['click']);

const scoreClasses = computed(() => {
  // Green if score > 80%, red if score < 80%
  if (props.score > 80) {
    return 'bg-green-100 text-green-700';
  }
  return 'bg-red-100 text-red-700';
});
</script>

