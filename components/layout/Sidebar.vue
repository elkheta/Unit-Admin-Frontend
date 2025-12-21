<template>
  <aside class="w-50 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20">
    <!-- Sidebar Header -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
      <div class="flex items-center gap-2">
        <IconBadge 
          :icon="Layout" 
          :size="18" 
          :stroke-width="2.5" 
          variant="primary" 
          custom-size="w-8 h-8"
        />
        <div class="flex flex-col">
          <span class="font-bold text-gray-900 leading-tight">EduDash</span>
          <span class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Support Dashboard</span>
        </div>
      </div>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <NavItem
        v-for="item in navItems"
        :id="item.id"
        :key="item.id"
        :label="item.label"
        :icon="item.icon"
        :active="isActive(item.route)"
        variant="default"
        @click="handleNavigation(item.route)"
      />
    </nav>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router';
import { Layout } from 'lucide-vue-next';
import { NavItem, IconBadge } from '../ui';

const route = useRoute();
const router = useRouter();

defineProps({
  navItems: {
    type: Array,
    required: true
  }
});

const isActive = (routePath) => {
  return route.path === routePath;
};

const handleNavigation = (routePath) => {
  router.push(routePath);
};
</script>
