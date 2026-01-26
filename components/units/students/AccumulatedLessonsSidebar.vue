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
                {{ totalAccumulated }}
              </span>
            </div>
            <div class="flex-1">
              <h4 class="text-sm font-bold text-gray-900 mb-1">عدد الحصص المتراكمة</h4>
              <p class="text-xs text-gray-600">الحصص التي لم يكملها الطالب بعد</p>
            </div>
          </div>
          
          <!-- Go to Schedule Button -->
          <!-- Go to Schedule Button -->
          <a
            v-if="student?.elkheta_id"
            :href="`http://elkheta.org/admin/resources/students/${student.elkheta_id}/edit-schedule`"
            target="_blank"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg text-sm transition-colors shadow-sm flex items-center justify-center gap-2" 
            dir="rtl"
          >
            <Calendar :size="16" />
            <span>الذهاب لجدول الطالب</span>
          </a>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex justify-center p-8">
          <span class="text-gray-500">Loading...</span>
        </div>

        <!-- Accumulated Lessons -->
        <div v-else
          v-for="(part, index) in accumulatedParts" 
          :key="index" 
          class="bg-gradient-to-br from-gray-50 to-orange-50 rounded-xl border border-orange-200 overflow-hidden shadow-sm"
        >
          <!-- Lesson Header -->
          <div class="bg-white border-b border-orange-100 px-4 py-3">
            <div class="text-right">
              <h5 class="text-sm font-bold text-gray-900" dir="rtl">{{ part.subject_name }} - {{ part.part_name }}</h5>
              <p class="text-xs text-gray-500" dir="rtl">{{ formatDate(part.created_at) }}</p>
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
                    'text-green-600': part.progress >= 80,
                    'text-orange-600': part.progress >= 40 && part.progress < 80,
                    'text-red-600': part.progress < 40
                  }"
                >
                  {{ part.progress }}%
                </span>
              </div>
              <div class="h-2.5 bg-gray-200 rounded-full overflow-hidden flex justify-end">
                <div 
                  class="h-full rounded-full transition-all"
                  :class="{
                    'bg-green-500': part.progress >= 80,
                    'bg-orange-500': part.progress >= 40 && part.progress < 80,
                    'bg-red-500': part.progress < 40
                  }"
                  :style="{ width: `${part.progress}%` }"
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
import { computed, watch } from 'vue';
import { useQuery } from '@vue/apollo-composable';
import { X, AlertCircle, Calendar } from 'lucide-vue-next';
import { GET_ACCUMULATED_PARTS } from '../../../graphql/queries/accumulatedParts';

const props = defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  student: {
    type: Object,
    default: null
  },
  // accumulatedLessons prop is no longer primary source, but we keep it or remove it. 
  // Let's rely on the query since we are implementing backend integration.
});

const emit = defineEmits(['close']);

// Apollo Query
const { result, loading, refetch } = useQuery(GET_ACCUMULATED_PARTS, () => ({
  elkheta_id: props.student?.elkheta_id
}), {
  enabled: computed(() => !!props.student?.elkheta_id && props.isVisible),
  fetchPolicy: 'network-only' // Ensure fresh data on open
});

// Watch visibility to refetch if needed
watch(() => props.isVisible, (newVal) => {
  if (newVal && props.student?.elkheta_id) {
    refetch();
  }
});

const accumulatedParts = computed(() => {
  return result.value?.unitAdminAccumulatedParts || [];
});

const totalAccumulated = computed(() => accumulatedParts.value.length);

// Helper to format date in Arabic: "الخميس - 13 ديسمبر"
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }).format(date).replace('،', ' -'); // Replace default separator if needed
  } catch (e) {
    return dateString;
  }
};
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
