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
                v-if="!scheduleLoading && !scheduleErrorMessage"
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
        <div class="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white" v-if="!scheduleLoading && !scheduleErrorMessage">
          <div class="flex items-center justify-between">
            <button
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              :disabled="!canGoPrev"
              :class="!canGoPrev ? 'opacity-40 cursor-not-allowed' : ''"
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
              :disabled="!canGoNext"
              :class="!canGoNext ? 'opacity-40 cursor-not-allowed' : ''"
              @click="handleNextWeek"
            >
              <ChevronRight :size="20" class="text-gray-600" />
            </button>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-4">
          <div v-if="scheduleLoading" class="py-10 text-center text-gray-500">
            Loading...
          </div>
          <div v-else-if="scheduleErrorMessage" class="py-10 text-center text-red-600">
            {{ scheduleErrorMessage }}
          </div>
          <template v-else>
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
          </template>
        </div>
      </div>
    </Transition>

    <!-- Subject Part Details Sidebar -->
    <SubjectPartDetailsSidebar
      :is-open="isDetailsOpen"
      :student-id="studentId"
      :subject-id="selectedSubjectPart?.subjectId"
      :subject-part-id="selectedSubjectPart?.subjectPartId"
      :subject-part="selectedSubjectPart"
      :day-info="selectedDayInfo"
      @close="handleCloseDetails"
    />
  </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { X, Calendar, Edit, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { useQuery } from '@vue/apollo-composable';
import { BaseButton } from '../../../ui';
import ScheduleDayCard from './ScheduleDayCard.vue';
import WeeklySummarySection from './WeeklySummarySection.vue';
import SubjectPartDetailsSidebar from './SubjectPartDetailsSidebar.vue';
import { UNIT_ADMIN_SCHEDULE_WEEKS } from '../../../../graphql/queries/unitAdminScheduleWeeks.js';

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

const studentId = computed(() => (props.student?.id ? String(props.student.id) : null));
const scheduleWeeksCache = ref({});
const cachedWeeks = computed(() => (studentId.value ? scheduleWeeksCache.value[studentId.value] || null : null));
const shouldFetchSchedule = computed(() => Boolean(props.isOpen && studentId.value && !cachedWeeks.value));

const {
  result: scheduleResult,
  loading: scheduleQueryLoading,
  error: scheduleQueryError
} = useQuery(
  UNIT_ADMIN_SCHEDULE_WEEKS,
  computed(() => ({ student_id: studentId.value })),
  computed(() => ({
    enabled: shouldFetchSchedule.value,
    fetchPolicy: 'no-cache'
  }))
);

watch(
  () => scheduleResult.value?.unitAdminScheduleWeeks,
  (ws) => {
    if (!ws || !studentId.value) return;
    scheduleWeeksCache.value = { ...scheduleWeeksCache.value, [studentId.value]: ws };
  }
);

const weeks = computed(() => cachedWeeks.value || scheduleResult.value?.unitAdminScheduleWeeks || []);

// Week navigation (by index)
const selectedWeekIndex = ref(0);
const isDetailsOpen = ref(false);
const selectedSubjectPart = ref(null);
const selectedDayInfo = ref(null);

const selectedWeek = computed(() => weeks.value[selectedWeekIndex.value] || null);

const scheduleLoading = computed(() => (cachedWeeks.value ? false : scheduleQueryLoading.value));
const scheduleErrorMessage = computed(() => {
  const e = cachedWeeks.value ? null : scheduleQueryError.value;
  if (!e) return '';
  return (
    e?.graphQLErrors?.[0]?.message ||
    e?.networkError?.message ||
    e.message ||
    'Unknown error'
  );
});

const toArabicNum = (num) => {
  const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(num)
    .split('')
    .map((d) => arabicNums[Number(d)])
    .join('');
};

const weekDays = computed(() => {
  const w = selectedWeek.value;
  if (!w) return [];

  const todayStr = new Date().toISOString().slice(0, 10);

  return (w.days || []).map((d) => {
    const dateObj = new Date(d.date);
    const subjects = (d.subject_parts || []).map((sp) => ({
      id: String(sp.part_id),
      subjectId: sp.subject_id,
      subjectPartId: sp.part_id,
      subjectName: sp.subject_name,
      partName: sp.part_name,
      difficultyLevel: sp.difficulty_level,
      progress: sp.progress ?? 0,
      exercises: [],
      videos: []
    }));

    const dailyProgress =
      subjects.length > 0 ? Math.round(subjects.reduce((sum, s) => sum + (s.progress || 0), 0) / subjects.length) : 0;

    return {
      date: d.date,
      dayName: d.name, // already Arabic from backend
      dayNameShort: d.name,
      dayNumber: dateObj.getDate(),
      month: dateObj.toLocaleDateString('ar-EG', { month: 'long' }),
      isToday: d.date === todayStr,
      subjects,
      dailyProgress,
      isHoliday: !!d.isHoliday
    };
  });
});

const weekLabelArabic = computed(() => {
  const w = selectedWeek.value;
  if (!w) return '';
  return w.isCurrentWeek ? 'هذا الأسبوع' : `الأسبوع ${w.weekNumber}`;
});

const weekDateRangeArabic = computed(() => {
  if (weekDays.value.length === 0) return '';
  const firstDay = weekDays.value[0];
  const lastDay = weekDays.value[weekDays.value.length - 1];
  const year = new Date(firstDay.date).getFullYear();
  return `${toArabicNum(firstDay.dayNumber)} - ${toArabicNum(lastDay.dayNumber)} ${lastDay.month} ${toArabicNum(year)}`;
});

const weeklySummary = computed(() => {
  const w = selectedWeek.value;
  const allSubjects = weekDays.value.flatMap((day) => day.subjects || []);
  const total = allSubjects.length;
  // "completedLessons" = subject parts progress >= 60
  const completed = allSubjects.filter((s) => (s.progress ?? 0) >= 60).length;
  // averageProgress comes from week-level progress returned by backend
  const averageProgress = w?.progress ?? 0;
  // accumulated comes from week-level accumulated_subject_parts_count
  const accumulated = w?.accumulated_subject_parts_count ?? 0;

  return {
    averageProgress,
    completedLessons: `${completed} / ${total}`,
    accumulatedSessions: accumulated
  };
});

const handlePreviousWeek = () => {
  if (!canGoPrev.value) return;
  selectedWeekIndex.value -= 1;
};

const handleNextWeek = () => {
  if (!canGoNext.value) return;
  selectedWeekIndex.value += 1;
};

const handleClose = () => {
  emit('close');
};

const handleEditSchedule = () => {
  if (props.student?.id) {
    window.open(`https://elkheta.org/admin/resources/students/${props.student.id}/edit-schedule`, '_blank');
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
    // Prefer current week from backend
    const idx = weeks.value.findIndex((w) => w.isCurrentWeek);
    selectedWeekIndex.value = idx >= 0 ? idx : 0;
  }
});

watch(
  () => weeks.value,
  (ws) => {
    if (!props.isOpen) return;
    if (!Array.isArray(ws) || ws.length === 0) return;
    const idx = ws.findIndex((w) => w.isCurrentWeek);
    selectedWeekIndex.value = idx >= 0 ? idx : 0;
  },
  { immediate: true }
);

const canGoPrev = computed(() => selectedWeekIndex.value > 0);
const canGoNext = computed(() => selectedWeekIndex.value < weeks.value.length - 1);
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

