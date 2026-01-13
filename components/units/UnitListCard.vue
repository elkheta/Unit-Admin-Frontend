<template>
  <div class="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100 p-5">
    
    <!-- 1. Header: Title and ID -->
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1">{{ unit.title }}</h3>
        <span class="text-xs text-gray-400 font-medium tracking-wide">ID: {{ unit.id }}</span>
      </div>
      <!-- Optional: Menu or status icon could go here -->
    </div>

    <!-- Separator -->
    <hr class="border-gray-50 mb-4" />

    <!-- 2. Stats Grid -->
    <div class="grid grid-cols-4 gap-2 text-center mb-5">
      <div class="flex flex-col">
        <span class="text-lg font-bold text-green-600">{{ unit.students }}</span>
        <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">ACTIVE</span>
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-bold text-gray-700">{{ unit.outside }}</span>
        <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">OUTSIDE</span>
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-bold text-orange-500">{{ unit.expiredCount }}</span>
        <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">EXPIRED</span>
      </div>
      <div class="flex flex-col">
         <!-- Assuming lost count is passed or defaulted -->
        <span class="text-lg font-bold text-red-500">{{ unit.lost || 0 }}</span>
        <span class="text-[10px] text-gray-400 font-bold uppercase tracking-wider">LOST</span>
      </div>
    </div>

    <!-- Separator -->
    <hr class="border-gray-50 mb-4" />

    <!-- 3. Admin Info -->
    <div class="flex items-center gap-3 mb-5">
      <div class="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 flex-shrink-0">
         <User :size="20" />
      </div>
      <div class="flex flex-col min-w-0">
        <span 
          class="text-sm font-bold text-gray-900 truncate" 
          :title="unit.admin"
        >
          {{ unit.admin }}
        </span>
        <span class="text-xs text-gray-400 font-medium truncate">
          {{ unit.adminPhone || 'No Phone' }}
        </span>
      </div>
    </div>

    <!-- 4. Capacity Bar -->
    <div class="mb-6">
      <div class="flex justify-between items-center mb-1.5">
        <span class="text-xs font-semibold text-gray-400">Capacity</span>
        <div class="flex items-baseline gap-1">
          <span class="text-sm font-bold text-gray-900">{{ unit.students }}</span>
          <span class="text-xs text-gray-400">/{{ unit.maxCapacity || 150 }}</span>
        </div>
      </div>
      
      <!-- Progress Bar -->
      <div class="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden mb-1">
        <div 
          class="h-full bg-blue-600 rounded-full transition-all duration-500"
          :style="{ width: `${capacityPercentage}%` }"
        ></div>
      </div>
      
      <div class="text-right">
        <span class="text-[10px] text-gray-400 font-medium">{{ unit.availableCapacity }} available</span>
      </div>
    </div>

    <!-- 5. Actions -->
    <div class="flex flex-col gap-2.5">
      <BaseButton
        variant="primary" 
        size="md" 
        class="w-full shadow-md shadow-blue-100 hover:shadow-lg transition-all"
        @click="$emit('unit-click', unit)"
      >
        View Student List
      </BaseButton>
      <BaseButton
        variant="secondary" 
        size="md" 
        class="w-full bg-white hover:bg-gray-50 border border-gray-200 text-gray-600 shadow-sm"
        @click="$emit('settings-click', unit)"
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

defineEmits(['unit-click', 'settings-click']);

const capacityPercentage = computed(() => {
  const current = props.unit.students || 0;
  const max = props.unit.maxCapacity || 150;
  if (max === 0) return 0;
  return Math.min(100, (current / max) * 100);
});
</script>
