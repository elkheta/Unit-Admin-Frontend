<template>
  <LabelsView
    :labels="labels"
    @edit="handleEditLabel"
    @delete="handleDeleteLabel"
    @save="handleSaveLabel"
  />
</template>

<script setup>
import { ref } from 'vue';
import { LabelsView } from '../components/labels';

// Labels state
const labels = ref([
  { id: 1, name: "VIP", category: "Status", description: "Very Important Person", creationDate: "2024-01-15" },
  { id: 2, name: "New", category: "Status", description: "Newly joined student", creationDate: "2024-03-10" },
  { id: 3, name: "Warning", category: "Behavior", description: "Student has warnings", creationDate: "2024-02-22" },
  { id: 4, name: "Excellent", category: "Academic", description: "Top performing student", creationDate: "2024-01-20" },
]);

const handleEditLabel = (_label) => {
  // Handled by LabelsView component
};

const handleDeleteLabel = (id) => {
  if (window.confirm('Are you sure you want to delete this label?')) {
    labels.value = labels.value.filter(l => l.id !== id);
  }
};

const handleSaveLabel = (labelData) => {
  if (labelData.id) {
    // Edit
    const index = labels.value.findIndex(l => l.id === labelData.id);
    if (index !== -1) {
      labels.value[index] = { ...labels.value[index], ...labelData };
    }
  } else {
    // Add
    const newLabel = {
      id: Math.max(...labels.value.map(l => l.id), 0) + 1,
      name: labelData.name || 'New Label',
      category: labelData.category || 'General',
      description: labelData.description || '',
      creationDate: new Date().toISOString().split('T')[0]
    };
    labels.value.push(newLabel);
  }
};
</script>

