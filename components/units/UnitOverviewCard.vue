<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-6 hover:shadow-md transition-shadow">
    <!-- Unit Header -->
    <div class="mb-4">
      <h3 class="text-lg font-bold text-gray-900 mb-1">{{ unit.name }}</h3>
      <span class="text-xs text-gray-500">ID: {{ unit.id }}</span>
    </div>

    <!-- Key Stats Overview -->
    <div class="grid grid-cols-4 gap-3 mb-4">
      <div class="text-center">
        <div class="text-lg font-bold text-green-600 mb-1">{{ unit.active || 0 }}</div>
        <div class="text-xs text-gray-500 uppercase">Active</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-gray-500 mb-1">{{ unit.outside || 0 }}</div>
        <div class="text-xs text-gray-500 uppercase">Outside</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-orange-500 mb-1">{{ unit.expired || 0 }}</div>
        <div class="text-xs text-gray-500 uppercase">Expired</div>
      </div>
      <div class="text-center">
        <div class="text-lg font-bold text-red-500 mb-1">{{ unit.lost || 0 }}</div>
        <div class="text-xs text-gray-500 uppercase">Lost</div>
      </div>
    </div>

    <!-- Admin Information -->
    <div class="flex items-center gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
      <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
        <User :size="20" class="text-blue-600" />
      </div>
      <div class="flex-1 min-w-0">
        <div class="text-sm font-semibold text-gray-900 truncate">{{ unit.adminName }}</div>
        <div class="text-xs text-gray-500 truncate">{{ unit.adminPhone }}</div>
      </div>
    </div>

    <!-- Capacity Section -->
    <div class="mb-4">
      <div class="flex items-center justify-between mb-2">
        <span class="text-sm font-medium text-gray-700">Capacity</span>
        <span class="text-sm text-gray-500">{{ unit.currentCapacity }}/{{ unit.maxCapacity }}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2.5 mb-1">
        <div 
          class="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
          :style="{ width: `${capacityPercentage}%` }"
        ></div>
      </div>
      <div class="text-xs text-gray-500 text-right">{{ availableCapacity }} available</div>
    </div>

    <!-- Action Buttons -->
    <div class="flex flex-col gap-3 mt-4">
      <BaseButton 
        variant="primary" 
        size="md" 
        class="flex-1"
        @click="$emit('view-students', unit)"
      >
        View Student List
      </BaseButton>
      <BaseButton 
        variant="secondary" 
        size="md" 
        class="flex-1"
        @click="$emit('unit-settings', unit)"
      >
        Unit Setting
      </BaseButton>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { User } from 'lucide-vue-next';
import { BaseButton } from '../ui';

const props = defineProps({
  unit: {
    type: Object,
    required: true
  }
});

defineEmits(['view-students', 'unit-settings']);

const capacityPercentage = computed(() => {
  if (!props.unit.maxCapacity || props.unit.maxCapacity === 0) return 0;
  return Math.min((props.unit.currentCapacity / props.unit.maxCapacity) * 100, 100);
});

const availableCapacity = computed(() => {
  return Math.max((props.unit.maxCapacity || 0) - (props.unit.currentCapacity || 0), 0);
});
</script>

