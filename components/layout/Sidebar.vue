<template>
  <!-- Main Navigation Sidebar -->
  <aside v-if="!isUnitPage" class="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col flex-shrink-0 z-20">
    <!-- Sidebar Header -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
      <div class="flex items-center gap-2">
        <IconBadge :icon="Layout" :size="18" :stroke-width="2.5" variant="primary" custom-size="w-8 h-8" />
        <div class="flex flex-col">
          <span class="font-bold text-gray-900 leading-tight">EduDash</span>
          <span class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Support Dashboard</span>
        </div>
      </div>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <NavItem v-for="item in mainNavItems" :id="item.id" :key="item.id" :label="item.label" :icon="item.icon"
        :active="isActive(item.route)" variant="default" @click="handleNavigation(item.route)" />
    </nav>
  </aside>

  <!-- Unit Navigation Sidebar -->
  <aside v-else class="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col flex-shrink-0 z-20">
    <!-- Unit Header -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100 overflow-hidden">
      <button class="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors w-full"
        @click="handleBackToMain">
        <ArrowLeft :size="18" class="flex-shrink-0" />
        <div class="flex flex-col text-left min-w-0 flex-1">
          <span class="font-semibold text-gray-900 leading-tight truncate block" :title="unitName">{{ unitName }}</span>
          <span class="text-[10px] text-gray-500 font-medium">BACK TO MAIN</span>
        </div>
      </button>
    </div>

    <!-- Navigation List -->
    <nav class="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
      <NavItem v-for="item in unitNavItems" :id="item.id" :key="item.id" :label="item.label" :icon="item.icon"
        :active="isActive(item.route)" variant="default" @click="handleNavigation(item.route)" />
    </nav>
  </aside>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Layout, ArrowLeft, Users, Settings, LayoutDashboard, ClipboardList, Tag } from 'lucide-vue-next';
import { NavItem, IconBadge } from '../ui';
import { useRouteUtils } from '../../composables/useRouteUtils';
import { useUnitData } from '../../composables/useUnitData';
import { useAuth } from '../../composables/useAuth';

const route = useRoute();
const router = useRouter();
const { isUnitPage, unitSlug } = useRouteUtils();
const { unitData } = useUnitData();
const { user } = useAuth();

// Main navigation items
const mainNavItems = computed(() => {
  return [
    { id: 'main', label: 'Main', icon: LayoutDashboard, route: '/dashboard/main' },
    { id: 'units-list', label: 'Unit List', icon: ClipboardList, route: '/dashboard/units' },
    { id: 'labels', label: 'Labels', icon: Tag, route: '/dashboard/labels' },
  ];

});

// Unit navigation items
const unitNavItems = computed(() => [
  {
    id: 'student-list',
    label: 'Student List',
    icon: Users,
    route: `/dashboard/units/${unitSlug.value}/students`
  },
  {
    id: 'unit-settings',
    label: 'Unit Settings',
    icon: Settings,
    route: `/dashboard/units/${unitSlug.value}/settings`
  },
]);

const unitName = computed(() => {
  return unitData.value?.name || unitSlug.value;
});

const safeDecode = (value) => {
  try {
    return decodeURIComponent(String(value || ''));
  } catch {
    return String(value || '');
  }
};

const isActive = (routePath) => {
  // Handle encoded slugs (spaces/arabic) in URL vs decoded route strings
  return safeDecode(route.path) === safeDecode(routePath);
};


const handleNavigation = (routePath) => {
  router.push(routePath);
};

const handleBackToMain = () => {
  router.push('/dashboard/main');
};
</script>
