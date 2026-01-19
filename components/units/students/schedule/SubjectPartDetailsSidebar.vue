<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div v-if="isOpen" class="fixed inset-0 bg-black bg-opacity-50 z-[50]" @click="handleClose" />
    </Transition>

    <!-- Details Sidebar -->
    <Transition name="slide">
      <div v-if="isOpen"
        class="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[60] flex flex-col overflow-hidden"
        @click.stop>
        <!-- Header -->
        <div class="flex-shrink-0 px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-amber-50">
          <div class="flex items-center justify-between">
            <button
              type="button"
              class="flex items-center gap-2 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors shadow-sm"
              @click="handleBackToSchedule"
            >
              <ChevronRight :size="14" />
              <span>العودة للجدول</span>
            </button>

            <div class="flex items-center gap-2">
              <h3 class="text-base font-bold text-gray-900" dir="rtl">
                {{ headerSubjectName }}
              </h3>
              <BookOpen :size="20" class="text-orange-600" />
            </div>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
          <div v-if="detailsLoading" class="py-10 text-center text-gray-500">Loading...</div>
          <div v-else-if="detailsErrorMessage" class="py-10 text-center text-red-600">
            {{ detailsErrorMessage }}
          </div>
          <div v-else>
            <!-- Day and Date Info -->
            <div class="bg-blue-50 rounded-xl border border-blue-200 p-4 mb-3">
              <div class="flex items-center justify-between" dir="rtl">
                <div>
                  <p class="text-xs text-gray-500">اليوم</p>
                  <p class="text-sm font-bold text-gray-900">{{ dayInfo?.dayName }}</p>
                  
                </div>
                <Calendar :size="16" class="text-blue-600" />
              </div>
            </div>

            <div v-if="!details || !details.by_course || details.by_course.length === 0" class="text-center py-6 text-gray-500">
              لا توجد بيانات متاحة
            </div>

            <!-- Exercises and Tests Section (loop 1) -->
            <div v-if="details?.by_course?.length" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-3 flex items-center justify-end">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold text-white" dir="rtl">التمارين والاختبارات</h4>
                  <FileText :size="18" class="text-white" />
                </div>
              </div>

              <div class="p-4 space-y-4">
                <div v-for="(course, idx) in details.by_course" :key="`ex-course-${idx}`" class="space-y-3">
                  <div class="flex items-center justify-between" dir="rtl">
                    <div class="text-right">
                      <div class="text-md font-bold text-gray-900">{{ course.course_name }}</div>
                      <div class="text-[14px] text-gray-500 mt-0.5">{{ course.teacher_name }}</div>
                    </div>
                  </div>

                  <div v-if="course.exercises?.length" class="space-y-3">
                    <div
                      v-for="(ex, exIdx) in course.exercises"
                      :key="`ex-${idx}-${exIdx}`"
                      class="rounded-lg p-3 border"
                      :class="exerciseCardClass(ex)"
                      dir="rtl"
                    >
                      <h5 class="text-sm font-bold text-gray-900 mb-2 text-right">{{ ex.name }}</h5>
                      <div v-if="ex.sessions?.length > 0" class="space-y-2">
                        <div
                          v-for="(s, sIdx) in ex.sessions"
                          :key="`ex-${idx}-${exIdx}-s-${sIdx}`"
                          class="flex items-center justify-between text-xs text-gray-600"
                        >
                          <!-- Right side: score/time/date -->
                          <div class="flex items-center gap-3" dir="rtl">
                          
                            <span>{{ formatMinutesArabic(s.time_taken) }}</span>
                            <span>{{ formatArabicDayMonth(s.end_date) }}</span>
                            <span class="font-bold" :class="scoreTextClass(s.score)">
                              ({{ s.score ?? 0 }}%)
                            </span>
                          </div>

                          <!-- Left side: correction button per session -->
                          <button
                            type="button"
                            class="bg-blue-600 hover:bg-blue-700 text-white px-2 py-1 rounded text-[11px] font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            :disabled="!getSessionId(s)"
                            @click="openCorrection(getSessionId(s))"
                          >
                            التصحيح
                          </button>
                        </div>

                      </div>
                      <div v-else class="text-gray-500 text-xs">لم يتم حل هذا التمرين بعد</div>
                    </div>
                  </div>
                  <div v-else class="text-xs text-gray-400 text-right">لا توجد تمارين</div>
                </div>
              </div>
            </div>

            <!-- Video Content Section (loop 2) -->
            <div v-if="details?.by_course?.length" class="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div class="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-3 flex items-center justify-end">
                <div class="flex items-center gap-2">
                  <h4 class="text-sm font-bold text-white" dir="rtl">الفيديوهات</h4>
                  <Play :size="18" class="text-white" />
                </div>
              </div>

              <div class="p-4 space-y-4">
                <div v-for="(course, idx) in details.by_course" :key="`vid-course-${idx}`" class="space-y-3">
                  <div class="flex items-center justify-between" dir="rtl">
                    <div class="text-right">
                      <div class="text-md font-bold text-gray-900">{{ course.course_name }}</div>
                      <div class="text-sm text-gray-500 mt-0.5">{{ course.teacher_name }}</div>
                    </div>
                  </div>

                  <div v-if="course.videos?.length" class="space-y-3">
                    <div
                      v-for="(v, vIdx) in course.videos"
                      :key="`v-${idx}-${vIdx}`"
                      class="flex items-center gap-3 p-3 rounded-lg border"
                      :class="v.status === 'COMPLETED' ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'"
                      dir="rtl"
                    >
                      <div class="flex-1 text-right">
                        <h5 class="text-sm font-bold text-gray-900 mb-2">{{ v.name }}</h5>
                        <div class="flex items-center gap-3 text-xs">
                          <span class="text-gray-600">{{ formatMinutesArabic(v.duration) }}</span>
                          <span class="font-bold" :class="v.status === 'COMPLETED' ? 'text-green-600' : 'text-gray-500'">
                            {{ v.status === 'COMPLETED' ? 'مكتمل' : 'غير مكتمل' }}
                          </span>
                        </div>
                      </div>
                      <div
                        class="flex items-center justify-center w-10 h-10 rounded-full flex-shrink-0"
                        :class="v.status === 'COMPLETED' ? 'bg-green-100' : 'bg-gray-100'"
                      >
                        <CheckCircle2 v-if="v.status === 'COMPLETED'" :size="20" class="text-green-600" />
                        <XCircle v-else :size="20" class="text-gray-500" />
                      </div>
                    </div>
                  </div>
                  <div v-else class="text-xs text-gray-400 text-right">لا توجد فيديوهات</div>
                </div>
              </div>
            </div>

            <div class="h-10"></div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { BookOpen, Calendar, CheckCircle2, ChevronRight, FileText, Play, XCircle } from 'lucide-vue-next';
