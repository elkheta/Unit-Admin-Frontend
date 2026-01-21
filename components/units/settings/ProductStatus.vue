<template>
  <Badge :text="formattedStatus" variant="success" size="sm" />
</template>

<script setup>
import { computed } from 'vue';
import { Badge } from '../../ui';

const props = defineProps({
  status: {
    type: String,
    required: true
  }
});

const formattedStatus = computed(() => {
  // Convert status to proper case: "ACTIVE" -> "Active", "INACTIVE" -> "Inactive"
  return props.status.charAt(0).toUpperCase() + props.status.slice(1).toLowerCase();
});
</script>

