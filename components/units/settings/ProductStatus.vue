<template>
  <Badge :text="status" variant="success" size="sm" />
</template>

<script setup>
import { Badge } from '../../ui';

defineProps({
  status: {
    type: String,
    required: true
  }
});
</script>

