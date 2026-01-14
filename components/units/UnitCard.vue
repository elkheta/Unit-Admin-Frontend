<template>
  <BaseCard padding="none" class="overflow-hidden hover:shadow-lg transition-all duration-200 relative" :style="{ height: '460px' }">
    <div class="flex flex-col h-full p-6 gap-4">
      
      <!-- 1. Header (Fixed) -->
      <div class="flex-none flex items-start justify-between gap-4">
        <div class="flex items-start gap-3 flex-1 min-w-0">
          <IconBadge
            :icon="Package" 
            :size="20" 
            :stroke-width="2" 
            variant="primary" 
            custom-size="w-12 h-12"
            class="shadow-blue-100 shadow-md flex-shrink-0" 
          />
          <div class="flex-1 min-w-0">
            <h3 
              class="text-lg font-bold text-gray-900 leading-tight mb-1"
              style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
              :title="unit.title"
            >
              {{ unit.title }}
            </h3>
            <div class="flex items-start gap-1.5 text-gray-500">
              <User :size="14" class="flex-shrink-0 mt-0.5" />
              <span 
                class="text-sm" 
                style="display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;"
                :title="unit.admin"
              >
                {{ unit.admin }}
              </span>
            </div>
          </div>
        </div>
        <!-- Expired Button -->
        <BaseButton
          :variant="expiredCount > 0 ? 'warning' : 'secondary'" 
          size="sm"
          class="text-xs px-3 py-1.5 flex-shrink-0" 
          :disabled="expiredCount === 0" 
          @click="$emit('expired-click', unit)"
        >
          {{ expiredCount }} Expired
        </BaseButton>
      </div>

      <!-- 2. Groups (Flexible & Scrollable) -->
      <div class="flex-1 min-h-0 flex flex-col gap-2">
        <div class="flex-none flex items-center gap-2">
          <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Groups</span>
          <span class="text-xs text-gray-400">({{ activeGroupsCount }})</span>
        </div>
        <div class="flex-1 min-h-0 overflow-y-auto thin-scrollbar pr-1 space-y-2">
          <GroupItem v-for="(group, idx) in activeGroups" :key="idx" :group="group" />
        </div>
      </div>

      <!-- 3. Stats (Fixed) -->
      <div class="flex-none grid grid-cols-4 gap-4 pb-4 border-b border-gray-100">
        <div class="flex flex-col items-center">
          <span class="text-xl font-bold text-blue-600 mb-1">{{ unit.students }}</span>
          <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Students</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-xl font-bold text-red-500 mb-1">{{ unit.outside }}</span>
          <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Outside</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-xl font-bold text-green-600 mb-1">{{ unit.availableCapacity }}</span>
          <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Available</span>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-xl font-bold text-yellow-500 mb-1">{{ unit.reminders }}</span>
          <span class="text-[10px] text-gray-500 font-medium uppercase tracking-wide">Reminders</span>
        </div>
      </div>

      <!-- 4. Action Buttons (Fixed) -->
      <div class="flex-none flex flex-col gap-2">
        <BaseButton
          variant="primary" 
          size="md" 
          class="w-full shadow-md shadow-blue-100 hover:shadow-lg transition-shadow"
          @click="$emit('unit-click', unit)"
        >
          Students List
        </BaseButton>
        <BaseButton
          variant="secondary" 
          size="md" 
          class="w-full bg-gray-50 hover:bg-gray-100 border-gray-200 text-gray-600"
          @click="$emit('settings-click', unit)"
        >
          Unit Settings
        </BaseButton>
      </div>
      
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import { Package, User } from 'lucide-vue-next';
import { BaseCard, BaseButton, IconBadge } from '../ui';
import GroupItem from './GroupItem.vue';

const props = defineProps({
  unit: {
    type: Object,
    required: true
  },
  expiredCount: {
    type: Number,
    default: 0
  }
});

defineEmits(['unit-click', 'expired-click', 'settings-click']);

const activeGroups = computed(() => {
  return props.unit.groups?.filter(group => group.current > 0) || [];
});

const activeGroupsCount = computed(() => {
  return activeGroups.value.length;
});
</script>
