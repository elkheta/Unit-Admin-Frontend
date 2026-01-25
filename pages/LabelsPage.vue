<template>
  <LabelsView
    :labels="labels"
    :categories="categories"
    :paginator-info="paginatorInfo"
    :search-query="searchQuery"
    @update:search-query="handleSearch"
    @page-change="handlePageChange"
    @edit="handleEditLabel"
    @delete="handleDeleteLabel"
    @save="handleSaveLabel"
  />
</template>

<script setup>
import { computed, ref } from 'vue';
import { PlusCircle, Edit3, Trash2, Search, ChevronLeft, ChevronRight, Tag } from 'lucide-vue-next';
import { LabelsView } from '../components/labels';
import { useLabels } from '../composables/useLabels';
import { useAuth } from '../composables/useAuth';
import { useToast } from '../composables/useToast';
import { BaseButton, BaseModal, Badge, BaseInput } from '../components/ui';

const { user, refreshAuth } = useAuth();
const { 
  fetchLabels, 
  fetchCategories, 
  createLabel, 
  updateLabel, 
  deleteLabel 
} = useLabels();

// Search & Pagination
const searchQuery = ref('');
const debouncedSearchQuery = ref('');
const currentPage = ref(1);

const variables = computed(() => ({
  page: currentPage.value,
  first: 10,
  name: debouncedSearchQuery.value ? `%${debouncedSearchQuery.value}%` : undefined
}));

// Fetch Data
const { result: labelsResult, loading: labelsLoading, refetch: refetchLabels } = fetchLabels(variables);
const { result: categoriesResult } = fetchCategories();

// Computed Data
const labels = computed(() => labelsResult.value?.labels?.data || []);
const paginatorInfo = computed(() => labelsResult.value?.labels?.paginatorInfo || {});
const categories = computed(() => categoriesResult.value?.labelCategories || []);

const { success, error, loading, removeToast } = useToast();

const handlePageChange = (page) => {
  currentPage.value = page;
};

let debounceTimer = null;
const handleSearch = (query) => {
  searchQuery.value = query; // Update config immediately for UI
  
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debouncedSearchQuery.value = query;
    currentPage.value = 1; // Reset to page 1 on search
  }, 300);
};

const handleEditLabel = (_label) => {
  // Handled by LabelsView component
};

const handleDeleteLabel = async (id) => {
  if (!confirm('Are you sure you want to delete this label?')) return;

  const loadingId = loading('Deleting label...');
  try {
    const result = await deleteLabel(id);
    removeToast(loadingId);
    
    if (result.success) {
      success('Label deleted successfully');
      refetchLabels();
    } else {
      error('Failed to delete label');
    }
  } catch (e) {
    removeToast(loadingId);
    error('Error deleting label: ' + e.message);
  }
};

const handleSaveLabel = async (labelData) => {
  const payload = {
    name: labelData.name,
    label_category_id: labelData.category,
    description: labelData.description,
    color: labelData.color,
  };

  const loadingId = loading(labelData.id ? 'Updating label...' : 'Creating label...');

  try {
    if (labelData.id) {
      // Edit
      const result = await updateLabel(labelData.id, payload);
      removeToast(loadingId); // Clear loading
      
      if (result.success) {
        success('Label updated successfully');
        refetchLabels();
      } else {
        error('Failed to update label');
      }
    } else {
      // Add
      // Add
      
      const result = await createLabel(payload);
      removeToast(loadingId); // Clear loading
      
      if (result.success) {
        success('Label created successfully');
        refetchLabels();
      } else {
        error('Failed to create label: ' + (result.error?.message || 'Unknown error'));
      }
    }
  } catch (e) {
    removeToast(loadingId);
    error('An unexpected error occurred: ' + e.message);
  }
};
</script>

