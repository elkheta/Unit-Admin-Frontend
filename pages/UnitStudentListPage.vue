<template>
  <UnitStudentListView :selected-unit="unit" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { UnitStudentListView } from '../components/units';
import { useUnitData } from '../composables/useUnitData';

const route = useRoute();

const unit = ref(null);
const { setUnitData } = useUnitData();

// Sample units data - in a real app, this would come from an API
const unitsData = {
  's3-rania': {
    id: 2,
    slug: 's3-rania',
    title: 'S3 - Rania',
    name: 'S3 - Rania'
  },
  'senior-two-alia': {
    id: 3,
    slug: 'senior-two-alia',
    title: 'Senior Two - Alia',
    name: 'Senior Two - Alia'
  },
  'junior-two-ahmed-hassan': {
    id: 104,
    slug: 'junior-two-ahmed-hassan',
    title: 'Junior Two - Ahmed Hassan',
    name: 'Junior Two - Ahmed Hassan'
  }
};

onMounted(() => {
  const unitSlug = route.params.slug;
  // In a real app, fetch unit data from API using slug
  unit.value = unitsData[unitSlug] || unitsData['s3-rania'];
  // Set unit data for sidebar to use
  setUnitData(unit.value);
});
</script>

