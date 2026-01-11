<template>
  <div class="flex h-screen bg-gray-50 text-gray-800 font-sans overflow-hidden">
    <!-- Toast Container -->
    <ToastContainer />
    
    <!-- Sidebar - Handles its own rendering logic internally -->
    <Sidebar v-if="showLayout" />

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
import { Sidebar, Header } from './components/layout';
import { ToastContainer } from './components/ui';
import { usePageLayout } from './composables/usePageLayout';
import { useNavigation } from './composables/useNavigation';
import { useAuth } from './composables/useAuth';

const { showLayout } = usePageLayout();
const { currentPageLabel } = useNavigation();
const { handleLogout } = useAuth();
</script>
