<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
    
    <!-- Card Header -->
    <div class="p-4 border-b border-gray-100">
      <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1">{{ unit.title }}</h3>
      <p class="text-xs text-gray-400 font-mono">ID: {{ unit.id }}</p>
    </div>

    <!-- Content -->
    <div class="p-4 flex-1 flex flex-col gap-6">
      
      <!-- Key Metrics Row -->
      <div class="grid grid-cols-4 gap-15 text-center">
        <div class="flex flex-col items-center">
          <span class="text-lg font-bold text-green-600">{{ unit.students }}</span>
          <span class="text-[10px] font-medium text-gray-500 uppercase tracking-tight">Active</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-lg font-bold text-yellow-600">{{ unit.outside }}</span>
          <span class="text-[10px] font-medium text-gray-500 uppercase tracking-tight">Outside</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-lg font-bold text-orange-500">{{ unit.expiredCount }}</span>
          <span class="text-[10px] font-medium text-gray-500 uppercase tracking-tight">Expired</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-lg font-bold text-red-600">{{ unit.lost || 0 }}</span>
          <span class="text-[10px] font-medium text-gray-500 uppercase tracking-tight">Lost</span>
        </div>
      </div>

      <!-- Admin Info -->
      <div class="bg-gray-50 rounded-lg p-3 flex items-center gap-3">
        <div class="w-9 h-9 p-1 bg-white rounded-full flex items-center justify-center text-gray-400 border border-gray-200 shadow-sm">
          <User :size="20" />
        </div>
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-bold text-gray-800 truncate" :title="unit.admin">{{ unit.admin }}</span>
          <span class="text-xs text-gray-500 font-mono truncate">{{ unit.adminPhone || 'No Phone' }}</span>
        </div>
      </div>

      <!-- Detailed Stats -->
      <div class="space-y-3">
        <div class="flex justify-between items-center text-sm">
          <span class="text-gray-600">Capacity</span>
          <div class="flex flex-col items-end gap-1">
            <div class="flex items-center gap-2">
              <div class="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  class="h-full bg-blue-500 rounded-full transition-all" 
                  :style="{ width: `${capacityPercentage}%` }"
                ></div>
              </div>
              <span class="font-bold text-gray-900">{{ unit.students }}/{{ unit.maxCapacity || 150 }}</span>
            </div>
            <span class="text-xs text-gray-500">{{ unit.availableCapacity }} available</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Buttons -->
    <div class="p-3 bg-gray-50 border-t border-gray-100 grid grid-cols-1 gap-2">
      <button 
        @click="$emit('unit-click', unit)"
        class="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition-all shadow-sm shadow-blue-200"
      >
        View Student List
      </button>
      <button 
        @click="$emit('settings-click', unit)"
        class="flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-xs font-bold hover:bg-white hover:border-gray-400 transition-all bg-white shadow-sm"
      >
        Unit Setting
      </button>
    </div>
    
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { User } from 'lucide-vue-next';

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
