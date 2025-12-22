<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-40"
        @click="handleClose"
      />
    </Transition>

    <!-- Sidebar -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-4 flex-1">
              <button
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                @click="handleClose"
              >
                <X :size="20" class="text-gray-500" />
              </button>
              <BaseButton
                variant="primary"
                size="sm"
                :icon="Edit"
                @click="handleEditSchedule"
              >
                Edit Schedule
              </BaseButton>
              <div class="flex-1">
                <h2 class="text-xl font-bold text-gray-900 text-right">{{ student?.name || 'Student Schedule' }} - جدول الطالب</h2>
              </div>
            </div>
            <Calendar :size="20" class="text-gray-500 ml-4" />
          </div>
        </div>

        <!-- Week Navigation -->
        <div class="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
          <div class="flex items-center justify-between">
            <button
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              @click="handlePreviousWeek"
            >
              <ChevronLeft :size="20" class="text-gray-600" />
            </button>
            <div class="flex flex-col items-center">
              <span class="text-sm font-medium text-gray-700">{{ weekLabelArabic }}</span>
              <span class="text-xs text-gray-500 mt-1">{{ weekDateRangeArabic }}</span>
            </div>
            <button
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              @click="handleNextWeek"
            >
              <ChevronRight :size="20" class="text-gray-600" />
            </button>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <!-- Daily Cards -->
          <ScheduleDayCard
            v-for="day in weekDays"
            :key="day.date"
            :day="day"
            :is-today="day.isToday"
            @view-details="handleViewSubjectPartDetails"
          />

          <!-- Weekly Summary -->
          <WeeklySummarySection :summary="weeklySummary" />
        </div>
      </div>
    </Transition>

    <!-- Subject Part Details Sidebar -->
    <SubjectPartDetailsSidebar
      :is-open="isDetailsOpen"
      :subject-part="selectedSubjectPart"
      :day-info="selectedDayInfo"
      @close="handleCloseDetails"
    />
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { X, Calendar, Edit, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { BaseButton } from '../../../ui';
import ScheduleDayCard from './ScheduleDayCard.vue';
import WeeklySummarySection from './WeeklySummarySection.vue';
import SubjectPartDetailsSidebar from './SubjectPartDetailsSidebar.vue';
import { generateStudentSchedule } from './sampleScheduleData.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  student: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close']);

// Week navigation
const currentWeekOffset = ref(0);
const isDetailsOpen = ref(false);
const selectedSubjectPart = ref(null);
const selectedDayInfo = ref(null);

// Get current week dates (Arabic week starts Saturday)
const getWeekDates = (offset = 0) => {
  const today = new Date();
  const currentDay = today.getDay(); // 0 = Sunday, 6 = Saturday
  const startOfWeek = new Date(today);
  // Adjust to start from Saturday (Arabic week starts Saturday)
  // Saturday = 6, so we need to go back (currentDay - 6) days, or forward (7 - currentDay + 6) % 7
  const daysFromSaturday = (currentDay + 1) % 7; // Saturday = 0
  startOfWeek.setDate(today.getDate() - daysFromSaturday);
  startOfWeek.setDate(startOfWeek.getDate() + (offset * 7));

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + i);
    weekDays.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('ar-EG', { weekday: 'long' }),
      dayNameShort: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('ar-EG', { month: 'long' }),
      isToday: date.toDateString() === today.toDateString()
    });
  }
  return weekDays;
};

const weekDays = computed(() => {
  const days = getWeekDates(currentWeekOffset.value);
  
  // Get schedule data from student or generate sample data
  let scheduleData = props.student?.schedule || [];
  
  // If no schedule data exists or it's for a different week, generate sample data
  if (!scheduleData || scheduleData.length === 0) {
    scheduleData = generateStudentSchedule(props.student?.id || 1, currentWeekOffset.value);
  } else {
    // Check if we have data for the current week
    const hasCurrentWeekData = days.some(day => 
      scheduleData.some(s => s.date === day.date)
    );
    
    // If no data for current week, generate it
    if (!hasCurrentWeekData) {
      scheduleData = generateStudentSchedule(props.student?.id || 1, currentWeekOffset.value);
    }
  }
  
  // Map schedule data to days
  return days.map(day => {
    const daySchedule = scheduleData.find(s => s.date === day.date) || null;
    return {
      ...day,
      subjects: daySchedule?.subjects || [],
      dailyProgress: daySchedule?.dailyProgress || 0,
      isHoliday: daySchedule?.isHoliday || false
    };
  });
});

