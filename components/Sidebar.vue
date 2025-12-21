<template>
  <aside class="w-50 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20">
    <!-- Sidebar Header -->
    <div class="h-16 flex items-center px-6 border-b border-gray-100">
      <BaseButton
        v-if="selectedUnit && onBack"
        @click="handleBack"
        variant="secondary"
        size="sm"
        class="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors w-full justify-start"
      >
        <ArrowLeft :size="20" />
        <div class="flex flex-col items-start">
          <span class="font-bold text-gray-900 leading-tight text-sm line-clamp-1">{{ selectedUnit.title }}</span>
          <span class="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Back to Main</span>
        </div>
      </BaseButton>
      <div v-else class="flex items-center gap-2">
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
        :key="item.id"
        :id="item.id"
        :label="item.label"
        :icon="item.icon"
        :active="activeTab === item.id"
        :variant="item.isAction ? 'action' : 'default'"
        :badge="item.id === 'task-list' && unreadNotifications > 0"
        :badge-icon="item.id === 'task-list' && unreadNotifications > 0 ? Bell : null"
        :badge-count="item.id === 'task-list' && unreadNotifications > 0 ? unreadNotifications : 0"
        @click="handleTabClick"
      />
    </nav>
  </aside>
</template>

<script setup>
import { ref } from 'vue';
import { Layout, ArrowLeft, Bell } from 'lucide-vue-next';
import BaseButton from './ui/BaseButton.vue';
import NavItem from './ui/NavItem.vue';
import IconBadge from './ui/IconBadge.vue';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  navItems: {
    type: Array,
    required: true
  },
  selectedUnit: {
    type: Object,
    default: null
  },
  onBack: {
    type: Function,
    default: null
  }
});

const emit = defineEmits(['update:activeTab']);

const unreadNotifications = ref(3); // Mock unread notifications count

const handleTabClick = (id) => {
  emit('update:activeTab', id);
};

const handleBack = () => {
  if (props.onBack) {
    props.onBack();
  }
};
</script>
