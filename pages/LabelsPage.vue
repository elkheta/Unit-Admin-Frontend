<template>
  <LabelsView
    :labels="labels"
    :categories="categories"
    @edit="handleEditLabel"
    @delete="handleDeleteLabel"
    @save="handleSaveLabel"
  />
</template>

<script setup>
import { computed } from 'vue';
import { LabelsView } from '../components/labels';
import { useLabels } from '../composables/useLabels';
import { useAuth } from '../composables/useAuth';

const { user } = useAuth();
const { 
  fetchLabels, 
  fetchCategories, 
  createLabel, 
  updateLabel, 
  deleteLabel 
} = useLabels();

// Fetch Data
const { result: labelsResult, refetch: refetchLabels } = fetchLabels();
const { result: categoriesResult } = fetchCategories();

// Computed Data
const labels = computed(() => labelsResult.value?.labels?.data || []);
const categories = computed(() => categoriesResult.value?.labelCategories || []);

const handleEditLabel = (_label) => {
  // Handled by LabelsView component
};

const handleDeleteLabel = async (id) => {
  const result = await deleteLabel(id);
  if (result.success) {
    refetchLabels();
  } else {
    alert('Failed to delete label');
  }
};

const handleSaveLabel = async (labelData) => {
  const payload = {
    name: labelData.name,
    label_category_id: labelData.category, // Category ID from modal
    description: labelData.description,
    color: labelData.color,
    // Add created_by only for create, but backend requires it. 
    // Usually backend handles current user but schema requires input.
    // We'll add it for create only if user exists.
  };

  if (labelData.id) {
    // Edit
    const result = await updateLabel(labelData.id, payload);
    if (result.success) {
      refetchLabels();
    } else {
      alert('Failed to update label');
    }
  } else {
    // Add
    if (user.value) {
      payload.created_by = user.value.id;
    }
    const result = await createLabel(payload);
    if (result.success) {
      refetchLabels();
    } else {
      alert('Failed to create label: ' + (result.error?.message || 'Unknown error'));
    }
  }
};
</script>

