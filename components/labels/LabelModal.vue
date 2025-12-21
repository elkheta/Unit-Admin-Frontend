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
      <BaseSelect
        v-model="localLabel.category"
        label="Linked Category"
        placeholder="Select Category"
        :options="categoryOptions"
      />
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
import { ref, watch } from 'vue';
import { BaseModal, BaseButton, BaseInput, BaseSelect } from '../ui';

const categoryOptions = [
  { value: 'status', label: 'Status' },
  { value: 'behavior', label: 'Behavior' },
  { value: 'academic', label: 'Academic' },
  { value: 'general', label: 'General' }
];

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  label: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['close', 'save']);

const localLabel = ref({ name: '', category: '', description: '' });

watch(() => props.label, (newLabel) => {
  localLabel.value = { ...newLabel };
}, { immediate: true, deep: true });

watch(() => props.isOpen, (isOpen) => {
  if (!isOpen) {
    localLabel.value = { name: '', category: '', description: '' };
  } else if (props.label && Object.keys(props.label).length > 0) {
    localLabel.value = { ...props.label };
  }
});

const handleSave = () => {
  emit('save', { ...localLabel.value });
};
</script>

