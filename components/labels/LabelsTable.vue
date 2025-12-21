<template>
  <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left border-collapse">
        <thead>
          <tr class="bg-gray-50 border-b border-gray-100">
            <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Label Name</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Linked Category</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Creation Date</th>
            <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <LabelRow
            v-for="label in labels"
            :key="label.id"
            :label="label"
            @edit="$emit('edit', $event)"
            @delete="$emit('delete', $event)"
          />
        </tbody>
      </table>
    </div>
    <div v-if="labels.length === 0" class="p-8 text-center text-gray-500">
      No labels found.
    </div>
  </div>
</template>

<script setup>
import LabelRow from './LabelRow.vue';

defineProps({
  labels: {
    type: Array,
    default: () => []
  }
});

defineEmits(['edit', 'delete']);
</script>

