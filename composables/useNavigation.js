import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { LayoutDashboard, ClipboardList, Tag } from 'lucide-vue-next';
import { useRouteUtils } from './useRouteUtils';

export function useNavigation() {
  const route = useRoute();
  const { isUnitPage } = useRouteUtils();

  const navItems = [
    { id: 'main', label: 'Main', icon: LayoutDashboard, route: '/dashboard/main' },
    { id: 'units-list', label: 'Unit List', icon: ClipboardList, route: '/dashboard/units' },
    { id: 'labels', label: 'Labels', icon: Tag, route: '/dashboard/labels' },
  ];

  const currentPageLabel = computed(() => {
    const path = route.path;
    
    // Check if it's a unit page using shared utility
    if (isUnitPage.value) {
      if (path.includes('/settings')) {
        return 'Unit Settings';
      }
      if (path.includes('/students')) {
        return 'Student List';
      }
    }
    
    const currentNav = navItems.find(item => item.route === route.path);
    return currentNav ? currentNav.label : 'Dashboard';
  });

  return {
    navItems,
    currentPageLabel
  };
}

