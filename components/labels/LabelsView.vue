<template>
  <div class="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Labels</h2>
        <p class="text-gray-500 mt-1">Manage labels and their assigned categories</p>
      </div>
      <BaseButton variant="primary" :icon="PlusCircle" size="md" @click="openModal">
        Add New Label
      </BaseButton>
    </div>

    <!-- Labels Table -->
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
            <tr 
              v-for="label in labels" 
              :key="label.id" 
              class="hover:bg-gray-50 transition-colors group"
            >
              <td class="px-6 py-4 text-sm text-gray-500 font-mono">#{{ label.id }}</td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <IconBadge :icon="Tag" :size="14" variant="success" shape="circle" custom-size="w-8 h-8" />
                  <span class="text-sm font-bold text-gray-900">{{ label.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <Badge :text="label.category" variant="default" />
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{{ label.description }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ label.creationDate }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <BaseButton 
                    variant="primary" 
                    size="sm" 
                    :icon="Edit3" 
                    custom-class="p-1.5 text-blue-600 hover:bg-blue-50"
                    title="Edit" 
                    @click="handleEdit(label)" 
                  />
                  <BaseButton 
                    variant="danger" 
                    size="sm" 
                    :icon="Trash2" 
                    custom-class="p-1.5 text-red-600 hover:bg-red-50"
                    title="Delete" 
                    @click="handleDelete(label.id)" 
                  />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div v-if="labels.length === 0" class="p-8 text-center text-gray-500">
        No labels found.
      </div>
    </div>

    <!-- Label Modal -->
    <LabelModal
      :is-open="isModalOpen"
      :label="currentLabel"
      @close="closeModal"
      @save="handleSave"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { PlusCircle, Tag, Edit3, Trash2 } from 'lucide-vue-next';
import { BaseButton } from '../ui';
import LabelModal from './LabelModal.vue';

defineProps({
  labels: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['delete', 'save']);

const handleDelete = (id) => {
  emit('delete', id);
};

const isModalOpen = ref(false);
const currentLabel = ref({});

const openModal = () => {
  currentLabel.value = {};
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  currentLabel.value = {};
};

const handleEdit = (label) => {
  currentLabel.value = { ...label };
  isModalOpen.value = true;
};

const handleSave = (labelData) => {
  emit('save', labelData);
  closeModal();
};
</script>

