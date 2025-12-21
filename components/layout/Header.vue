<template>
  <header class="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
    <!-- Left side: Breadcrumb / Title -->
    <div class="flex items-center gap-2">
      <!-- Mobile menu toggle could go here -->
      <IconBadge 
        :icon="Layout" 
        :size="18" 
        variant="primary" 
        custom-size="w-8 h-8" 
        class="md:hidden mr-2"
      />
    </div>

    <!-- Right side: User Profile & Actions -->
    <div class="flex items-center gap-6">
      <UserProfile 
        name="Supervisor User" 
        role="Supervisor" 
        :icon="User" 
        direction="rtl"
      />

      <Divider orientation="vertical" spacing="md" />

      <BaseButton 
        variant="danger" 
        :icon="LogOut" 
        size="md"
        @click="handleLogout"
      >
        Logout
      </BaseButton>
    </div>
  </header>
</template>

<script setup>
import { LogOut, User, Layout } from 'lucide-vue-next';
import { BaseButton, UserProfile, Divider, IconBadge } from '../ui';

defineProps({
  activeTabLabel: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['logout']);

const handleLogout = () => {
  emit('logout');
};
</script>
