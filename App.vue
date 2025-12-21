<template>
  <div class="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
    <!-- Sidebar - Only show when authenticated -->
    <Sidebar 
      v-if="showLayout"
      :nav-items="navItems"
    />

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header - Only show when authenticated -->
      <Header 
        v-if="showLayout"
        :active-tab-label="currentPageLabel" 
        @logout="handleLogout"
      />
      
      <!-- Scrollable Content Area -->
      <main :class="showLayout ? 'flex-1 overflow-y-auto p-8' : 'flex-1'">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Sidebar, Header } from './components/layout';
import { LayoutDashboard, ClipboardList, Tag } from 'lucide-vue-next';

const route = useRoute();
const router = useRouter();

// Navigation items with routes
const navItems = [
  { id: 'main', label: 'Main', icon: LayoutDashboard, route: '/dashboard/main' },
  { id: 'units-list', label: 'Unit List', icon: ClipboardList, route: '/dashboard/units' },
  { id: 'labels', label: 'Labels', icon: Tag, route: '/dashboard/labels' },
];

// Show layout (sidebar + header) except on signin/register pages
const showLayout = computed(() => {
  return route.path !== '/signin' && route.path !== '/register';
});

// Get current page label for header
const currentPageLabel = computed(() => {
  const currentNav = navItems.find(item => item.route === route.path);
  return currentNav ? currentNav.label : 'Dashboard';
});

const handleLogout = () => {
  localStorage.removeItem('isAuthenticated');
  router.push('/signin');
};
</script>
