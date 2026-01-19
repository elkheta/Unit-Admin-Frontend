<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div class="flex flex-col lg:flex-row lg:items-center gap-4">
      
      <!-- Identity Section: Icon + Name (Fixed Width) -->
      <div class="flex items-center gap-3 w-full lg:w-[280px] flex-shrink-0">
        <!-- WhatsApp Chat Icon -->
        <div class="flex-shrink-0">
          <button
            class="w-12 h-12 rounded-full border-2 border-green-200 flex items-center justify-center bg-green-50 hover:bg-green-100 transition-colors cursor-pointer"
            title="Open WhatsApp chat" @click="handleWhatsAppClick">
            <MessageCircle :size="24" class="text-green-600" />
          </button>
        </div>

        <!-- Student Name and Phone -->
        <div class="flex-shrink-0 min-w-0">
          <h3
            class="text-base font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer truncate"
            :title="student.name"
            @click.stop="$emit('name-click', student)"
          >
            {{ student.name }}
          </h3>
          <p class="text-sm text-gray-500">{{ student.phone }}</p>
        </div>
      </div>

      <!-- Progress Section (Fixed Width) -->
      <div class="w-full lg:w-[320px] flex-shrink-0">
        <button class="w-full text-left" @click="$emit('progress-click', student)">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-medium text-gray-600 cursor-pointer hover:text-gray-900 truncate pr-2">{{ progressLabel }}</span>
            <span class="text-xs font-semibold text-gray-900 flex-shrink-0">{{ student.averageProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 cursor-pointer">
            <div class="bg-green-500 h-2 rounded-full transition-all" :style="{ width: `${student.averageProgress}%` }">
            </div>
          </div>
        </button>
      </div>

      <!-- Stats & Actions Grid (Flexible but with fixed children) -->
      <div class="flex flex-wrap lg:flex-nowrap items-center gap-2 lg:gap-6 w-full lg:flex-1 justify-start">
        
        <!-- Score Badge (Fixed column) -->
        <div class="flex-shrink-0 w-[50px]">
          <StudentScoreBadge 
            :score="student.score" 
            :accumulated-lessons="student.accumulatedLessons"
            :accumulated-progress="student.accumulatedProgress"
            @click="$emit('score-click', student)" 
          />
        </div>

        <!-- Diamond Points & Last Seen (Fixed column) -->
        <div class="flex flex-col gap-0.5 flex-shrink-0 w-[90px]">
          <div class="flex items-center gap-1.5">
            <DiamondIcon :size="16" color="#3b82f6" />
            <span class="text-sm font-medium text-gray-700">{{ student.diamondPoints }}</span>
          </div>
          <div class="flex items-center gap-1.5 text-gray-500">
            <Monitor :size="14" />
            <span class="text-xs">{{ student.lastActive }}</span>
          </div>
        </div>

        <!-- Status Badge (Fixed column) -->
        <div class="flex-shrink-0 w-[70px]">
          <StudentStatusBadge :status="student.status" />
        </div>

        <!-- Group Dropdown (Read-Only) (Fixed column) -->
        <div class="flex-shrink-0 w-[110px]">
          <div class="text-xs py-1.5 px-2 border border-gray-300 rounded-md w-full bg-gray-100 text-gray-500 truncate cursor-not-allowed select-none">
            {{ selectedGroupLabel }}
          </div>
        </div>

        <!-- Notes Button (Fixed column) -->
        <div class="flex-shrink-0 w-[40px] flex justify-center">
          <button class="p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors border border-yellow-200"
            title="View/Add Notes" @click="$emit('notes-click', student)">
            <FileText :size="18" class="text-yellow-600" />
          </button>
        </div>

        <!-- Performance Badges (Remaining Space) -->
        <div class="flex flex-wrap gap-1 flex-shrink-0">
          <StudentPerformanceBadge 
            v-for="label in student.labels" 
            :key="label.id" 
            :name="label.name" 
            :color="label.color" 
          />
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { MessageCircle, FileText, Monitor } from 'lucide-vue-next';
import { DiamondIcon } from '../../ui';
import StudentStatusBadge from './StudentStatusBadge.vue';
import StudentPerformanceBadge from './StudentPerformanceBadge.vue';
import StudentScoreBadge from './StudentScoreBadge.vue';

const props = defineProps({
  student: {
    type: Object,
    required: true
  },
  groupOptions: {
    type: Array,
    default: () => []
  },
  progressLabel: {
    type: String,
    default: 'Average Progress'
  }
});

const emit = defineEmits(['group-change', 'whatsapp-click', 'progress-click', 'score-click', 'notes-click', 'name-click', 'accumulated-lessons-click']);

const selectedGroup = ref(props.student.group);

const selectedGroupLabel = computed(() => {
  const option = props.groupOptions?.find(o => o.value === selectedGroup.value);
  return option ? option.label : selectedGroup.value;
});



const handleGroupChange = (value) => {
  emit('group-change', { studentId: props.student.id, group: value });
};

const handleWhatsAppClick = () => {
  // Format phone number (remove + and spaces)
  const phoneNumber = props.student.phone.replace(/[\s+]/g, '');
  // Open WhatsApp with the student's phone number
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  window.open(whatsappUrl, '_blank');
  emit('whatsapp-click', props.student);
};
</script>
