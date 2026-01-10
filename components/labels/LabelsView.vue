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
                  <div 
                    class="w-3 h-3 rounded-full shadow-sm ring-2 ring-white"
                    :style="{ backgroundColor: label.color || '#ccc' }"
                    :title="label.color"
                  ></div>
                  <span class="text-sm font-bold text-gray-900">{{ label.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <Badge v-if="label.category" :text="getCategoryName(label.category)" variant="default" />
              </td>
              <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{{ label.description }}</td>
              <td class="px-6 py-4 text-sm text-gray-500">{{ formatDate(label.created_at || label.creationDate) }}</td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end gap-2">
                  <BaseButton 
                    variant="primary" 
                    size="sm" 
                    :icon="Edit3" 
                    custom-class="p-1.5 !text-white"
                    title="Edit" 
                    @click="handleEdit(label)" 
                  />
                  <BaseButton 
                    variant="danger" 
                    size="sm" 
                    :icon="Trash2" 
                    custom-class="p-1.5 !text-white"
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
      :categories="categories"
      @close="closeModal"
      @save="handleSave"
    />

    <!-- Delete Confirmation Modal -->
    <BaseModal
      :is-open="isDeleteModalOpen"
      title="Delete Label"
      @close="closeDeleteModal"
    >
      <div class="space-y-4">
        <p class="text-gray-700">
          Are you sure you want to delete this label? This action cannot be undone.
        </p>
      </div>
      <template #footer>
        <div class="flex justify-end gap-3">
          <BaseButton variant="secondary" size="md" @click="closeDeleteModal">
            Cancel
          </BaseButton>
          <BaseButton 
            variant="danger"
            size="md" 
            @click="confirmDelete"
          >
            Delete
          </BaseButton>
        </div>
      </template>
    </BaseModal>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { PlusCircle, Edit3, Trash2 } from 'lucide-vue-next';
import { BaseButton, BaseModal, Badge } from '../ui';
import { LabelModal } from './index.js';

defineProps({
  labels: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  }
});


const emit = defineEmits(['delete', 'save']);

const isDeleteModalOpen = ref(false);
const labelToDelete = ref(null);

const handleDelete = (id) => {
  labelToDelete.value = id;
  isDeleteModalOpen.value = true;
};

const closeDeleteModal = () => {
  isDeleteModalOpen.value = false;
  labelToDelete.value = null;
};

const confirmDelete = () => {
  if (labelToDelete.value) {
    emit('delete', labelToDelete.value);
    closeDeleteModal();
  }
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

const getCategoryName = (category) => {
  if (!category) return '';
  return category.name || category; 
};

const formatDate = (dateString) => {
  if (!dateString) return '-';
  // Check if dateString is just YYYY-MM-DD or full ISO
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};
</script>

