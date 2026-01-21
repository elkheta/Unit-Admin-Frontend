<template>
  <div>
    <FormLabel text="ADMIN" />
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <User :size="18" class="text-blue-500" />
      </div>
      <div class="p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm">
        {{ adminName }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { User } from 'lucide-vue-next';
import { FormLabel } from '../../../ui';

defineProps({
  adminName: {
    type: String,
    required: true
  }
});
</script>

