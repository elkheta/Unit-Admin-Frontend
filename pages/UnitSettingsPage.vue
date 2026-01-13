<template>
  <UnitSettingsView 
    :selected-unit="unit"
    @back-to-unit="handleBackToUnit"
  />
</template>

<script setup>
import { computed, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { UnitSettingsView } from '../components/units';
import { useUnitData } from '../composables/useUnitData';
import { GET_UNIT_SETTINGS } from '../graphql/queries/unitSettings';
import { useToast } from '../composables/useToast';

const route = useRoute();
const router = useRouter();
const { setUnitData } = useUnitData();
const { error: toastError } = useToast();

const unitSlug = Array.isArray(route.params.slug) 
  ? decodeURIComponent(route.params.slug[0]) 
  : decodeURIComponent(route.params.slug);

// Fetch Unit Data
const { result, loading, error } = useQuery(GET_UNIT_SETTINGS, { 
  slug: unitSlug 
});

const unit = computed(() => result.value?.unit || null);

// Update Sidebar/Global State when unit data arrives
watch(unit, (newUnit) => {
  if (newUnit) {
    setUnitData(newUnit);
  }
});

// Handle Errors
watch(error, (newError) => {
  if (newError) {
    toastError('Failed to load unit settings: ' + newError.message);
  }
});

const handleBackToUnit = () => {
  router.push('/dashboard/units');
};
</script>

