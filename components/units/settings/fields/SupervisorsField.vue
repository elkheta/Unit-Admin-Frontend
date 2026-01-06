<template>
  <div>
    <FormLabel text="SUPERVISORS" />
    <div class="flex flex-wrap gap-2 items-center">
      <SupervisorBadge 
        v-for="(supervisor, index) in supervisors" 
        :key="index"
        :name="supervisor"
      />
    </div>
  </div>
</template>

<script setup>
import { FormLabel } from '../../../ui';
import { SupervisorBadge } from './index.js';

defineProps({
  supervisors: {
    type: Array,
    default: () => []
  }
});
</script>

