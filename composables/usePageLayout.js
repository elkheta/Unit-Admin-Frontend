import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useRouteUtils } from './useRouteUtils';

export function usePageLayout() {
    const route = useRoute();
    const { isUnitPage, unitSlug } = useRouteUtils();

    const showLayout = computed(() => {
        return route.path !== '/signin' && route.path !== '/register';
    });

    return {
        showLayout,
        isUnitPage,
        unitSlug
    };
}