import { useQuery } from '@vue/apollo-composable';
import { UNIT_ADMIN_SUBJECT_PART_DETAILS } from '../../../../graphql/queries/unitAdminSubjectPartDetails.js';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
  },
  studentId: {
    type: [String, Number],
    default: null
  },
  subjectId: {
    type: [String, Number],
    default: null
  },
  subjectPartId: {
    type: [String, Number],
    default: null
  },
  subjectPart: {
    type: Object,
    default: null
  },
  dayInfo: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['close', 'back-to-schedule']);

// Cache subject-part details so reopening the same part doesn't refetch (like StudentProfileSidebar cache).
const detailsCache = ref({});
const cacheKey = computed(() => {
  if (!props.studentId || !props.subjectId || !props.subjectPartId) return null;
  return `${props.studentId}:${props.subjectId}:${props.subjectPartId}`;
});
const cachedDetails = computed(() => (cacheKey.value ? detailsCache.value[cacheKey.value] || null : null));

const shouldFetchDetails = computed(() =>
  Boolean(props.isOpen && props.studentId && props.subjectId && props.subjectPartId && !cachedDetails.value)
);

const { result, loading, error } = useQuery(
  UNIT_ADMIN_SUBJECT_PART_DETAILS,
  computed(() => ({
    student_id: String(props.studentId),
    subjectId: String(props.subjectId),
    subjectPartId: String(props.subjectPartId)
  })),
  computed(() => ({
    enabled: shouldFetchDetails.value,
    fetchPolicy: 'no-cache'
  }))
);

