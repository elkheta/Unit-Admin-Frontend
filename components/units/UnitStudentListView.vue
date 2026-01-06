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
      v-if="filteredStudents.length > 0"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="filteredStudents.length"
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
      :accumulated-lessons="accumulatedLessonsData"
      @close="handleCloseAccumulatedLessonsSidebar"
      @go-to-schedule="handleGoToScheduleFromAccumulated"
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
  ActiveFiltersDisplay,
  StudentScheduleSidebar,
  AccumulatedLessonsSidebar
} from './students';
import StudentProfileSidebar from './students/StudentProfileSidebar.vue';

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
const isProfileSidebarOpen = ref(false);
const selectedStudent = ref(null);
const isScheduleSidebarOpen = ref(false);
const selectedStudentForSchedule = ref(null);
const isAccumulatedLessonsSidebarOpen = ref(false);
const selectedStudentForAccumulatedLessons = ref(null);

// Accumulated lessons data for each student
const accumulatedLessonsData = computed(() => {
  if (!selectedStudentForAccumulatedLessons.value) return [];
  
  const studentId = selectedStudentForAccumulatedLessons.value.id;
  
  // Sample accumulated lessons data - in a real app, this would come from an API
  const lessonsMap = {
    1: [ // Ahmed Hassan
      {
        subject: 'الرياضيات - التفاضل',
        day: 'الخميس',
        date: '13 ديسمبر',
        progress: 32
      },
      {
        subject: 'اللغة العربية - البلاغة',
        day: 'الثلاثاء',
        date: '11 ديسمبر',
        progress: 15
      },
      {
        subject: 'الفيزياء - الكهرباء',
        day: 'الاثنين',
        date: '10 ديسمبر',
        progress: 80
      }
    ],
    2: [ // Sara Ahmed
      {
        subject: 'الكيمياء - العضوية',
        day: 'الأربعاء',
        date: '12 ديسمبر',
        progress: 90
      }
    ],
    // Add more students as needed
  };
  
  return lessonsMap[studentId] || [];
});

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
  if (filters.value.diamonds) {
    return 'diamonds';
  }
  if (filters.value.progress) {
    return 'progress';
  }
  if (filters.value.lessons) {
    return 'lessons';
  }
  if (filters.value['last-seen']) {
    return 'last-seen';
  }
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
    accumulatedLessons: 120,
    accumulatedProgress: 17,
    orders: [
      {
        id: 1,
        productName: 'Grade 9 Complete',
        price: '179 EGP',
        status: 'Active',
        paidAt: 'Sep 5, 2025',
        expires: 'Jan 5, 2026',
        timeLeft: '1 month left'
      }
    ],
    schedule: [
      {
        date: '2024-12-08',
        dailyProgress: 78,
        subjects: [
          {
            id: 1,
            subjectName: 'الرياضيات',
            partName: 'الجبر',
            progress: 85,
            exercises: [
              { id: 1, title: 'واجب الحصة الأولى', duration: 180, date: '26 August', score: 1 },
              { id: 2, title: 'اختبار الحصة الأولى', duration: 97, date: '26 August', score: 100 }
            ],
            videos: [
              { id: 1, title: 'شرح - ج - موقع وطننا العربي', duration: 3, completed: true }
            ]
          },
          {
            id: 2,
            subjectName: 'الفيزياء',
            partName: 'الحركة',
            progress: 72,
            exercises: [
              { id: 3, title: 'اختبار الحصة الأولى', duration: 97, date: '26 August', score: 100 },
              { id: 4, title: 'اختبار الحصة الأولى', duration: 45, date: '26 August', score: 96 },
              { id: 5, title: 'اختبار الحصة الأولى', duration: 1, date: '26 August', score: 100 },
              { id: 6, title: 'اختبار الحصة الأولى', duration: 97, date: '26 August', score: 90 },
              { id: 7, title: 'اختبار الحصة الأولى', duration: 97, date: '26 August', score: 90 }
            ],
            videos: [
              { id: 2, title: 'شرح - ج - موقع وطننا العربي', duration: 3, completed: true },
              { id: 3, title: 'أهم أسئلة الكتب الخارجية', duration: 33, completed: true }
            ]
          },
          {
            id: 3,
            subjectName: 'اللغة العربية',
            partName: 'النحو',
            progress: 90,
            exercises: [],
            videos: []
          }
        ]
      },
      {
        date: '2024-12-09',
        dailyProgress: 65,
        subjects: [
          {
            id: 4,
            subjectName: 'الكيمياء',
            partName: 'التفاعلات',
            progress: 45,
            exercises: [],
            videos: []
          },
          {
            id: 5,
            subjectName: 'اللغة الإنجليزية',
            partName: 'القراءة',
            progress: 80,
            exercises: [],
            videos: []
          },
          {
            id: 6,
            subjectName: 'التاريخ',
            partName: 'العصر الإسلامي',
            progress: 70,
            exercises: [],
            videos: []
          }
        ]
      },
      {
        date: '2024-12-11',
        dailyProgress: 55,
        subjects: [
          {
            id: 7,
            subjectName: 'الفيزياء',
            partName: 'الكهرباء',
            progress: 60,
            exercises: [],
            videos: []
          },
          {
            id: 8,
            subjectName: 'اللغة الفرنسية',
            partName: 'المحادثة',
            progress: 50,
            exercises: [],
            videos: []
          }
        ]
      },
      {
        date: '2024-12-14',
        dailyProgress: 0,
        isHoliday: true
      }
    ]
  },
  {
    id: 2,
    name: 'Dina Sayed',
    phone: '+201456789012',
    averageProgress: 68,
    score: 4,
    diamondPoints: 28,
    lastActive: '2 days',
    status: 'Active',
    group: 'group-b',
    performance: 'At Risk',
    dateAdded: '2024-02-20',
    expirationDate: '2025-01-15',
    accumulatedLessons: 95,
    accumulatedProgress: 40,
    daysToExpire: 39,
    email: 'dina.sayed@example.com',
    governorate: 'cairo',
    hobbies: ['Reading', 'Music'],
    weakestSubjects: ['Mathematics'],
    preferredSubjects: ['English', 'Science'],
    labels: ['VIP', 'New'],
    educationalSection: 'الأول الثانوى لغات',
    secondLanguage: 'French',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '11/24/2025, 11:51:23 AM',
    parent: {
      id: 1,
      name: 'Dina Sayed',
      phone: '+201456789012',
      notes: ''
    },
    orders: [
      {
        id: 1,
        productName: 'S3 - Arabic Bundle',
        price: '250 EGP',
        status: 'Active',
        paidAt: 'Oct 10, 2024',
        expires: 'Feb 10, 2025',
        timeLeft: '2 months left'
      }
    ]
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
    accumulatedLessons: 180,
    accumulatedProgress: 60,
    daysToExpire: 60,
    email: 'mohamed.ali@example.com',
    governorate: 'alexandria',
    hobbies: ['Sports', 'Programming'],
    weakestSubjects: [],
    preferredSubjects: ['Mathematics', 'Physics', 'Chemistry'],
    labels: ['Excellent'],
    educationalSection: 'الثالث الثانوى علمي علوم',
    secondLanguage: 'English',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/13/2024, 14:30:45 PM',
    parent: {
      id: 3,
      name: 'Ali Mohamed',
      phone: '+201555444335',
      notes: ''
    },
    orders: [
      {
        id: 1,
        productName: 'Complete Science Package',
        price: '320 EGP',
        status: 'Active',
        paidAt: 'Nov 1, 2024',
        expires: 'Mar 1, 2025',
        timeLeft: '3 months left'
      },
      {
        id: 2,
        productName: 'Math Advanced',
        price: '150 EGP',
        status: 'Active',
        paidAt: 'Dec 15, 2024',
        expires: 'Jun 15, 2025',
        timeLeft: '5 months left'
      }
    ]
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
    accumulatedLessons: 150,
    accumulatedProgress: 25,
    daysToExpire: 15,
    email: 'sara.ahmed@example.com',
    governorate: 'giza',
    hobbies: ['Reading', 'Art'],
    weakestSubjects: ['Physics'],
    preferredSubjects: ['English', 'Biology'],
    labels: ['New'],
    educationalSection: 'الثاني الثانوى عام',
    secondLanguage: 'French',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/13/2024, 10:15:30 AM',
    parent: {
      id: 4,
      name: 'Ahmed Sayed',
      phone: '+201555444336',
      notes: ''
    },
    orders: [
      {
        id: 1,
        productName: 'English Language Course',
        price: '200 EGP',
        status: 'Active',
        paidAt: 'Aug 20, 2024',
        expires: 'Dec 20, 2024',
        timeLeft: 'Expired'
      }
    ]
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
    accumulatedLessons: 45,
    accumulatedProgress: 25,
    daysToExpire: 0,
    email: 'omar.khaled@example.com',
    governorate: 'sharqia',
    hobbies: [],
    weakestSubjects: ['Mathematics', 'English'],
    preferredSubjects: [],
    labels: ['Warning'],
    educationalSection: 'الأول الثانوى عام',
    secondLanguage: 'English',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/03/2024, 08:20:10 AM',
    parent: {
      id: 5,
      name: 'Khaled Ibrahim',
      phone: '+201555444337',
      notes: 'Needs extra support'
    },
    orders: []
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
    accumulatedLessons: 135,
    accumulatedProgress: 25,
    daysToExpire: 38,
    email: 'fatma.mahmoud@example.com',
    governorate: 'dakahlia',
    hobbies: ['Music', 'Dancing'],
    weakestSubjects: ['Chemistry'],
    preferredSubjects: ['Biology', 'Arabic'],
    labels: [],
    educationalSection: 'الثاني الثانوى علمي',
    secondLanguage: 'French',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/13/2024, 07:45:20 AM',
    parent: {
      id: 6,
      name: 'Mahmoud Hassan',
      phone: '+201555444338',
      notes: ''
    },
    orders: [
      {
        id: 1,
        productName: 'Biology Course',
        price: '180 EGP',
        status: 'Active',
        paidAt: 'Sep 12, 2024',
        expires: 'Jan 12, 2025',
        timeLeft: '2 weeks left'
      }
    ]
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
    accumulatedLessons: 165,
    accumulatedProgress: 25,
    daysToExpire: 78,
    email: 'youssef.ibrahim@example.com',
    governorate: 'cairo',
    hobbies: ['Sports', 'Gaming'],
    weakestSubjects: [],
    preferredSubjects: ['Mathematics', 'Physics'],
    labels: ['Excellent', 'VIP'],
    educationalSection: 'الثالث الثانوى علمي رياضة',
    secondLanguage: 'English',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/13/2024, 13:20:15 PM',
    parent: {
      id: 7,
      name: 'Ibrahim Youssef',
      phone: '+201555444339',
      notes: ''
    },
    orders: [
      {
        id: 1,
        productName: 'Physics Advanced',
        price: '220 EGP',
        status: 'Active',
        paidAt: 'Oct 5, 2024',
        expires: 'Apr 5, 2025',
        timeLeft: '4 months left'
      }
    ]
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
    accumulatedLessons: 100,
    accumulatedProgress: 25,
    daysToExpire: 7,
    email: 'nour.eldin@example.com',
    governorate: 'beheira',
    hobbies: ['Reading'],
    weakestSubjects: ['Mathematics', 'Physics'],
    preferredSubjects: ['Arabic'],
    labels: [],
    educationalSection: 'الأول الثانوى عام',
    secondLanguage: 'English',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/12/2024, 16:30:00 PM',
    parent: {
      id: 8,
      name: 'El-Din Nour',
      phone: '+201555444340',
      notes: ''
    },
    orders: [
      {
        id: 1,
        productName: 'Chemistry Basics',
        price: '160 EGP',
        status: 'Active',
        paidAt: 'Jul 8, 2024',
        expires: 'Nov 8, 2024',
        timeLeft: 'Expired'
      }
    ]
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
    accumulatedLessons: 200,
    accumulatedProgress: 25,
    daysToExpire: 92,
    email: 'mariam.farid@example.com',
    governorate: 'cairo',
    hobbies: ['Reading', 'Writing', 'Art'],
    weakestSubjects: [],
    preferredSubjects: ['Mathematics', 'Physics', 'Chemistry', 'Biology'],
    labels: ['Excellent', 'VIP'],
    educationalSection: 'الثالث الثانوى علمي علوم',
    secondLanguage: 'French',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/13/2024, 15:45:30 PM',
    parent: {
      id: 9,
      name: 'Farid Mariam',
      phone: '+201555444341',
      notes: 'Very engaged parent'
    },
    orders: [
      {
        id: 1,
        productName: 'Premium Package',
        price: '450 EGP',
        status: 'Active',
        paidAt: 'Nov 20, 2024',
        expires: 'May 20, 2025',
        timeLeft: '6 months left'
      },
      {
        id: 2,
        productName: 'Math Special',
        price: '180 EGP',
        status: 'Active',
        paidAt: 'Dec 1, 2024',
        expires: 'Jun 1, 2025',
        timeLeft: '6 months left'
      }
    ]
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
    accumulatedLessons: 60,
    accumulatedProgress: 25,
    daysToExpire: 0,
    email: 'khaled.samir@example.com',
    governorate: 'monufia',
    hobbies: [],
    weakestSubjects: ['Mathematics', 'English', 'Science'],
    preferredSubjects: [],
    labels: ['Warning'],
    educationalSection: 'الأول الثانوى عام',
    secondLanguage: 'English',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/08/2024, 09:10:00 AM',
    parent: {
      id: 10,
      name: 'Samir Khaled',
      phone: '+201555444342',
      notes: 'Needs follow-up'
    },
    orders: []
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
    accumulatedLessons: 170,
    accumulatedProgress: 25,
    daysToExpire: 58,
    email: 'layla.mohamed@example.com',
    governorate: 'giza',
    hobbies: ['Photography', 'Art'],
    weakestSubjects: [],
    preferredSubjects: ['English', 'History'],
    labels: ['Excellent'],
    educationalSection: 'الثاني الثانوى لغات',
    secondLanguage: 'French',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/13/2024, 11:30:00 AM',
    parent: {
      id: 11,
      name: 'Mohamed Layla',
      phone: '+201555444343',
      notes: ''
    },
    orders: [
      {
        id: 1,
        productName: 'Arabic Literature',
        price: '140 EGP',
        status: 'Active',
        paidAt: 'Sep 15, 2024',
        expires: 'Jan 15, 2025',
        timeLeft: '1 month left'
      }
    ]
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
    accumulatedLessons: 110,
    accumulatedProgress: 25,
    daysToExpire: 0,
    email: 'hassan.mostafa@example.com',
    governorate: 'qalyubia',
    hobbies: ['Sports'],
    weakestSubjects: ['English'],
    preferredSubjects: ['Mathematics'],
    labels: [],
    educationalSection: 'الأول الثانوى عام',
    secondLanguage: 'English',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/10/2024, 14:20:00 PM',
    parent: {
      id: 12,
      name: 'Mostafa Hassan',
      phone: '+201555444344',
      notes: ''
    },
    orders: [
      {
        id: 1,
        productName: 'History Course',
        price: '120 EGP',
        status: 'Active',
        paidAt: 'Aug 25, 2024',
        expires: 'Dec 25, 2024',
        timeLeft: 'Expired'
      }
    ]
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
    accumulatedLessons: 190,
    accumulatedProgress: 25,
    daysToExpire: 76,
    email: 'zeinab.ali@example.com',
    governorate: 'cairo',
    hobbies: ['Reading', 'Music', 'Writing'],
    weakestSubjects: [],
    preferredSubjects: ['Mathematics', 'Physics', 'Chemistry'],
    labels: ['Excellent', 'VIP'],
    educationalSection: 'الثالث الثانوى علمي علوم',
    secondLanguage: 'English',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/13/2024, 14:50:00 PM',
    parent: {
      id: 13,
      name: 'Ali Zeinab',
      phone: '+201555444345',
      notes: ''
    },
    orders: [
      {
        id: 1,
        productName: 'Complete Bundle',
        price: '380 EGP',
        status: 'Active',
        paidAt: 'Oct 1, 2024',
        expires: 'Apr 1, 2025',
        timeLeft: '4 months left'
      }
    ]
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
    accumulatedLessons: 50,
    accumulatedProgress: 25,
    daysToExpire: 0,
    email: 'tamer.hosny@example.com',
    governorate: 'gharbia',
    hobbies: [],
    weakestSubjects: ['Mathematics', 'English', 'Science', 'Arabic'],
    preferredSubjects: [],
    labels: ['Warning'],
    educationalSection: 'الأول الثانوى عام',
    secondLanguage: 'English',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/06/2024, 10:00:00 AM',
    parent: {
      id: 14,
      name: 'Hosny Tamer',
      phone: '+201555444346',
      notes: 'Student needs intervention'
    },
    orders: []
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
    accumulatedLessons: 140,
    accumulatedProgress: 25,
    daysToExpire: 23,
    email: 'rania.kamel@example.com',
    governorate: 'kafr-elsheikh',
    hobbies: ['Cooking', 'Reading'],
    weakestSubjects: ['Physics'],
    preferredSubjects: ['Biology', 'Chemistry'],
    labels: ['New'],
    educationalSection: 'الثاني الثانوى علمي',
    secondLanguage: 'French',
    religionLanguage: 'التربية الدينية الإسلامية',
    lastSeenTimestamp: '12/13/2024, 09:15:00 AM',
    parent: {
      id: 15,
      name: 'Kamel Rania',
      phone: '+201555444347',
      notes: ''
    },
    orders: [
      {
        id: 1,
        productName: 'Geography Course',
        price: '130 EGP',
        status: 'Active',
        paidAt: 'Sep 10, 2024',
        expires: 'Jan 10, 2025',
        timeLeft: '2 weeks left'
      }
    ]
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
  selectedStudentForSchedule.value = student;
  isScheduleSidebarOpen.value = true;
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

const handleStudentNameClick = (student) => {
  // eslint-disable-next-line no-console
  console.log('Student name clicked:', student.name);
  selectedStudent.value = student;
  isProfileSidebarOpen.value = true;
  // eslint-disable-next-line no-console
  console.log('Sidebar should be open:', isProfileSidebarOpen.value);
};

const handleCloseSidebar = () => {
  isProfileSidebarOpen.value = false;
  selectedStudent.value = null;
};

const handleCloseScheduleSidebar = () => {
  isScheduleSidebarOpen.value = false;
  selectedStudentForSchedule.value = null;
};

const handleAccumulatedLessonsClick = (student) => {
  selectedStudentForAccumulatedLessons.value = student;
  isAccumulatedLessonsSidebarOpen.value = true;
};

const handleCloseAccumulatedLessonsSidebar = () => {
  isAccumulatedLessonsSidebarOpen.value = false;
  selectedStudentForAccumulatedLessons.value = null;
};

const handleGoToScheduleFromAccumulated = (student) => {
  // Close accumulated lessons sidebar and open schedule sidebar
  isAccumulatedLessonsSidebarOpen.value = false;
  selectedStudentForAccumulatedLessons.value = null;
  selectedStudentForSchedule.value = student;
  isScheduleSidebarOpen.value = true;
};

const handleSaveProfile = (data) => {
  // Save profile changes
  if (selectedStudent.value) {
    // Update student data
    const student = students.value.find(s => s.id === selectedStudent.value.id);
    if (student) {
      student.specialNotes = data.specialNotes;
    }
  }
  // eslint-disable-next-line no-console
  console.log('Profile saved:', data);
};
</script>