const weekLabel = computed(() => {
  if (currentWeekOffset.value === 0) {
    return 'This Week';
  }
  return currentWeekOffset.value < 0 ? `${Math.abs(currentWeekOffset.value)} weeks ago` : `In ${currentWeekOffset.value} weeks`;
});

const weekLabelArabic = computed(() => {
  if (currentWeekOffset.value === 0) {
    return 'هذا الأسبوع';
  }
  return currentWeekOffset.value < 0 
    ? `منذ ${Math.abs(currentWeekOffset.value)} أسبوع${Math.abs(currentWeekOffset.value) > 1 ? 'ات' : ''}`
    : `خلال ${currentWeekOffset.value} أسبوع${currentWeekOffset.value > 1 ? 'ات' : ''}`;
});

const weekDateRange = computed(() => {
  if (weekDays.value.length === 0) {
    return '';
  }
  const firstDay = weekDays.value[0];
  const lastDay = weekDays.value[6];
  const year = new Date(firstDay.date).getFullYear();
  // Format: "8 - 14 ديسمبر 2025"
  return `${firstDay.dayNumber} - ${lastDay.dayNumber} ${lastDay.month} ${year}`;
});

const weekDateRangeArabic = computed(() => {
  if (weekDays.value.length === 0) {
    return '';
  }
  const firstDay = weekDays.value[0];
  const lastDay = weekDays.value[6];
  const year = new Date(firstDay.date).getFullYear();
  // Format: "٨ - ١٤ ديسمبر ٢٠٢٥" (Arabic numerals)
  const toArabicNum = (num) => {
    const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
    return num.toString().split('').map(d => arabicNums[parseInt(d)]).join('');
  };
  return `${toArabicNum(firstDay.dayNumber)} - ${toArabicNum(lastDay.dayNumber)} ${lastDay.month} ${toArabicNum(year)}`;
});

const weeklySummary = computed(() => {
  const allSubjects = weekDays.value.flatMap(day => day.subjects || []);
  const completed = allSubjects.filter(s => s.progress >= 100).length;
  const total = allSubjects.length;
  const averageProgress = total > 0
    ? Math.round(allSubjects.reduce((sum, s) => sum + s.progress, 0) / total)
    : 0;
  // Use accumulated lessons from student or calculate from schedule
  const accumulated = props.student?.accumulatedLessons || allSubjects.length;

  return {
    averageProgress,
    completedLessons: `${completed} / ${total}`,
    accumulatedSessions: accumulated
  };
});

const handlePreviousWeek = () => {
  currentWeekOffset.value -= 1;
};

const handleNextWeek = () => {
  currentWeekOffset.value += 1;
};

const handleClose = () => {
  emit('close');
};

const handleEditSchedule = () => {
  if (props.student?.id) {
    window.open(`https://elkheta.org/students/${props.student.id}/schedule/edit`, '_blank');
  }
};

const handleViewSubjectPartDetails = (subjectPart, dayInfo) => {
  selectedSubjectPart.value = subjectPart;
  selectedDayInfo.value = dayInfo;
  isDetailsOpen.value = true;
};

const handleCloseDetails = () => {
  isDetailsOpen.value = false;
  selectedSubjectPart.value = null;
  selectedDayInfo.value = null;
};

// Reset week offset when sidebar opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    currentWeekOffset.value = 0;
  }
});
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from {
  transform: translateX(100%);
}

.slide-leave-to {
  transform: translateX(100%);
}
</style>

