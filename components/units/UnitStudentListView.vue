<template>
  <div class="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
    <!-- Page Header -->
    <StudentListHeader :unit-name="unitName" />

    <!-- Search and Filters -->
    <StudentListFilters
      :active-filter="activeFilter"
      :current-sort-options="sortOptions"
      :current-filters="filters"
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
      :total="filteredStudents.length"
    />

    <!-- Students List -->
    <div v-if="filteredStudents.length > 0" class="space-y-2">
      <StudentCard
        v-for="student in paginatedStudents"
        :key="student.id"
        :student="student"
        @group-change="handleGroupChange"
        @whatsapp-click="handleWhatsAppClick"
        @progress-click="handleProgressClick"
        @score-click="handleScoreClick"
        @notes-click="handleNotesClick"
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
      v-if="filteredStudents.length > 0"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="filteredStudents.length"
      @page-change="handlePageChange"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { User } from 'lucide-vue-next';
import {
  StudentCard,
  StudentListHeader,
  StudentListFilters,
  StudentCountDisplay,
  PaginationControls,
  ActiveFiltersDisplay
} from './students';

const props = defineProps({
  selectedUnit: {
    type: Object,
    default: null
  }
});

const unitName = computed(() => {
  return props.selectedUnit?.name || props.selectedUnit?.title || 'Unit';
});

// Sample students data - in a real app, this would come from an API
const students = ref([]);
const searchQuery = ref('');
const selectedGroup = ref('');
const selectedSubject = ref('');
const currentPage = ref(1);
const pageSize = ref(10);

// Sorting options
const sortOptions = ref({
  progress: null,
  diamonds: null,
  lastSeen: null,
  dateAdded: 'newest-first', // Default
  expirationDate: null
});

// Filter options
const filters = ref({
  diamonds: null,
  progress: null,
  lessons: null,
  'last-seen': null
});

const activeFilter = computed(() => {
  // Return the first active filter type for UI highlighting
  if (filters.value.diamonds) return 'diamonds';
  if (filters.value.progress) return 'progress';
  if (filters.value.lessons) return 'lessons';
  if (filters.value['last-seen']) return 'last-seen';
  return '';
});

// Sample data - in a real app, this would come from an API
const sampleStudents = [
  {
    id: 1,
    name: 'Ahmed Hassan',
    phone: '+201555444333',
    averageProgress: 72,
    score: 17,
    diamondPoints: 45,
    lastActive: '1 day',
    status: 'Active',
    group: 'group-a',
    performance: 'Good',
    dateAdded: '2024-01-15',
    expirationDate: '2024-12-31',
    accumulatedLessons: 120
  },
  {
    id: 2,
    name: 'Dina Sayed',
    phone: '+201555444334',
    averageProgress: 68,
    score: 4,
    diamondPoints: 28,
    lastActive: '2 days',
    status: 'Active',
    group: 'group-b',
    performance: 'At Risk',
    dateAdded: '2024-02-20',
    expirationDate: '2025-01-15',
    accumulatedLessons: 95
  },
  {
    id: 3,
    name: 'Mohamed Ali',
    phone: '+201555444335',
    averageProgress: 91,
    score: 100,
    diamondPoints: 88,
    lastActive: '1 hour',
    status: 'Active',
    group: 'group-a',
    performance: 'Excellent',
    dateAdded: '2024-03-10',
    expirationDate: '2025-02-28',
    accumulatedLessons: 180
  },
  {
    id: 4,
    name: 'Sara Ahmed',
    phone: '+201555444336',
    averageProgress: 82,
    score: 75,
    diamondPoints: 62,
    lastActive: '3 hours',
    status: 'Active',
    group: 'group-b',
    performance: 'Good',
    dateAdded: '2024-01-25',
    expirationDate: '2024-11-30',
    accumulatedLessons: 150
  },
  {
    id: 5,
    name: 'Omar Khaled',
    phone: '+201555444337',
    averageProgress: 35,
    score: 20,
    diamondPoints: 5,
    lastActive: '10 days',
    status: 'Inactive',
    group: 'outside',
    performance: 'At Risk',
    dateAdded: '2023-12-01',
    expirationDate: '2024-10-15',
    accumulatedLessons: 45
  },
  {
    id: 6,
    name: 'Fatma Mahmoud',
    phone: '+201555444338',
    averageProgress: 78,
    score: 65,
    diamondPoints: 55,
    lastActive: '5 hours',
    status: 'Active',
    group: 'group-a',
    performance: 'Good',
    dateAdded: '2024-02-05',
    expirationDate: '2025-01-20',
    accumulatedLessons: 135
  },
  {
    id: 7,
    name: 'Youssef Ibrahim',
    phone: '+201555444339',
    averageProgress: 85,
    score: 88,
    diamondPoints: 72,
    lastActive: '2 hours',
    status: 'Active',
    group: 'group-b',
    performance: 'Excellent',
    dateAdded: '2024-03-15',
    expirationDate: '2025-03-01',
    accumulatedLessons: 165
  },
  {
    id: 8,
    name: 'Nour El-Din',
    phone: '+201555444340',
    averageProgress: 60,
    score: 45,
    diamondPoints: 35,
    lastActive: '1 day',
    status: 'Active',
    group: 'group-a',
    performance: 'Good',
    dateAdded: '2024-01-10',
    expirationDate: '2024-12-20',
    accumulatedLessons: 100
  },
  {
    id: 9,
    name: 'Mariam Farid',
    phone: '+201555444341',
    averageProgress: 95,
    score: 98,
    diamondPoints: 95,
    lastActive: '30 minutes',
    status: 'Active',
    group: 'group-b',
    performance: 'Excellent',
    dateAdded: '2024-04-01',
    expirationDate: '2025-03-15',
    accumulatedLessons: 200
  },
  {
    id: 10,
    name: 'Khaled Samir',
    phone: '+201555444342',
    averageProgress: 50,
    score: 35,
    diamondPoints: 25,
    lastActive: '5 days',
    status: 'Active',
    group: 'group-a',
    performance: 'At Risk',
    dateAdded: '2023-11-20',
    expirationDate: '2024-09-30',
    accumulatedLessons: 60
  },
  {
    id: 11,
    name: 'Layla Mohamed',
    phone: '+201555444343',
    averageProgress: 88,
    score: 82,
    diamondPoints: 70,
    lastActive: '4 hours',
    status: 'Active',
    group: 'group-b',
    performance: 'Excellent',
    dateAdded: '2024-02-28',
    expirationDate: '2025-02-10',
    accumulatedLessons: 170
  },
  {
    id: 12,
    name: 'Hassan Mostafa',
    phone: '+201555444344',
    averageProgress: 65,
    score: 55,
    diamondPoints: 40,
    lastActive: '3 days',
    status: 'Active',
    group: 'group-a',
    performance: 'Good',
    dateAdded: '2024-01-20',
    expirationDate: '2024-12-10',
    accumulatedLessons: 110
  },
  {
    id: 13,
    name: 'Zeinab Ali',
    phone: '+201555444345',
    averageProgress: 92,
    score: 90,
    diamondPoints: 85,
    lastActive: '1 hour',
    status: 'Active',
    group: 'group-b',
    performance: 'Excellent',
    dateAdded: '2024-03-20',
    expirationDate: '2025-02-28',
    accumulatedLessons: 190
  },
  {
    id: 14,
    name: 'Tamer Hosny',
    phone: '+201555444346',
    averageProgress: 40,
    score: 25,
    diamondPoints: 15,
    lastActive: '7 days',
    status: 'Inactive',
    group: 'outside',
    performance: 'At Risk',
    dateAdded: '2023-10-15',
    expirationDate: '2024-08-20',
    accumulatedLessons: 50
  },
  {
    id: 15,
    name: 'Rania Kamel',
    phone: '+201555444347',
    averageProgress: 75,
    score: 68,
    diamondPoints: 58,
    lastActive: '6 hours',
    status: 'Active',
    group: 'group-a',
    performance: 'Good',
    dateAdded: '2024-02-15',
    expirationDate: '2025-01-05',
    accumulatedLessons: 140
  }
];

