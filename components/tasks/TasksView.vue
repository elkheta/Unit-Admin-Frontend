<template>
  <div class="flex flex-col h-full animate-fade-in max-w-[1600px] mx-auto pb-8">
    <!-- Header -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
          <ListTodo :size="20" />
        </div>
        <h2 class="text-2xl font-bold text-gray-900">Task Management</h2>
      </div>

      <div class="flex items-center gap-3 w-full md:w-auto">
        <!-- Search Field -->
        <div class="relative flex-1 md:w-64">
          <input 
            type="text" 
            placeholder="Search tasks..."
            class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" 
          />
          <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>

        <BaseButton 
          variant="primary" 
          :icon="PlusCircle" 
          size="md" 
          class="whitespace-nowrap" 
          @click="$emit('add-task')"
        >
          Add Task
        </BaseButton>
      </div>
    </div>

    <!-- Tasks Table -->
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
            <tr 
              v-for="task in tasks" 
              :key="task.id" 
              class="hover:bg-gray-50 transition-colors group"
            >
              <td class="px-6 py-4">
                <span class="text-sm font-bold text-gray-900">{{ task.name }}</span>
              </td>
              <td class="px-6 py-4 text-center">
                <span class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                  {{ task.assignedGroups }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-col gap-1 w-24">
                  <div class="flex justify-between text-xs text-gray-500 font-medium">
                    <span>{{ task.progressCount }}/{{ task.progressTotal }}</span>
                    <span>{{ task.progressPercent }}%</span>
                  </div>
                  <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div class="h-full bg-blue-500 rounded-full" :style="{ width: `${task.progressPercent}%` }"></div>
                  </div>
                </div>
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
                <span
:class="`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  task.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                }`">
                  {{ task.status }}
                </span>
              </td>
              <td class="px-6 py-4 text-center">
                <span
:class="`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  task.visibility === 'visible' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                }`">
                  <Eye v-if="task.visibility === 'visible'" :size="12" />
                  <EyeOff v-else :size="12" />
                  {{ task.visibility === 'visible' ? 'Visible' : 'Hidden' }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-3 text-xs font-bold">
                  <BaseButton variant="primary" size="sm" class="text-xs">Edit</BaseButton>
                  <BaseButton variant="success" size="sm" class="text-xs">Clone</BaseButton>
                  <BaseButton variant="danger" size="sm" class="text-xs">Delete</BaseButton>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Search, PlusCircle, ListTodo, Eye, EyeOff } from 'lucide-vue-next';
import { BaseButton } from '../ui';

defineProps({
  tasks: {
    type: Array,
    default: () => []
  }
});

defineEmits(['add-task']);
</script>

