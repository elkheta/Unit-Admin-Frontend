<template>
  <div class="mb-4 mt-auto">
    <GroupsListHeader :count="activeGroupsCount" />
    <div class="space-y-1">
      <GroupItem 
        v-for="(group, idx) in activeGroups" 
        :key="idx"
        :group="group"
      />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { GroupsListHeader, GroupItem } from './index.js';

const props = defineProps({
  groups: {
    type: Array,
    required: true
  }
});

const activeGroups = computed(() => {
  return props.groups.filter(group => group.current > 0);
});

const activeGroupsCount = computed(() => {
  return activeGroups.value.length;
});
</script>

