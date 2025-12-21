<template>
  <div class="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
    <div class="flex items-center gap-4">
      <!-- WhatsApp Chat Icon -->
      <div class="flex-shrink-0">
        <button
          class="w-12 h-12 rounded-full border-2 border-green-200 flex items-center justify-center bg-green-50 hover:bg-green-100 transition-colors cursor-pointer"
          title="Open WhatsApp chat" @click="handleWhatsAppClick">
          <MessageCircle :size="24" class="text-green-600" />
        </button>
      </div>

      <!-- Student Name and Phone -->
      <div class="flex-shrink-0 min-w-[180px]">
        <h3 class="text-base font-bold text-gray-900 mb-1">{{ student.name }}</h3>
        <p class="text-sm text-gray-500">{{ student.phone }}</p>
      </div>

      <!-- Average Progress (Clickable) -->
      <div class="flex-1 min-w-[200px] max-w-[250px]">
        <button class="w-full text-left" @click="$emit('progress-click', student)">
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-xs font-medium text-gray-600 cursor-pointer hover:text-gray-900">Average Progress</span>
            <span class="text-xs font-semibold text-gray-900">{{ student.averageProgress }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2 cursor-pointer">
            <div class="bg-green-500 h-2 rounded-full transition-all" :style="{ width: `${student.averageProgress}%` }">
            </div>
          </div>
        </button>
      </div>

      <!-- Score Badge (Clickable) -->
      <div class="flex-shrink-0">
        <StudentScoreBadge :score="student.score" @click="$emit('score-click', student)" />
      </div>

      <!-- Diamond Points and Last Active -->
      <div class="flex flex-col gap-0.5 flex-shrink-0 min-w-[80px]">
        <div class="flex items-center gap-1.5">
          <DiamondIcon :size="16" color="#3b82f6" />
          <span class="text-sm font-medium text-gray-700">{{ student.diamondPoints }}</span>
        </div>
        <span class="text-xs text-gray-500">{{ student.lastActive }}</span>
      </div>

      <!-- Status Badge -->
      <div class="flex-shrink-0">
        <StudentStatusBadge :status="student.status" />
      </div>

      <!-- Group Dropdown -->
      <div class="flex-shrink-0 min-w-[120px]">
        <BaseSelect v-model="selectedGroup" :options="groupOptions"
          select-class="text-xs py-1.5 px-2 border-gray-300 rounded-md w-full"
          @update:model-value="handleGroupChange" />
      </div>

      <!-- Notes Button -->
      <div class="flex-shrink-0">
        <button class="p-2 rounded-lg bg-yellow-50 hover:bg-yellow-100 transition-colors border border-yellow-200"
          title="View/Add Notes" @click="$emit('notes-click', student)">
          <FileText :size="18" class="text-yellow-600" />
        </button>
      </div>

      <!-- Performance Badge -->
      <div class="flex-shrink-0">
        <StudentPerformanceBadge :performance="student.performance" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { MessageCircle, FileText } from 'lucide-vue-next';
import { BaseSelect, DiamondIcon } from '../../ui';
import StudentScoreBadge from './StudentScoreBadge.vue';
import StudentStatusBadge from './StudentStatusBadge.vue';
import StudentPerformanceBadge from './StudentPerformanceBadge.vue';

const props = defineProps({
  student: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['group-change', 'whatsapp-click', 'progress-click', 'score-click', 'notes-click']);

const selectedGroup = ref(props.student.group);

const groupOptions = computed(() => {
  const allGroups = [
    { value: 'group-a', label: 'Group A' },
    { value: 'group-b', label: 'Group B' },
    { value: 'outside', label: 'Outside' }
  ];
  return allGroups;
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
