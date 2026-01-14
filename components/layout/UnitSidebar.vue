<template>
  <aside class="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col flex-shrink-0 z-20">
    <!-- Unit Header -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100 overflow-hidden">
      <button 
        class="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors w-full"
        @click="handleBackToMain"
      >
        <ArrowLeft :size="18" class="flex-shrink-0" />
        <div class="flex flex-col text-left min-w-0 flex-1">
          <span class="font-semibold text-gray-900 leading-tight truncate block" :title="unitName">{{ unitName }}</span>
          <span class="text-[10px] text-gray-500 font-medium">BACK TO MAIN</span>
        </div>
      </button>
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
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ArrowLeft, Users, Settings } from 'lucide-vue-next';
import { NavItem } from '../ui';
import { useUnitData } from '../../composables/useUnitData';

const route = useRoute();
const router = useRouter();

const props = defineProps({
  unitSlug: {
    type: String,
    required: true
  }
});

// Get unit data from composable (set by page components)
const { unitData } = useUnitData();

const unitName = computed(() => {
  return unitData.value?.name || props.unitSlug;
});

const navItems = computed(() => [
  { 
    id: 'student-list', 
    label: 'Student List', 
    icon: Users, 
    route: `/dashboard/units/${props.unitSlug}/students` 
  },
  { 
    id: 'unit-settings', 
    label: 'Unit Settings', 
    icon: Settings, 
    route: `/dashboard/units/${props.unitSlug}/settings` 
  },
]);

const isActive = (routePath) => {
  return route.path === routePath;
};

const handleNavigation = (routePath) => {
  router.push(routePath);
};

const handleBackToMain = () => {
  router.push('/dashboard/main');
};
</script>

