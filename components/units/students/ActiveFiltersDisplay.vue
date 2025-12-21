<template>
  <div v-if="hasActiveFilters" class="mb-4 flex flex-wrap items-center gap-2">
    <span class="text-sm font-medium text-gray-700">Active Filters:</span>
    
    <!-- Diamond Filter -->
    <div
      v-if="filters.diamonds"
      class="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-lg"
    >
      <span class="text-sm text-blue-700">
        <strong>Diamonds:</strong>
        {{ formatFilterValue(filters.diamonds) }}
      </span>
      <button
        class="text-blue-600 hover:text-blue-800 transition-colors"
        title="Remove filter"
        @click="$emit('remove-filter', 'diamonds')"
      >
        <X :size="16" />
      </button>
    </div>

    <!-- Progress Filter -->
    <div
      v-if="filters.progress"
      class="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-lg"
    >
      <span class="text-sm text-green-700">
        <strong>Progress:</strong>
        {{ formatFilterValue(filters.progress) }}
      </span>
      <button
        class="text-green-600 hover:text-green-800 transition-colors"
        title="Remove filter"
        @click="$emit('remove-filter', 'progress')"
      >
        <X :size="16" />
      </button>
    </div>

    <!-- Lessons Filter -->
    <div
      v-if="filters.lessons"
      class="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg"
    >
      <span class="text-sm text-purple-700">
        <strong>Lessons:</strong>
        {{ formatFilterValue(filters.lessons) }}
      </span>
      <button
        class="text-purple-600 hover:text-purple-800 transition-colors"
        title="Remove filter"
        @click="$emit('remove-filter', 'lessons')"
      >
        <X :size="16" />
      </button>
    </div>

    <!-- Last Seen Filter -->
    <div
      v-if="filters['last-seen']"
      class="flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg"
    >
      <span class="text-sm text-purple-700">
        <strong>Last Seen:</strong>
        {{ formatFilterValue(filters['last-seen'], true) }}
      </span>
      <button
        class="text-purple-600 hover:text-purple-800 transition-colors"
        title="Remove filter"
        @click="$emit('remove-filter', 'last-seen')"
      >
        <X :size="16" />
      </button>
    </div>

    <!-- Clear All Button -->
    <button
      class="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
      @click="$emit('clear-all-filters')"
    >
      Clear All
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { X } from 'lucide-vue-next';

const props = defineProps({
  filters: {
    type: Object,
    required: true,
    default: () => ({
      diamonds: null,
      progress: null,
      lessons: null,
      'last-seen': null
    })
  }
});

const emit = defineEmits(['remove-filter', 'clear-all-filters']);

const hasActiveFilters = computed(() => {
  return props.filters.diamonds ||
    props.filters.progress ||
    props.filters.lessons ||
    props.filters['last-seen'];
});

const formatFilterValue = (filter, isDays = false) => {
  if (!filter) return '';
  
  if (filter.type === 'more-than') {
    return `> ${filter.value}${isDays ? ' days' : ''}`;
  } else if (filter.type === 'less-than') {
    return `< ${filter.value}${isDays ? ' days' : ''}`;
  } else if (filter.type === 'between') {
    return `${filter.min} - ${filter.max}${isDays ? ' days' : ''}`;
  }
  return '';
};
</script>

