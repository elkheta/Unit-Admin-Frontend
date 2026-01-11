<template>
  <div>
    <FormLabel text="SUPERVISORS" />
    <div class="text-sm text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 min-h-[42px] flex items-center">
      {{ supervisors && supervisors.length > 0 ? supervisors.join(', ') : 'No supervisors assigned' }}
    </div>
  </div>
</template>

<script setup>
import { FormLabel } from '../../../ui';

defineProps({
  supervisors: {
    type: Array,
    default: () => []
  }
});
</script>

