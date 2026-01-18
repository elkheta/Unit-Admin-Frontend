<template>
  <span 
    class="px-2.5 py-1 rounded-full text-xs font-medium"
    :class="badgeClasses"
  >
    {{ name }}
  </span>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  color: {
    type: String, // e.g., 'Red', 'Blue', 'Green' from backend
    default: 'Gray'
  }
});

const badgeClasses = computed(() => {
  const colorMap = {
    'Red': 'bg-red-100 text-red-700',
    'Green': 'bg-green-100 text-green-700',
    'Blue': 'bg-blue-100 text-blue-700',
    'Yellow': 'bg-yellow-100 text-yellow-700',
    'Pink': 'bg-pink-100 text-pink-700',
    'Purple': 'bg-purple-100 text-purple-700',
    'Orange': 'bg-orange-100 text-orange-700',
    'Black': 'bg-gray-800 text-white',
    'White': 'bg-white text-gray-800 border border-gray-200',
    'Brown': 'bg-amber-800 text-white', // Approximation for Brown
    'Gray': 'bg-gray-100 text-gray-700'
  };
  
  return colorMap[props.color] || colorMap['Gray'];
});
</script>
