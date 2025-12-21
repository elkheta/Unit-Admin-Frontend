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
          <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-3">
              <button
                class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                @click="handleClose"
              >
                <X :size="20" class="text-gray-500" />
              </button>
              <div>
                <h2 class="text-xl font-bold text-gray-900">{{ student?.name || 'Student Schedule' }}</h2>
                <div class="flex items-center gap-2 mt-1">
                  <Calendar :size="16" class="text-gray-500" />
                  <p class="text-sm text-gray-500">Student Schedule</p>
                </div>
              </div>
            </div>
            <BaseButton
              variant="primary"
              size="sm"
              :icon="Edit"
              @click="handleEditSchedule"
            >
              Edit Schedule
            </BaseButton>
          </div>
        </div>

        <!-- Week Navigation -->
        <div class="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center justify-between">
            <button
              class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              @click="handlePreviousWeek"
            >
              <ChevronLeft :size="20" class="text-gray-600" />
            </button>
            <div class="flex flex-col items-center">
              <span class="text-sm font-medium text-gray-700">{{ weekLabel }}</span>
              <span class="text-xs text-gray-500 mt-1">{{ weekDateRange }}</span>
            </div>
            <button
              class="p-2 hover:bg-gray-200 rounded-lg transition-colors"
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
    const scheduleDay = props.student?.schedule?.find(s => s.date === date.toISOString().split('T')[0]);
    weekDays.push({
      date: date.toISOString().split('T')[0],
      dayName: date.toLocaleDateString('ar-EG', { weekday: 'long' }),
      dayNameShort: date.toLocaleDateString('ar-EG', { weekday: 'short' }),
      dayNumber: date.getDate(),
      month: date.toLocaleDateString('ar-EG', { month: 'long' }),
      isToday: date.toDateString() === today.toDateString(),
      isHoliday: scheduleDay?.isHoliday || false
    });
  }
  return weekDays;
};

const weekDays = computed(() => {
  const days = getWeekDates(currentWeekOffset.value);
  // Map schedule data to days
  return days.map(day => {
    const daySchedule = props.student?.schedule?.find(s => s.date === day.date) || null;
    return {
      ...day,
      subjects: daySchedule?.subjects || [],
      dailyProgress: daySchedule?.dailyProgress || 0
    };
  });
});

const weekLabel = computed(() => {
  if (currentWeekOffset.value === 0) {
    return 'This Week';
  }
  return currentWeekOffset.value < 0 ? `${Math.abs(currentWeekOffset.value)} weeks ago` : `In ${currentWeekOffset.value} weeks`;
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

const weeklySummary = computed(() => {
  const allSubjects = weekDays.value.flatMap(day => day.subjects || []);
  const completed = allSubjects.filter(s => s.progress >= 100).length;
  const total = allSubjects.length;
  const averageProgress = total > 0
    ? Math.round(allSubjects.reduce((sum, s) => sum + s.progress, 0) / total)
    : 0;
  const accumulated = props.student?.accumulatedLessons || 0;

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

