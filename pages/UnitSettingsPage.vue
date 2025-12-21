<template>
  <UnitSettingsView 
    :selected-unit="unit"
    @back-to-unit="handleBackToUnit"
  />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { UnitSettingsView } from '../components/units';

const route = useRoute();
const router = useRouter();

const unit = ref(null);

// Sample units data - in a real app, this would come from an API
const unitsData = {
  's3-rania': {
    id: 2,
    slug: 's3-rania',
    name: 'S3 - Rania',
    adminName: 'Rania Farid',
    supervisors: ['Mona Ali', 'Sara Mahmoud'],
    currentCapacity: 90,
    maxCapacity: 150,
    totalGroups: 2,
    educationalSections: ['الأول الثانوي عام', 'الثالث الثانوي علمي علوم عام'],
    products: [
      { name: 's1- ar - bundle', status: 'Active' },
      { name: 's3- ar - single - arabic', status: 'Active' }
    ]
  },
  'senior-two-alia': {
    id: 3,
    slug: 'senior-two-alia',
    name: 'Senior Two - Alia',
    adminName: 'Alia Ahmed',
    supervisors: ['Ahmed Mohamed'],
    currentCapacity: 45,
    maxCapacity: 100,
    totalGroups: 1,
    educationalSections: ['الثاني الثانوي عام'],
    products: [
      { name: 's2- ar - bundle', status: 'Active' }
    ]
  },
  'junior-two-ahmed-hassan': {
    id: 104,
    slug: 'junior-two-ahmed-hassan',
    name: 'Junior Two - Ahmed Hassan',
    adminName: 'Ahmed Hassan',
    supervisors: ['Sara Ali', 'Mohamed Farid'],
    currentCapacity: 200,
    maxCapacity: 250,
    totalGroups: 3,
    educationalSections: ['الأول الثانوي عام', 'الثاني الثانوي علمي'],
    products: [
      { name: 'j1- ar - bundle', status: 'Active' },
      { name: 'j2- ar - single', status: 'Active' }
    ]
  }
};

onMounted(() => {
  const unitSlug = route.params.slug;
  // In a real app, fetch unit data from API using slug
  unit.value = unitsData[unitSlug] || unitsData['s3-rania'];
});

const handleBackToUnit = () => {
  // Navigate back to units list or student list
  router.push('/dashboard/units');
};
</script>

