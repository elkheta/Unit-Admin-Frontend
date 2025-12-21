<template>
  <Teleport to="body">
    <!-- Backdrop -->
    <Transition name="fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black bg-opacity-50 z-[50]"
        @click="handleClose"
      />
    </Transition>

    <!-- Details Sidebar -->
    <Transition name="slide">
      <div
        v-if="isOpen"
        class="fixed inset-y-0 right-0 w-full max-w-xl bg-white shadow-2xl z-[60] flex flex-col overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <BookOpen :size="24" class="text-orange-600" />
              <h2 class="text-xl font-bold text-gray-900">{{ subjectPart?.subjectName }} - {{ subjectPart?.partName }}</h2>
            </div>
            <button
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              @click="handleClose"
            >
              <X :size="20" class="text-gray-500" />
            </button>
          </div>
          <BaseButton
            variant="secondary"
            size="sm"
            :icon="ArrowRight"
            @click="handleBackToSchedule"
          >
            العودة للجدول
          </BaseButton>
        </div>

        <!-- Date Display -->
        <div class="flex-shrink-0 px-6 py-3 border-b border-gray-200 bg-gray-50">
          <div class="flex items-center gap-3">
            <Calendar :size="20" class="text-blue-600" />
            <div>
              <p class="text-sm font-semibold text-gray-900">{{ dayInfo?.dayName }}</p>
              <p class="text-xs text-gray-500">اليوم</p>
            </div>
          </div>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <!-- Exercises & Tests Section -->
          <div class="bg-orange-50 rounded-lg border border-orange-200 p-4">
            <div class="flex items-center gap-2 mb-4">
              <FileText :size="20" class="text-orange-600" />
              <h3 class="text-lg font-bold text-white bg-orange-600 px-3 py-1 rounded">التمارين والاختبارات</h3>
            </div>
            <div v-if="subjectPart?.exercises?.length > 0" class="space-y-3">
              <div
                v-for="exercise in subjectPart.exercises"
                :key="exercise.id"
                class="bg-white rounded-lg border border-gray-200 p-3"
              >
                <div class="flex items-center justify-between mb-2">
                  <h4 class="text-sm font-semibold text-gray-900">{{ exercise.title }}</h4>
                  <BaseButton
                    variant="primary"
                    size="sm"
                    @click="handleCorrectExercise(exercise)"
                  >
                    تصحح
                  </BaseButton>
                </div>
                <div class="flex items-center gap-4 text-xs text-gray-600">
                  <span>{{ exercise.duration }} min</span>
                  <span>{{ exercise.date }}</span>
                  <span
                    :class="[
                      'font-semibold',
                      exercise.score >= 80 ? 'text-green-600' : 'text-orange-600'
                    ]"
                  >
                    ({{ exercise.score }}%)
                  </span>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 text-center py-4">No exercises available</p>
          </div>

          <!-- Videos Section -->
          <div class="bg-blue-50 rounded-lg border border-blue-200 p-4">
            <div class="flex items-center gap-2 mb-4">
              <Play :size="20" class="text-blue-600" />
              <h3 class="text-lg font-bold text-white bg-blue-600 px-3 py-1 rounded">الفيديوهات</h3>
            </div>
            <div v-if="subjectPart?.videos?.length > 0" class="space-y-3">
              <div
                v-for="video in subjectPart.videos"
                :key="video.id"
                class="bg-white rounded-lg border border-gray-200 p-3"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                      <Check :size="16" class="text-green-600" />
                    </div>
                    <div>
                      <h4 class="text-sm font-semibold text-gray-900">{{ video.title }}</h4>
                      <p class="text-xs text-gray-500">{{ video.duration }} mins</p>
                    </div>
                  </div>
                  <span class="text-xs font-semibold text-green-600">مكتمل</span>
                </div>
              </div>
            </div>
            <p v-else class="text-sm text-gray-500 text-center py-4">No videos available</p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X, BookOpen, Calendar, ArrowRight, FileText, Play, Check } from 'lucide-vue-next';
import { BaseButton } from '../../../ui';

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false
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

const handleClose = () => {
  emit('close');
};

const handleBackToSchedule = () => {
  emit('back-to-schedule');
  handleClose();
};

const handleCorrectExercise = (exercise) => {
  if (exercise.id) {
    window.open(`https://elkheta.org/exercises/${exercise.id}/correct`, '_blank');
  }
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

