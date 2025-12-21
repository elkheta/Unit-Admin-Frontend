<template>
  <tr class="hover:bg-gray-50 transition-colors group">
    <td class="px-6 py-4">
      <span class="text-sm font-bold text-gray-900">{{ task.name }}</span>
    </td>
    <td class="px-6 py-4 text-center">
      <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
        {{ task.assignedGroups }}
      </span>
    </td>
    <td class="px-6 py-4">
      <TaskProgress
        :progress-count="task.progressCount"
        :progress-total="task.progressTotal"
        :progress-percent="task.progressPercent"
      />
    </td>
    <td class="px-6 py-4">
      <div class="flex flex-col gap-1 w-24">
        <div class="flex justify-between text-xs text-gray-500 font-medium">
          <span>{{ task.reportAvailable ? 1 : 0 }}/{{ task.reportAvailable ? 1 : 0 }}</span>
          <span>{{ task.reportAvailable ? 100 : 0 }}%</span>
        </div>
      </div>
    </td>
    <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ task.startDate }}</td>
    <td class="px-6 py-4 text-sm text-gray-900 font-medium">{{ task.expirationDate }}</td>
    <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="task.description">
      {{ task.description }}
    </td>
    <td class="px-6 py-4 text-center">
      <TaskStatus :status="task.status" />
    </td>
    <td class="px-6 py-4 text-center">
      <TaskVisibility :visibility="task.visibility" />
    </td>
    <td class="px-6 py-4 text-right">
      <div class="flex items-center justify-end gap-3 text-xs font-bold">
        <BaseButton variant="primary" size="sm" class="text-xs">Edit</BaseButton>
        <BaseButton variant="success" size="sm" class="text-xs">Clone</BaseButton>
        <BaseButton variant="danger" size="sm" class="text-xs">Delete</BaseButton>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { BaseButton } from '../ui';
import TaskProgress from './TaskProgress.vue';
import TaskStatus from './TaskStatus.vue';
import TaskVisibility from './TaskVisibility.vue';

defineProps({
  task: {
    type: Object,
    required: true
  }
});
</script>

