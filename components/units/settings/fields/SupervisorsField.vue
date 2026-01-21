<template>
  <div>
    <FormLabel text="SUPERVISORS" />
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <User :size="18" class="text-green-500" />
      </div>
      <div class="p-3 pl-10 bg-gray-50 border border-gray-200 rounded-lg text-gray-900 font-medium text-sm">
        {{ supervisors && supervisors.length > 0 ? supervisors.join(', ') : 'No supervisors assigned' }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { User } from 'lucide-vue-next';
import { FormLabel } from '../../../ui';

defineProps({
  supervisors: {
    type: Array,
    default: () => []
  }
});
</script>

