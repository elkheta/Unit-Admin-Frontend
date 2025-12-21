<template>
  <div class="flex items-start gap-3 mb-3">
    <IconBadge 
      :icon="Package" 
      :size="20" 
      :stroke-width="2" 
      variant="primary" 
      custom-size="w-10 h-10"
      class="shadow-blue-100 shadow-lg" 
    />
    <div class="flex-1 min-w-0">
      <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1.5">{{ unit.title }}</h3>
      <div class="flex items-center gap-2 text-gray-500">
        <User :size="14" />
        <span class="text-xs">{{ unit.admin }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Package, User } from 'lucide-vue-next';
import { IconBadge } from '../ui';

defineProps({
  unit: {
    type: Object,
    required: true
  }
});
</script>

