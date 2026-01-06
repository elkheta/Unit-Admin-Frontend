<template>
  <div>
    <FormLabel text="ADMIN" />
    <div class="relative">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
        <User :size="18" class="text-gray-400" />
      </div>
      <BaseInput 
        :model-value="adminName" 
        placeholder="Admin Name" 
        input-class="pl-10 bg-gray-50" 
        :disabled="true" 
      />
    </div>
  </div>
</template>

<script setup>
import { User } from 'lucide-vue-next';
import { BaseInput, FormLabel } from '../../../ui';

defineProps({
  adminName: {
    type: String,
    required: true
  }
});
</script>

