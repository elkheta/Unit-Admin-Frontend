<template>
  <div class="flex flex-col h-full animate-fade-in max-w-7xl mx-auto p-4 md:p-6">
    <!-- Page Header -->
    <StudentListHeader :unit-name="unitName" />

    <!-- Search and Filters -->
    <StudentListFilters
      :active-filter="activeFilter"
      :current-sort-options="sortOptions"
      :current-filters="filters"
      :group-options="groupOptions"
      :subject-options="subjectOptions"
      :initial-search="searchQuery"
      @search="handleSearch"
      @apply-sort="handleApplySort"
      @filter-group="handleFilterGroup"
      @filter-subject="handleFilterSubject"
      @apply-filter="handleApplyFilter"
    />

    <!-- Active Filters Display -->
    <ActiveFiltersDisplay
      :filters="filters"
      @remove-filter="handleRemoveFilter"
      @clear-all-filters="handleClearAllFilters"
    />

    <!-- Student Count -->
    <StudentCountDisplay
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalStudents"
    />

    <!-- Students List -->
    <div v-if="totalStudents > 0" class="space-y-2">
            <StudentCard
              v-for="student in paginatedStudents"
              :key="student.id"
              :student="student"
              :group-options="groupOptions"
              :progress-label="currentProgressLabel"
              @group-change="handleGroupChange"
              @whatsapp-click="handleWhatsAppClick"
              @progress-click="handleProgressClick"
              @score-click="handleAccumulatedLessonsClick"
              @notes-click="handleNotesClick"
              @name-click="handleStudentNameClick"
              @accumulated-lessons-click="handleAccumulatedLessonsClick"
            />
    </div>

    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <User :size="32" class="text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No students found</h3>
      <p class="text-gray-500">
        {{ searchQuery ? 'Try adjusting your search query' : 'No students available at the moment' }}
      </p>
    </div>

    <!-- Pagination -->
    <PaginationControls
      v-if="totalStudents > 0"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="totalStudents"
      @page-change="handlePageChange"
    />

    <!-- Student Profile Sidebar -->
    <StudentProfileSidebar
      :is-open="isProfileSidebarOpen"
      :student="selectedStudent"
      :parent="selectedStudent?.parent"
      :orders="selectedStudent?.orders || []"
      :educational-sections="[]"
      :labels="[]"
      @close="handleCloseSidebar"
      @save="handleSaveProfile"
    />

    <!-- Student Schedule Sidebar -->
    <StudentScheduleSidebar
      :is-open="isScheduleSidebarOpen"
      :student="selectedStudentForSchedule"
      @close="handleCloseScheduleSidebar"
    />

    <!-- Accumulated Lessons Sidebar -->
    <AccumulatedLessonsSidebar
      :is-visible="isAccumulatedLessonsSidebarOpen"
      :student="selectedStudentForAccumulatedLessons"
      @close="handleCloseAccumulatedLessonsSidebar"
      @accumulated-lessons-click="handleAccumulatedLessonsClick"
    />

    <!-- Notes & Activity Modal -->
    <StudentNotesModal
      :is-open="isNotesModalOpen"
      :student="currentNotesStudent"
      @close="closeNotesModal"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { User } from 'lucide-vue-next';
import {
  StudentCard,
  StudentListHeader,
  StudentListFilters,
  StudentCountDisplay,
  PaginationControls,
  ActiveFiltersDisplay,
  StudentScheduleSidebar,
  AccumulatedLessonsSidebar
} from './students';
import StudentProfileSidebar from './students/StudentProfileSidebar.vue';
import StudentNotesModal from './students/StudentNotesModal.vue';

