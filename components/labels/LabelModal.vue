<template>
  <BaseModal 
    :is-open="isOpen" 
    :title="label.id ? 'Edit Label' : 'Add New Label'"
    @close="$emit('close')"
  >
    <div class="space-y-4">
      <BaseInput 
        v-model="localLabel.name" 
        label="Label Name" 
        placeholder="e.g. VIP, Urgent"
      />
      
      <div class="grid grid-cols-2 gap-4">
        <BaseSelect
          v-model="localLabel.category"
          label="Linked Category"
          placeholder="Select Category"
          :options="categoryOptions"
        />
        
        <BaseSelect
          v-model="localLabel.color"
          label="Label Color"
          placeholder="Select Color"
          :options="colorOptions"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
        <textarea 
          v-model="localLabel.description" 
          placeholder="Describe the purpose of this label..."
          class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none text-gray-700 bg-white"
        ></textarea>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3">
        <BaseButton variant="secondary" size="md" @click="$emit('close')">
          Cancel
        </BaseButton>
        <BaseButton 
          variant="primary"
          size="md" 
          @click="handleSave"
        >
          Save Label
        </BaseButton>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { BaseModal, BaseButton, BaseInput, BaseSelect } from '../ui';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  label: {
    type: Object,
    default: () => ({})
  },
  categories: {
    type: Array,
    default: () => []
  }
});

const categoryOptions = computed(() => {
  return props.categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));
});

const colorOptions = [
  { value: 'Red', label: 'Red' },
  { value: 'Yellow', label: 'Yellow' },
  { value: 'Blue', label: 'Blue' },
  { value: 'Pink', label: 'Pink' },
  { value: 'Black', label: 'Black' },
  { value: 'Orange', label: 'Orange' },
  { value: 'Green', label: 'Green' },
  { value: 'Purple', label: 'Purple' },
  { value: 'Brown', label: 'Brown' },
  { value: 'White', label: 'White' }
];

const emit = defineEmits(['close', 'save']);

const localLabel = ref({ name: '', category: '', color: '', description: '' });

watch(() => props.label, (newLabel) => {
  // If editing, category might be an object {id, name}, retrieve id for select
  const categoryId = newLabel.category?.id || newLabel.category; 
  localLabel.value = { 
    ...newLabel,
    category: categoryId
  };
}, { immediate: true, deep: true });

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    localLabel.value = { name: '', category: '', color: '', description: '' };
  } else if (props.label && Object.keys(props.label).length > 0) {
     const categoryId = props.label.category?.id || props.label.category;
    localLabel.value = { ...props.label, category: categoryId };
  }
});

const handleSave = () => {
  emit('save', { ...localLabel.value });
};
</script>

