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
        :name="userName" 
        :role="userRole" 
        :icon="User" 
        direction="rtl"
      />

      <Divider orientation="vertical" spacing="md" />

      <BaseButton 
        variant="outline-danger" 
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
import { computed } from 'vue';
import { LogOut, User, Layout } from 'lucide-vue-next';
import { BaseButton, UserProfile, Divider, IconBadge } from '../ui';
import { useAuth } from '../../composables/useAuth';

defineProps({
  activeTabLabel: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['logout']);
const { user } = useAuth();
// If needed, we can compute a display role from the user.roles array
// For now, we defaults to 'Supervisor' if no role is present or logic is complex.
const userRole = computed(() => user.value?.roles?.[0] || 'Supervisor');
const userName = computed(() => user.value?.name || 'Supervisor User');

const handleLogout = () => {
  emit('logout');
};
</script>
