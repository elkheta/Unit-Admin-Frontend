<template>
  <div class="mb-4 text-sm text-gray-600">
    Showing <span class="font-bold">{{ start }} - {{ end }}</span> of <span class="font-bold">{{ total }}</span> students
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    default: 1
  },
  pageSize: {
    type: Number,
    default: 10
  },
  total: {
    type: Number,
    required: true
  }
});

const start = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1;
});

const end = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.total);
});
</script>

