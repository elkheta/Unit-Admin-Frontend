<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse min-w-[1500px]">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Task Name</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
              Assigned Group Numbers
            </th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progress</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Report</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expiration Date</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Visibility</th>
            <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <TaskRow
            v-for="task in tasks"
            :key="task.id"
            :task="task"
          />
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import TaskRow from './TaskRow.vue';

defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
});
</script>

