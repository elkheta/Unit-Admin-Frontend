<template>
  <div class="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:shadow-sm transition-shadow">
    <!-- Left Side -->
    <div class="flex flex-col gap-3">
      <!-- Note Text -->
      <p class="text-base font-medium text-gray-900">{{ reminder.description }}</p>

      <!-- Badges Row -->
      <div class="flex items-center gap-2 flex-wrap">
        <!-- Person Badge -->
        <span class="px-2.5 py-0.5 rounded-md text-sm font-medium bg-blue-50 text-blue-700">
          {{ reminder.personName }}
        </span>
        
        <!-- Group Badge -->
        <span class="px-2.5 py-0.5 rounded-md text-sm font-medium bg-purple-50 text-purple-700">
          {{ reminder.group }}
        </span>

        <!-- Unit Badge -->
        <span class="px-2.5 py-0.5 rounded-md text-sm font-medium bg-sky-50 text-sky-700">
          {{ reminder.unit }}
        </span>

        <!-- Status Badge -->
        <span class="px-2.5 py-0.5 rounded-md text-sm font-medium bg-yellow-50 text-yellow-700 text-nowrap">
          {{ reminder.status || 'Pending' }}
        </span>
      </div>
    </div>

    <!-- Right Side -->
    <div class="flex items-center gap-6 flex-shrink-0">
      <!-- Date Info -->
      <div class="text-right">
        <div class="text-sm font-bold text-gray-900">{{ reminder.dueDate }}</div>
        <div class="text-xs" :class="{
          'text-red-500': reminder.statusIndicator === 'Overdue',
          'text-orange-500': reminder.statusIndicator === 'Due Soon',
          'text-gray-500': reminder.statusIndicator === 'Upcoming'
        }">
          {{ reminder.statusIndicator }}
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3">
        <!-- Complete -->
        <button 
          @click="$emit('complete', reminder.id)" 
          class="text-green-500 hover:text-green-600 transition-colors p-1" 
          title="Complete"
        >
          <Check class="w-5 h-5" />
        </button>

        <!-- Dismiss -->
        <button 
          @click="$emit('dismiss', reminder.id)" 
          class="text-red-500 hover:text-red-600 transition-colors p-1" 
          title="Dismiss"
        >
          <X class="w-5 h-5" />
        </button>

        <!-- View -->
        <button 
          @click="$emit('view', reminder)"
          class="text-blue-500 hover:text-blue-600 transition-colors p-1" 
          title="View Details"
        >
          <Eye class="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Check, X, Eye } from 'lucide-vue-next';

defineProps({
  reminder: {
    type: Object,
    required: true
  }
});

defineEmits(['complete', 'dismiss', 'view']);
</script>

