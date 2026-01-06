<template>
  <div class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
    <div class="text-sm text-gray-600">
      Showing {{ start }} - {{ end }} of {{ total }} students
    </div>
    
    <div class="flex items-center gap-2">
      <button
        :disabled="currentPage === 1"
        class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="$emit('page-change', currentPage - 1)"
      >
        Previous
      </button>
      
      <div class="flex items-center gap-1">
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="[
            'px-3 py-2 text-sm font-medium rounded-lg transition-colors',
            page === currentPage
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
          ]"
          @click="$emit('page-change', page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button
        :disabled="currentPage === totalPages"
        class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        @click="$emit('page-change', currentPage + 1)"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  currentPage: {
    type: Number,
    required: true
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

defineEmits(['page-change']);

const totalPages = computed(() => {
  return Math.ceil(props.total / props.pageSize);
});

const start = computed(() => {
  return (props.currentPage - 1) * props.pageSize + 1;
});

const end = computed(() => {
  return Math.min(props.currentPage * props.pageSize, props.total);
});

const visiblePages = computed(() => {
  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, props.currentPage - Math.floor(maxVisible / 2));
  const endPage = Math.min(totalPages.value, startPage + maxVisible - 1);
  
  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }
  
  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }
  
  return pages;
});
</script>

