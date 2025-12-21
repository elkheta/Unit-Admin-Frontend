import { computed } from 'vue';
import { useRoute } from 'vue-router';

/**
 * Shared route utilities composable
 * Provides common route checking functions to eliminate code duplication
 */
export function useRouteUtils() {
  const route = useRoute();

  /**
   * Checks if the current route is a unit-specific page
   * Matches pattern: /dashboard/units/:slug/(settings|students)
   */
  const isUnitPage = computed(() => {
    const path = route.path;
    return /^\/dashboard\/units\/[^/]+\/(settings|students)/.test(path);
  });

  /**
   * Gets the unit slug from the route params
   * Returns empty string if not a unit page
   */
  const unitSlug = computed(() => {
    return isUnitPage.value ? route.params.slug : '';
  });

  return {
    isUnitPage,
    unitSlug
  };
}

