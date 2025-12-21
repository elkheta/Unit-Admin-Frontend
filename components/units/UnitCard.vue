<template>
  <BaseCard padding="lg" class="flex flex-col h-full hover:shadow-lg transition-all duration-200">
    <!-- Header with Icon, Title, Admin, and Expired Button -->
    <div class="flex items-start justify-between gap-4 mb-6">
      <div class="flex items-start gap-3 flex-1 min-w-0">
        <IconBadge :icon="Package" :size="20" :stroke-width="2" variant="primary" custom-size="w-12 h-12"
          class="shadow-blue-100 shadow-md flex-shrink-0" />
        <div class="flex-1 min-w-0">
          <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1">{{ unit.title }}</h3>
          <div class="flex items-center gap-1.5 text-gray-500">
            <User :size="14" class="flex-shrink-0" />
            <span class="text-sm truncate">{{ unit.admin }}</span>
          </div>
        </div>
      </div>
      <!-- Expired Button -->
      <BaseButton :variant="expiredCount > 0 ? 'warning' : 'secondary'" size="sm"
        class="text-xs px-3 py-1.5 flex-shrink-0" :disabled="expiredCount === 0" @click="$emit('expired-click', unit)">
        {{ expiredCount }} Expired
      </BaseButton>
    </div>

    <!-- Groups Section -->
    <div class="mb-6">
      <div class="flex items-center gap-2 mb-3">
        <span class="text-xs font-semibold text-gray-500 uppercase tracking-wide">Groups</span>
        <span class="text-xs text-gray-400">({{ activeGroupsCount }})</span>
      </div>
      <div class="space-y-2">
        <GroupItem v-for="(group, idx) in activeGroups" :key="idx" :group="group" />
      </div>
    </div>

    <!-- Stats Section -->
    <div class="grid grid-cols-4 gap-4 mb-6 pb-6 border-b border-gray-100">
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

    <!-- Action Button at the bottom -->
    <div class="mt-auto">
      <BaseButton variant="primary" size="md" class="w-full shadow-md shadow-blue-100 hover:shadow-lg transition-shadow"
        @click="$emit('unit-click', unit)">
        Students List
      </BaseButton>
    </div>
  </BaseCard>
</template>

<script setup>
import { computed } from 'vue';
import { Package, User } from 'lucide-vue-next';
import { BaseCard, BaseButton, IconBadge } from '../ui';
import { GroupItem } from './index.js';

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

defineEmits(['unit-click', 'expired-click']);

const activeGroups = computed(() => {
  return props.unit.groups?.filter(group => group.current > 0) || [];
});

const activeGroupsCount = computed(() => {
  return activeGroups.value.length;
});
</script>
