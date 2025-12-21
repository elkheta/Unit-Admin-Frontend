<template>
  <SignIn v-if="!isAuthenticated" @sign-in="handleSignIn" />
  <div v-else class="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
    <!-- Sidebar -->
    <Sidebar 
      :active-tab="activeTab" 
      @update:active-tab="setActiveTab" 
      :nav-items="currentNavItems"
      :selected-unit="selectedUnit"
      @back="handleBackToDashboard"
    />

    <!-- Main Content Wrapper -->
    <div class="flex-1 flex flex-col min-w-0">
      <Header 
        :active-tab-label="currentNavItems.find(i => i.id === activeTab)?.label || 'Dashboard'" 
        @logout="handleLogout"
      />
      
      <!-- Scrollable Content Area -->
      <main class="flex-1 overflow-y-auto p-8">
        <DashboardView 
          :active-tab="activeTab" 
          @unit-select="handleUnitSelect"
          @tab-change="handleTabChange"
          :selected-unit="selectedUnit"
        />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import Sidebar from './components/Sidebar.vue';
import Header from './components/Header.vue';
import DashboardView from './components/DashboardView.vue';
import SignIn from './components/SignIn.vue';
import { LayoutDashboard, Users, ClipboardList, Tag, Settings } from 'lucide-vue-next';

// Navigation item IDs
const NAV_ITEM_IDS = {
  MAIN: 'main',
  UNITS_LIST: 'units-list',
  TASK_LIST: 'task-list',
  LABELS: 'labels',
  ADD_TASK: 'add-task',
  UNIT_STUDENT_LIST: 'unit-student-list',
  UNIT_MESSAGES: 'unit-messages',
  UNIT_FOLLOW_UP: 'unit-follow-up',
  UNIT_TEMPLATES: 'unit-templates',
  UNIT_TASKS: 'unit-tasks',
  UNIT_SETTINGS: 'unit-settings'
};

const isAuthenticated = ref(false);
const activeTab = ref('main');
const selectedUnit = ref(null);

const handleSignIn = () => {
  isAuthenticated.value = true;
};

const handleLogout = () => {
  isAuthenticated.value = false;
  activeTab.value = 'main';
  selectedUnit.value = null;
};

const mainNavItems = [
  { id: 'main', label: 'Main', icon: LayoutDashboard },
  { id: 'units-list', label: 'Unit List', icon: ClipboardList },
  { id: 'labels', label: 'Labels', icon: Tag },
];

const unitNavItems = [
  { id: 'unit-student-list', label: 'Student List', icon: Users },
  { id: 'unit-settings', label: 'Unit Settings', icon: Settings }
];

const handleUnitSelect = (unit, targetTab) => {
  selectedUnit.value = unit;
  activeTab.value = targetTab || 'unit-student-list';
};

const handleBackToDashboard = () => {
  selectedUnit.value = null;
  activeTab.value = 'main';
};

const handleTabChange = (tab) => {
  activeTab.value = tab;
};

const setActiveTab = (tab) => {
  activeTab.value = tab;
};

const currentNavItems = computed(() => selectedUnit.value ? unitNavItems : mainNavItems);
</script>
