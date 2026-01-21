<template>
  <div class="mb-6">
    <FormLabel text="UNIT EDUCATIONAL SECTIONS" />
    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
      <div class="flex flex-wrap gap-2">
        <Badge
          v-for="(section, index) in sections"
          :key="index"
          :text="section"
          variant="primary"
          size="md"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { Badge, FormLabel } from '../../ui';

defineProps({
  sections: {
    type: Array,
    default: () => []
  }
});
</script>