watch(
  () => result.value?.unitAdminSubjectPartDetails,
  (val) => {
    if (!val || !cacheKey.value) return;
    detailsCache.value = { ...detailsCache.value, [cacheKey.value]: val };
  }
);

const detailsResponse = computed(() => cachedDetails.value || result.value?.unitAdminSubjectPartDetails || null);
const details = computed(() => detailsResponse.value || null);
const detailsLoading = computed(() => (cachedDetails.value ? false : loading.value));
const detailsErrorMessage = computed(() => {
  const e = cachedDetails.value ? null : error.value;
  if (!e) return '';
  return (
    e?.graphQLErrors?.[0]?.message ||
    e?.networkError?.message ||
    e.message ||
    'Unknown error'
  );
});

const headerSubjectName = computed(() => details.value?.subject_name || props.subjectPart?.subjectName || '');
const headerPartName = computed(() => details.value?.part_name || props.subjectPart?.partName || '');

const handleClose = () => {
  emit('close');
};

const handleBackToSchedule = () => {
  emit('back-to-schedule');
  handleClose();
};

const scoreTextClass = (score) => {
  if (!score) return 'text-red-600';
  return score >= 80 ? 'text-green-600' : 'text-red-600';
};

const exerciseCardClass = (exercise) => {
  const sessions = exercise?.sessions || [];
  if (!sessions.length) return 'bg-gray-50 border-gray-200';
  // color by best score across sessions
  const bestScore = sessions.reduce((max, s) => Math.max(max, s?.score ?? 0), 0);
  if (bestScore >= 80) return 'bg-green-50 border-green-200';
  return 'bg-gray-50 border-gray-200';
};

const getSessionId = (session) => {
  return session?.id;
};

const openCorrection = (sessionId) => {
  if (!sessionId) return;
  window.open(
    `https://elkheta.org/admin/student-exam/user-exercise-sessions/answers/${sessionId}`,
    '_blank'
  );
};

const toArabicDigits = (value) => {
  const arabicNums = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];
  return String(value)
    .split('')
    .map((ch) => (/\d/.test(ch) ? arabicNums[Number(ch)] : ch))
    .join('');
};

// Accepts either:
// - number minutes (videos)
// - "mm:ss" or "hh:mm" strings (sessions time_taken)
const formatMinutesArabic = (timeOrMinutes) => {
  if (timeOrMinutes === null || timeOrMinutes === undefined || timeOrMinutes === '') return '--';

  // numeric minutes
  if (typeof timeOrMinutes === 'number') {
    const mins = Math.max(1, Math.floor(timeOrMinutes));
    return `${toArabicDigits(mins)} دقيقة`;
  }

  const str = String(timeOrMinutes).trim();
  // mm:ss or hh:mm
  const parts = str.split(':').map((p) => p.trim());
  const firstNum = Number(parts[0]);
  if (!Number.isNaN(firstNum)) {
    // If format is mm:ss, show minutes; if hh:mm, show hours*60 + minutes
    if (parts.length === 2) {
      const secondNum = Number(parts[1]);
      if (!Number.isNaN(secondNum)) {
        // Heuristic: if hours likely (firstNum <= 6 and secondNum <= 59) we still treat as minutes if time_taken is mm:ss.
        // Backend sample uses "09:55" -> treat as minutes.
        const minutes = Math.max(1, firstNum);
        return `${toArabicDigits(minutes)} دقيقة`;
      }
    }
  }

  // fallback: extract digits, ensure at least 1
  const parsed = Number(str.replace(/[^\d]/g, ''));
  const minutes = Number.isNaN(parsed) ? 1 : Math.max(1, parsed);
  return `${toArabicDigits(minutes)} دقيقة`;
};

const formatArabicDayMonth = (dateStr) => {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '--';
  const day = toArabicDigits(d.getDate());
  const month = d.toLocaleDateString('ar-EG', { month: 'long' });
  return `${day} ${month}`;
};
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
