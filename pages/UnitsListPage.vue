<template>
  <UnitsListView 
    :units="units"
    @view-students="handleViewStudents"
    @unit-settings="handleUnitSettings"
    @sync="handleSync"
  />
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { UnitsListView } from '../components/units';

const router = useRouter();

// Units data - in a real app, this would come from an API
const units = ref([
  {
    id: 2,
    slug: 'M5-GEN-EN-U1 (الأستاذ محمود إبراهيم - U1)',
    name: 'S3 - Rania',
    active: 120,
    outside: 15,
    expired: 5,
    lost: 2,
    adminName: 'Rania Farid',
    adminPhone: '+201000000001',
    currentCapacity: 120,
    maxCapacity: 150
  },
  {
    id: 3,
    slug: 'senior-two-alia',
    name: 'Senior Two - Alia',
    active: 45,
    outside: 0,
    expired: 0,
    lost: 0,
    adminName: 'Alia Ahmed',
    adminPhone: '+201000000002',
    currentCapacity: 45,
    maxCapacity: 100
  },
  {
    id: 104,
    slug: 'junior-two-ahmed-hassan',
    name: 'Junior Two - Ahmed Hassan',
    active: 200,
    outside: 12,
    expired: 8,
    lost: 1,
    adminName: 'Ahmed Hassan',
    adminPhone: '+201000000003',
    currentCapacity: 200,
    maxCapacity: 250
  }
]);

const handleViewStudents = (unit) => {
  // Navigate to student list view for this unit
  router.push(`/dashboard/units/${unit.slug}/students`);
};

const handleUnitSettings = (unit) => {
  // Navigate to unit settings for this unit
  router.push(`/dashboard/units/${unit.slug}/settings`);
};

const handleSync = () => {
  // Handle data synchronization with backend
  // eslint-disable-next-line no-console
  console.log('Syncing data...');
  // In a real app, this would call an API to sync data
};
</script>

