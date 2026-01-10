<template>
  <div class="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">Labels</h2>
        <p class="text-gray-500 mt-1">Manage labels and their assigned categories</p>
      </div>
      <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
        <div class="relative w-full sm:w-64">
          <BaseInput 
            :model-value="searchQuery"
            @update:model-value="$emit('update:searchQuery', $event)"
            placeholder="Search labels..." 
            :icon="Search"
          />
        </div>
        <BaseButton variant="primary" :icon="PlusCircle" size="md" @click="openModal">
          Add New Label
        </BaseButton>
      </div>
    </div>

    <!-- Labels Table -->
    <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
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

      <!-- Pagination -->
      <div v-if="labels.length > 0 && paginatorInfo" class="border-t border-gray-200 px-4 py-3 flex items-center justify-between sm:px-6">
        <div class="flex-1 flex justify-between sm:hidden">
          <BaseButton 
            variant="secondary" 
            size="sm" 
            :disabled="paginatorInfo.currentPage === 1"
            @click="$emit('page-change', paginatorInfo.currentPage - 1)"
          >
            Previous
          </BaseButton>
          <BaseButton 
            variant="secondary" 
            size="sm" 
            :disabled="!paginatorInfo.hasMorePages"
            @click="$emit('page-change', paginatorInfo.currentPage + 1)"
          >
            Next
          </BaseButton>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700">
              Showing
              <span class="font-medium">{{ paginatorInfo.firstItem }}</span>
              to
              <span class="font-medium">{{ paginatorInfo.lastItem }}</span>
              of
              <span class="font-medium">{{ paginatorInfo.total }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="paginatorInfo.currentPage === 1"
                @click="$emit('page-change', paginatorInfo.currentPage - 1)"
              >
                <span class="sr-only">Previous</span>
                <ChevronLeft class="h-5 w-5" />
              </button>
              
              <!-- Current Page Indicator -->
              <span class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                {{ paginatorInfo.currentPage }}
              </span>

              <button
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!paginatorInfo.hasMorePages"
                @click="$emit('page-change', paginatorInfo.currentPage + 1)"
              >
                <span class="sr-only">Next</span>
                <ChevronRight class="h-5 w-5" />
              </button>
            </nav>
          </div>
        </div>
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
import { PlusCircle, Edit3, Trash2, Search, ChevronLeft, ChevronRight } from 'lucide-vue-next';
import { BaseButton, BaseModal, Badge, BaseInput } from '../ui';
import { LabelModal } from './index.js';

defineProps({
  labels: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  },
  paginatorInfo: {
    type: Object,
    default: () => ({})
  },
  searchQuery: {
    type: String,
    default: ''
  }
});


const emit = defineEmits(['delete', 'save', 'update:searchQuery', 'page-change']);

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

