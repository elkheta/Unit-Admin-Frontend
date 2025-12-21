<template>
  <section class="general-information-section">
    <div class="mb-4">
      <h3 class="text-lg font-bold text-gray-900 mb-1">General Information</h3>
      <p class="text-sm text-gray-500">View unit information</p>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <UnitNameField :unit-name="unitData.name" />
      <UnitIdField :unit-id="unitData.id" />
      <AdminField :admin-name="unitData.adminName" />
      <SupervisorsField :supervisors="unitData.supervisors" />
    </div>
  </section>
</template>

<script setup>
import { UnitNameField, UnitIdField, AdminField, SupervisorsField } from './fields';

defineProps({
  unitData: {
    type: Object,
    required: true
  }
});
</script>

