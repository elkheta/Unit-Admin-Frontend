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

// Units data - will be populated from API
const units = ref(null);

const handleViewStudents = (unit) => {
  // Navigate to student list view for this unit
  router.push(`/dashboard/units/${unit.slug}/students`);
};

const handleUnitSettings = (unit) => {
  // Navigate to unit settings for this unit
  router.push(`/dashboard/units/${unit.slug}/settings`);
};

const handleSync = () => {
  // TODO: Implement sync with backend API
};
</script>