const props = defineProps({
  selectedUnit: {
    type: Object,
    default: null
  },
  studentsResult: {
    type: Object,
    default: () => ({ data: [], paginatorInfo: {} })
  },
  loading: {
    type: Boolean,
    default: false
  },
  error: {
    type: Object,
    default: null
  },
  initialSearchQuery: {
     type: String,
     default: ''
  },
  initialExpired: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits([
  'search',
  'page-change',
  'filter-change',
  'sort-change',
  'filter-group', // Forwarding deprecated/specific events if needed
  'apply-filter'
]);

const handleRemoveFilter = (filterKey) => {
  if (filterKey === 'diamonds') filters.value.diamonds = null;
  if (filterKey === 'progress') filters.value.progress = null;
  if (filterKey === 'score') filters.value.score = null;
  if (filterKey === 'lessons') filters.value.lessons = null;
  if (filterKey === 'last-seen') filters.value['last-seen'] = null;
  if (filterKey === 'expired') filters.value.expired = false;
};

const handleClearAllFilters = () => {
    filters.value = {
        diamonds: null,
        progress: null,
        score: null,
        lessons: null,
        'last-seen': null,
        expired: false
    };
    searchQuery.value = ''; // Also clear search? Usually yes or no depending on UX. Let's keep search separate for now or clear it too if desired.
    // Actually typically clear all filters leaves search alone or clears it. Standard is clear filters.
};

const currentProgressLabel = computed(() => {
  if (selectedSubject.value) {
    const subject = subjectOptions.value.find(s => s.value === selectedSubject.value);
    if (subject) {
      return `${subject.label} Progress`;
    }
  }
  return 'Average Progress';
});

const handleSortClick = () => {
  isSortModalOpen.value = true;
};

const handleCloseSidebar = () => {
  isProfileSidebarOpen.value = false;
  selectedStudent.value = null;
};

const handleSaveProfile = (updatedStudent) => {
  // logic to update student in list
  console.log('Save profile', updatedStudent);
  // handleCloseSidebar();
};

const handleCloseScheduleSidebar = () => {
  isScheduleSidebarOpen.value = false;
  selectedStudentForSchedule.value = null;
};

const handleCloseAccumulatedLessonsSidebar = () => {
  isAccumulatedLessonsSidebarOpen.value = false;
  selectedStudentForAccumulatedLessons.value = null;
};



const handleGroupChange = (student, newGroup) => {
    // TODO: Implement group change logic
};

const handleWhatsAppClick = (student) => {
    window.open(`https://wa.me/${student.phone}`, '_blank');
};

const handleProgressClick = (student) => {
  if (student.averageProgress === null) {
    return;
  }
  selectedStudentForSchedule.value = student;
  isScheduleSidebarOpen.value = true;
};

const handleScoreClick = (student) => {
    // TODO: Show score history
};

const handleNotesClick = (student) => {
  currentNotesStudent.value = student;
  isNotesModalOpen.value = true;
};

const closeNotesModal = () => {
  isNotesModalOpen.value = false;
  currentNotesStudent.value = null;
};

const handleStudentNameClick = (student) => {
    selectedStudent.value = student;
    isProfileSidebarOpen.value = true;
};

const handleAccumulatedLessonsClick = (student) => {
  if (student.accumulatedLessons === 0) {
    return;
  }
  selectedStudentForAccumulatedLessons.value = student;
  isAccumulatedLessonsSidebarOpen.value = true;
};

const handleFilterGroup = (group) => {
    selectedGroup.value = group;
};

const handleFilterSubject = (subject) => {
    selectedSubject.value = subject;
};

const unitName = computed(() => {
  return props.selectedUnit?.name || props.selectedUnit?.title || 'Unit';
});

// Sample students data - in a real app, this would come from an API
const students = ref([]);
const searchQuery = ref(props.initialSearchQuery);
const selectedGroup = ref('');
const selectedSubject = ref('');
const isProfileSidebarOpen = ref(false);
const selectedStudent = ref(null);
const isScheduleSidebarOpen = ref(false);
const selectedStudentForSchedule = ref(null);
const isAccumulatedLessonsSidebarOpen = ref(false);
const selectedStudentForAccumulatedLessons = ref(null);



// Notes modal state
const isNotesModalOpen = ref(false);
const currentNotesStudent = ref(null);

// Sorting options
const sortOptions = ref({
  progress: null,
  diamonds: null,
  lastSeen: null,
  dateAdded: null, // No default sorting
  expirationDate: null
});

// Filter options
const filters = ref({
  diamonds: null,
  progress: null,
  score: null,
  lessons: null,
  'last-seen': null,
  expired: props.initialExpired // Initialize with prop
});

// Determine if we are using backend data
const isBackendMode = computed(() => !props.error && props.studentsResult?.data);

// Pagination Helpers
const totalStudents = computed(() => {
   if (isBackendMode.value) return props.studentsResult?.paginatorInfo?.total || 0;
   return filteredStudents.value.length; 
});

const localPage = ref(1);
const localPageSize = ref(10);

const currentPage = computed({
  get: () => isBackendMode.value ? props.studentsResult?.paginatorInfo?.currentPage || 1 : localPage.value,
  set: (val) => {
    if (isBackendMode.value) {
      emit('page-change', val);
    } else {
      localPage.value = val;
    }
  }
});



const pageSize = computed(() => isBackendMode.value ? props.studentsResult?.paginatorInfo?.perPage || 10 : localPageSize.value);

// Compute dynamic filter options
const groupOptions = computed(() => {
  const groups = props.selectedUnit?.groups || [];
  return [
    ...groups.map(g => ({ value: g.name, label: g.name })),
    { value: 'Outside Group', label: 'Outside' }
  ];
});

// Subject options placeholder (requires backend support)
const subjectOptions = computed(() => {
  const subjects = props.selectedUnit?.education_section?.subjects || [];
  return subjects.map(s => ({ value: s.id, label: s.name }));
});

// Helper to map UI filter object to min/max values
const getFilterValues = (filterObj) => {
  if (!filterObj) return { min: null, max: null };
  const { type, value, min, max } = filterObj;
  
  if (type === 'more-than') return { min: value, max: null };
  if (type === 'less-than') return { min: null, max: value };
  if (type === 'between') return { min, max };
  return { min: null, max: null };
};

// Sync filters to backend
watch([searchQuery, selectedGroup, selectedSubject, filters, sortOptions], () => {
  if (isBackendMode.value) {
    const diamonds = getFilterValues(filters.value.diamonds);
    const progress = getFilterValues(filters.value.progress);
    const score = getFilterValues(filters.value.score);

    // Map "Last Seen" filter which is in "days ago"
    let lastSeenAfter = null;
    let lastSeenBefore = null;
    const lastSeen = filters.value['last-seen'];
    
    if (lastSeen) {
        const getDateDaysAgo = (days) => {
            const date = new Date();
            date.setDate(date.getDate() - days);
            // Format as YYYY-MM-DD HH:mm:ss for Laravel
            return date.toISOString().slice(0, 19).replace('T', ' '); 
        };

        if (lastSeen.type === 'less-than') {
            // "Less than 5 days ago" -> Recent -> last_seen >= (Now - 5 days)
            lastSeenAfter = getDateDaysAgo(lastSeen.value);
        } else if (lastSeen.type === 'more-than') {
            // "More than 5 days ago" -> Old -> last_seen <= (Now - 5 days)
            lastSeenBefore = getDateDaysAgo(lastSeen.value);
        } else if (lastSeen.type === 'between') {
            // "Between 5 and 10 days ago"
            // More recent bound (min days ago) -> Before (Now - 5)
            // Older bound (max days ago) -> After (Now - 10)
            // Wait, logic check:
            // "Between 2 and 5 days" means: 2 days ago >= last_seen >= 5 days ago?
            // Usually means last_seen is between (Now - 5) and (Now - 2).
            // So last_seen >= (Now - 5) AND last_seen <= (Now - 2).
            lastSeenAfter = getDateDaysAgo(lastSeen.max); // 5 days ago
            lastSeenBefore = getDateDaysAgo(lastSeen.min); // 2 days ago
        }
    }

    emit('filter-change', {
      search: searchQuery.value,
      group_name: selectedGroup.value || null,
      subject_id: selectedSubject.value || null,
      diamonds_min: diamonds.min,
      diamonds_max: diamonds.max,
      progress_min: progress.min,
      progress_max: progress.max,
      score_min: score.min,
      score_max: score.max,
      lessons_min: filters.value.lessons?.value || filters.value.lessons?.min, // Simple fallback for now
      last_seen_after: lastSeenAfter,
      last_seen_before: lastSeenBefore,
      expired: filters.value.expired,
      // Map other filters...
      // Sort
      // dateAdded: sortOptions.value.dateAdded
    });
    // Reset page handled by parent usually, but handlers here set currentPage = 1.
    // If currentPage is writable computed, `currentPage.value = 1` calls setter -> emits page-change(1).
  }
}, { deep: true });


const activeFilter = computed(() => {
  // Return the first active filter type for UI highlighting
  if (filters.value.diamonds) {
    return 'diamonds';
  }
  if (filters.value.progress) {
    return 'progress';
  }
  if (filters.value.score) {
    return 'score';
  }
  if (filters.value.lessons) {
    return 'lessons';
  }
  if (filters.value['last-seen']) {
    return 'last-seen';
  }
  return '';
});



// Helper function to parse last active time to days
const parseLastActive = (lastActive) => {
  if (lastActive.includes('hour')) {
    return parseFloat(lastActive) / 24;
  } else if (lastActive.includes('day')) {
    return parseFloat(lastActive);
  } else if (lastActive.includes('days')) {
    return parseFloat(lastActive);
  } else if (lastActive.includes('minutes')) {
    return parseFloat(lastActive) / (24 * 60);
  }
  return 0;
};

// Helper to check if a value matches a filter
const matchesFilter = (value, filter) => {
  if (!filter) return true;
  
  if (filter.type === 'more-than') {
    return value > filter.value;
  } else if (filter.type === 'less-than') {
    return value < filter.value;
  } else if (filter.type === 'between') {
    return value >= filter.min && value <= filter.max;
  }
  return true;
};

// Filtered and sorted students
const filteredStudents = computed(() => {
  let result = [...students.value];

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    result = result.filter(student =>
      student.name.toLowerCase().includes(query) ||
      student.phone.includes(query)
    );
  }

  // Group filter
  if (selectedGroup.value) {
    result = result.filter(student => student.group === selectedGroup.value);
  }

  // Subject filter (placeholder - would need subject data)
  // if (selectedSubject.value) {
  //   result = result.filter(student => student.subjects?.includes(selectedSubject.value));
  // }

  // Apply filters
  if (filters.value.diamonds) {
    result = result.filter(student => matchesFilter(student.diamondPoints, filters.value.diamonds));
  }
  if (filters.value.progress) {
    result = result.filter(student => matchesFilter(student.averageProgress || 0, filters.value.progress));
  }
  if (filters.value.lessons) {
    result = result.filter(student => matchesFilter(student.accumulatedLessons || 0, filters.value.lessons));
  }
  if (filters.value['last-seen']) {
    const filter = filters.value['last-seen'];
    result = result.filter(student => {
      const days = parseLastActive(student.lastActive);
      return matchesFilter(days, filter);
    });
  }

  // Multi-criteria sorting
  result.sort((a, b) => {
    // Priority 1: Progress
    if (sortOptions.value.progress) {
      const comparison = (a.averageProgress || 0) - (b.averageProgress || 0);
      if (comparison !== 0) {
        return sortOptions.value.progress === 'high-to-low' ? -comparison : comparison;
      }
    }
    
    // Priority 2: Diamonds
    if (sortOptions.value.diamonds) {
      const comparison = a.diamondPoints - b.diamondPoints;
      if (comparison !== 0) {
        return sortOptions.value.diamonds === 'high-to-low' ? -comparison : comparison;
      }
    }
    
    // Priority 3: Last Seen
    if (sortOptions.value.lastSeen) {
      const aDays = parseLastActive(a.lastActive);
      const bDays = parseLastActive(b.lastActive);
      const comparison = aDays - bDays;
      if (comparison !== 0) {
        return sortOptions.value.lastSeen === 'most-recent' ? comparison : -comparison;
      }
    }
    
    // Priority 4: Date Added
    if (sortOptions.value.dateAdded) {
      const aDate = new Date(a.dateAdded || 0);
      const bDate = new Date(b.dateAdded || 0);
      const comparison = aDate - bDate;
      if (comparison !== 0) {
        return sortOptions.value.dateAdded === 'newest-first' ? -comparison : comparison;
      }
    }
    
    // Priority 5: Expiration Date
    if (sortOptions.value.expirationDate) {
      const aDate = new Date(a.expirationDate || 0);
      const bDate = new Date(b.expirationDate || 0);
      const comparison = aDate - bDate;
      if (comparison !== 0) {
        return sortOptions.value.expirationDate === 'newest-expired' ? -comparison : comparison;
      }
    }
    
    // Default: sort by name
    return a.name.localeCompare(b.name);
  });

  return result;
});

// Paginated students
const paginatedStudents = computed(() => {
  if (isBackendMode.value) {
    return props.studentsResult.data || [];
  }
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredStudents.value.slice(start, end);
});

// Event handlers
const handleSearch = (query) => {
  searchQuery.value = query;
  currentPage.value = 1;
};

const handleApplySort = (newSortOptions) => {
  sortOptions.value = { ...newSortOptions };
  emit('sort-change', newSortOptions);
  currentPage.value = 1;
};

const handleApplyFilter = ({ filterType, filterData }) => {
  if (filterType && filterData !== undefined) {
    filters.value[filterType] = filterData;
    currentPage.value = 1;
  }
};


</script>