onMounted(() => {
  // In a real app, fetch students from API
  students.value = sampleStudents;
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
    result = result.filter(student => matchesFilter(student.averageProgress, filters.value.progress));
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
      const comparison = a.averageProgress - b.averageProgress;
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
  currentPage.value = 1;
};

const handleFilterGroup = (group) => {
  selectedGroup.value = group;
  currentPage.value = 1;
};

const handleFilterSubject = (subject) => {
  selectedSubject.value = subject;
  currentPage.value = 1;
};

const handleApplyFilter = ({ filterType, filterData }) => {
  if (filterData && (filterData.value !== null || filterData.min !== null)) {
    filters.value[filterType] = filterData;
  } else {
    filters.value[filterType] = null;
  }
  currentPage.value = 1;
};

const handleRemoveFilter = (filterType) => {
  filters.value[filterType] = null;
  currentPage.value = 1;
};

const handleClearAllFilters = () => {
  filters.value = {
    diamonds: null,
    progress: null,
    lessons: null,
    'last-seen': null
  };
  currentPage.value = 1;
};

const handleGroupChange = ({ studentId, group }) => {
  const student = students.value.find(s => s.id === studentId);
  if (student) {
    student.group = group;
  }
};

const handlePageChange = (page) => {
  currentPage.value = page;
  // Scroll to top of list
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const handleWhatsAppClick = (student) => {
  // Already handled in StudentCard component
  // In a real app, this could trigger analytics or additional actions
  // eslint-disable-next-line no-console
  console.log('WhatsApp clicked for:', student.name);
};

const handleProgressClick = (student) => {
  // Navigate to student progress details or show modal
  // In a real app, this would navigate to a detailed progress page
  // eslint-disable-next-line no-console
  console.log('Progress clicked for:', student.name);
};

const handleScoreClick = (student) => {
  // Navigate to student score details or show modal
  // In a real app, this would navigate to a detailed score page
  // eslint-disable-next-line no-console
  console.log('Score clicked for:', student.name);
};

const handleNotesClick = (student) => {
  // Open notes modal or navigate to notes page
  // In a real app, this would open a notes modal or navigate to notes page
  // eslint-disable-next-line no-console
  console.log('Notes clicked for:', student.name);
};
</script>

