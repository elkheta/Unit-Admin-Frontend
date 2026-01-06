<template>
  <!-- Accumulated Lessons Sidebar -->
  <div v-if="isVisible" class="fixed inset-0 z-50 flex justify-end">
    <!-- Backdrop -->
    <div 
      class="fixed inset-0 bg-black/20 z-40"
      @click="$emit('close')"
    ></div>
    
    <!-- Sidebar -->
    <div class="fixed inset-y-0 right-0 w-full sm:w-[520px] bg-white shadow-2xl transform transition-transform duration-300 z-50 flex flex-col h-full overflow-hidden animate-slide-in-right">
      <!-- Sidebar Header -->
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-orange-50 to-red-50">
        <button 
          @click="$emit('close')"
          class="p-1.5 hover:bg-white rounded-full text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X :size="20" />
        </button>

        <div class="flex items-center gap-2">
          <h3 class="text-base font-bold text-gray-900" dir="rtl">
            الحصص المتراكمة - {{ student?.name }}
          </h3>
          <AlertCircle :size="20" class="text-orange-600" />
        </div>
      </div>

      <!-- Sidebar Content -->
      <div class="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-gray-200">
        
        <!-- Info Banner -->
        <div class="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <div class="flex items-center gap-3 mb-3" dir="rtl">
            <div class="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
              <span class="text-2xl font-bold text-orange-600">
                {{ student?.accumulatedLessons || 0 }}
              </span>
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-gray-900 mb-1">عدد الحصص المتراكمة</h4>
              <p class="text-xs text-gray-600">الحصص التي لم يكملها الطالب بعد</p>
            </div>
          </div>
          
          <!-- Go to Schedule Button -->
          <button 
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2" 
            dir="rtl"
            @click="$emit('go-to-schedule', student)"
          >
            <Calendar :size="16" />
            <span>الذهاب لجدول الطالب</span>
          </button>
        </div>

        <!-- Accumulated Lessons -->
        <div 
          v-for="(lesson, index) in accumulatedLessons" 
          :key="index" 
          class="bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl border border-orange-200 overflow-hidden shadow-sm"
        >
          <!-- Lesson Header -->
          <div class="bg-white border-b border-orange-100 px-4 py-3">
            <div class="text-right">
              <h5 class="text-sm font-bold text-gray-900" dir="rtl">{{ lesson.subject }}</h5>
              <p class="text-xs text-gray-500" dir="rtl">{{ lesson.day }} - {{ lesson.date }}</p>
            </div>
          </div>

          <!-- Lesson Content -->
          <div class="p-4">
            <!-- Progress Bar -->
            <div class="space-y-1.5" dir="rtl">
              <div class="flex items-center justify-start text-xs">
                <span 
                  class="font-bold"
                  :class="{
                    'text-green-600': lesson.progress >= 70,
                    'text-orange-600': lesson.progress >= 40 && lesson.progress < 70,
                    'text-red-600': lesson.progress < 40
                  }"
                >
                  {{ lesson.progress }}%
                </span>
              </div>
              <div class="h-2.5 bg-gray-200 rounded-full overflow-hidden flex justify-end">
                <div 
                  class="h-full rounded-full transition-all"
                  :class="{
                    'bg-green-500': lesson.progress >= 70,
                    'bg-orange-500': lesson.progress >= 40 && lesson.progress < 70,
                    'bg-red-500': lesson.progress < 40
                  }"
                  :style="{ width: `${lesson.progress}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Bottom Padding -->
        <div class="h-10"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, AlertCircle, Calendar } from 'lucide-vue-next';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  student: {
    type: Object,
    default: null
  },
  accumulatedLessons: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close', 'go-to-schedule']);
</script>

<style scoped>
@keyframes slide-in-right {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}

/* Custom scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-200::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thumb-gray-200::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thumb-gray-200::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}

.scrollbar-thumb-gray-200::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>
