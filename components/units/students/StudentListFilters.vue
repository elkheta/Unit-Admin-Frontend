<template>
  <div class="mb-6 space-y-4">
    <!-- Search Bar -->
    <div class="relative w-full">
      <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search :size="20" class="text-gray-400" />
      </div>
      <input v-model="searchQuery" type="text" placeholder="Search by name"
        class="w-full pl-12 pr-4 py-3 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
        @input="$emit('search', $event.target.value)" />
    </div>

    <!-- Filter Row -->
    <div class="flex items-center gap-3 flex-wrap relative">
      <!-- Sort Button -->
      <button ref="sortButtonRef"
        class="w-10 h-10 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors flex items-center justify-center"
        :title="'Sort Students'" @click="handleSortClick">
        <Eye :size="18" class="text-blue-600" />
      </button>

      <!-- Groups Dropdown -->
      <BaseSelect v-model="selectedGroup" :options="groupOptions" placeholder="All Groups"
        select-class="text-sm py-2.5 px-4 border border-gray-300 rounded-lg bg-white min-w-[140px] font-normal"
        @update:model-value="$emit('filter-group', $event)" />

      <!-- Subjects Dropdown -->
      <BaseSelect v-model="selectedSubject" :options="subjectOptions" placeholder="All Subjects"
        select-class="text-sm py-2.5 px-4 border border-gray-300 rounded-lg bg-white min-w-[140px] font-normal"
        @update:model-value="$emit('filter-subject', $event)" />

      <!-- Filter Icons - Positioned right after dropdowns -->
      <button ref="diamondsButtonRef"
        class="w-10 h-10 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
        :class="{ 'bg-blue-50 border-blue-200': activeFilter === 'diamonds' }" title="Filter by Diamond Points"
        @click="handleFilterClick('diamonds', $event)">
        <DiamondIcon :size="18" color="#60a5fa" />
      </button>
      <button ref="progressButtonRef"
        class="w-10 h-10 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
        :class="{ 'bg-green-50 border-green-200': activeFilter === 'progress' }" title="Filter by Progress"
        @click="handleFilterClick('progress', $event)">
        <BarChart3 :size="18" class="text-green-600" :stroke-width="2" fill="none" />
      </button>

      <button ref="scoreButtonRef"
        class="w-10 h-10 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
        :class="{ 'bg-purple-50 border-purple-200': activeFilter === 'score' }" title="Filter by Score"
        @click="handleFilterClick('score', $event)">
        <BookOpen :size="18" class="text-purple-600" :stroke-width="2" fill="none" />
      </button>

      <button ref="lastSeenButtonRef"
        class="w-10 h-10 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center"
        :class="{ 'bg-purple-50 border-purple-200': activeFilter === 'last-seen' }" title="Filter by Last Seen Time"
        @click="handleFilterClick('last-seen', $event)">
        <Monitor :size="18" class="text-purple-600" :stroke-width="2" fill="none" />
      </button>
    </div>

    <!-- Sort Modal -->
    <SortStudentsModal :is-open="isSortModalOpen" :current-sort-options="currentSortOptions"
      :position="sortButtonPosition"
      @close="isSortModalOpen = false" @apply-sort="handleApplySort" />

    <!-- Filter Modals -->
    <FilterModal v-for="filterType in ['diamonds', 'progress', 'score', 'last-seen']" :key="filterType"
      :is-open="openFilterModal === filterType" :filter-type="filterType" :current-filter="currentFilters[filterType]"
      :position="filterButtonPositions[filterType]" @close="openFilterModal = null"
      @apply-filter="(data) => handleApplyFilter(filterType, data)" />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Search, Eye, BarChart3, BookOpen, Monitor } from 'lucide-vue-next';
import { BaseInput, BaseSelect } from '../../ui';
import { DiamondIcon } from '../../ui';
import SortStudentsModal from './SortStudentsModal.vue';
import FilterModal from './FilterModal.vue';

const props = defineProps({
  activeFilter: {
    type: String,
    default: ''
  },
  currentSortOptions: {
    type: Object,
    default: () => ({
      progress: null,
      diamonds: null,
      lastSeen: null,
      dateAdded: 'newest-first',
      expirationDate: null
    })
  },
  currentFilters: {
    type: Object,
    default: () => ({
      diamonds: null,
      progress: null,
      score: null,
      'last-seen': null
    })
  },
  groupOptions: {
    type: Array,
    default: () => []
  },
  subjectOptions: {
    type: Array,
    default: () => []
  },
  initialSearch: {
    type: String,
    default: ''
  }
});

const emit = defineEmits([
  'search',
  'apply-sort',
  'filter-group',
  'filter-subject',
  'apply-filter'
]);

const searchQuery = ref(props.initialSearch);
const selectedGroup = ref('');
const selectedSubject = ref('');
const isSortModalOpen = ref(false);
const openFilterModal = ref(null);

// Refs for filter button positions
const sortButtonRef = ref(null);
const diamondsButtonRef = ref(null);
const progressButtonRef = ref(null);
const scoreButtonRef = ref(null);
const lastSeenButtonRef = ref(null);

const sortButtonPosition = ref({ top: 0, left: 0 });

const filterButtonPositions = reactive({
  diamonds: { top: 0, left: 0 },
  progress: { top: 0, left: 0 },
  score: { top: 0, left: 0 },
  'last-seen': { top: 0, left: 0 }
});

const handleSortClick = () => {
  if (sortButtonRef.value) {
    const rect = sortButtonRef.value.getBoundingClientRect();
    sortButtonPosition.value = {
      top: rect.bottom + 8,
      left: rect.left
    };
  }
  isSortModalOpen.value = true;
};

const handleFilterClick = (filterType, event) => {
  const buttonRef = {
    diamonds: diamondsButtonRef,
    progress: progressButtonRef,
    score: scoreButtonRef,
    'last-seen': lastSeenButtonRef
  }[filterType];

  if (buttonRef?.value) {
    const rect = buttonRef.value.getBoundingClientRect();
    filterButtonPositions[filterType] = {
      top: rect.bottom + 8,
      left: rect.left
    };
  }

  openFilterModal.value = filterType;
};

const handleApplySort = (sortOptions) => {
  emit('apply-sort', sortOptions);
};

const handleApplyFilter = (filterType, filterData) => {
  emit('apply-filter', { filterType, filterData });
};


</script>
