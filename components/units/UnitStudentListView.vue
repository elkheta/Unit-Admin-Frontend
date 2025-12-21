<template>
  <div class="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
    <!-- Page Header -->
    <StudentListHeader :unit-name="unitName" />

    <!-- Search and Filters -->
    <StudentListFilters
      :active-filter="activeFilter"
      @search="handleSearch"
      @sort-toggle="handleSortToggle"
      @filter-group="handleFilterGroup"
      @filter-subject="handleFilterSubject"
      @filter-diamonds="handleFilterDiamonds"
      @filter-progress="handleFilterProgress"
      @filter-lessons="handleFilterLessons"
      @filter-last-seen="handleFilterLastSeen"
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
  PaginationControls
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
const sortOrder = ref('asc'); // 'asc' or 'desc'
const sortBy = ref('name'); // 'name', 'progress', 'diamonds', 'lessons', 'last-seen'
const activeFilter = ref(''); // 'diamonds', 'progress', 'lessons', 'last-seen'

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
    performance: 'Good'
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
    performance: 'At Risk'
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
    performance: 'Excellent'
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
    performance: 'Good'
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
    performance: 'At Risk'
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
    performance: 'Good'
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
    performance: 'Excellent'
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
    performance: 'Good'
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
    performance: 'Excellent'
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
    performance: 'At Risk'
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
    performance: 'Excellent'
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
    performance: 'Good'
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
    performance: 'Excellent'
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
    performance: 'At Risk'
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
    performance: 'Good'
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

  // Additional filters - apply only if a filter is active
  if (activeFilter.value === 'diamonds') {
    // Filter students with diamond points (show only those with diamonds)
    result = result.filter(student => student.diamondPoints > 0);
  } else if (activeFilter.value === 'progress') {
    // Filter students with progress (show only those with progress > 0)
    result = result.filter(student => student.averageProgress > 0);
  } else if (activeFilter.value === 'lessons') {
    // Filter by accumulated lessons (placeholder - would need lessons data)
    // For now, show all students as we don't have lessons data
    result = result;
  } else if (activeFilter.value === 'last-seen') {
    // Filter students seen in the last 7 days
    result = result.filter(student => parseLastActive(student.lastActive) <= 7);
  }

  // Sorting
  result.sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy.value) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'progress':
        comparison = a.averageProgress - b.averageProgress;
        break;
      case 'diamonds':
        comparison = a.diamondPoints - b.diamondPoints;
        break;
      case 'lessons':
        // Placeholder - would need lessons data
        comparison = 0;
        break;
      case 'last-seen':
        comparison = parseLastActive(a.lastActive) - parseLastActive(b.lastActive);
        break;
      default:
        comparison = 0;
    }
    
    return sortOrder.value === 'asc' ? comparison : -comparison;
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

const handleSortToggle = (ascending) => {
  sortOrder.value = ascending ? 'asc' : 'desc';
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

// Filter handlers - toggle filters on/off
const handleFilterDiamonds = () => {
  // Toggle diamonds filter
  if (activeFilter.value === 'diamonds') {
    activeFilter.value = '';
    sortBy.value = 'name'; // Reset to default sort
  } else {
    activeFilter.value = 'diamonds';
    sortBy.value = 'diamonds'; // Sort by diamonds when filtering
  }
  currentPage.value = 1;
};

const handleFilterProgress = () => {
  // Toggle progress filter
  if (activeFilter.value === 'progress') {
    activeFilter.value = '';
    sortBy.value = 'name'; // Reset to default sort
  } else {
    activeFilter.value = 'progress';
    sortBy.value = 'progress'; // Sort by progress when filtering
  }
  currentPage.value = 1;
};

const handleFilterLessons = () => {
  // Toggle lessons filter
  if (activeFilter.value === 'lessons') {
    activeFilter.value = '';
    sortBy.value = 'name'; // Reset to default sort
  } else {
    activeFilter.value = 'lessons';
    sortBy.value = 'lessons'; // Sort by lessons when filtering
  }
  currentPage.value = 1;
};

const handleFilterLastSeen = () => {
  // Toggle last seen filter
  if (activeFilter.value === 'last-seen') {
    activeFilter.value = '';
    sortBy.value = 'name'; // Reset to default sort
  } else {
    activeFilter.value = 'last-seen';
    sortBy.value = 'last-seen'; // Sort by last seen when filtering
  }
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

