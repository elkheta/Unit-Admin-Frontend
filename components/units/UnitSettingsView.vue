<template>
  <div class="flex flex-col h-full animate-fade-in max-w-5xl mx-auto">
    <UnitHeaderSection @back="handleBackToUnit" />

    <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
      <GeneralInformationSection :unit-data="unitData" />
      <StatisticsSection :unit-data="unitData" />
      <EducationalSectionsProductsSection :unit-data="unitData" />
      <BackendNotificationSection />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import {
  UnitHeaderSection,
  GeneralInformationSection,
  StatisticsSection,
  EducationalSectionsProductsSection,
  BackendNotificationSection
} from './settings';

const props = defineProps({
  selectedUnit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['back-to-unit']);

// Default unit data values
const defaultUnitData = {
  id: null,
  name: null,
  adminName: null,
  supervisors: null,
  currentCapacity: null,
  maxCapacity: null,
  totalGroups: null,
  educationalSections: null,
  products: null
};

// Helper function to get unit data with defaults
const getUnitDataWithDefaults = (selectedUnit) => {
  if (!selectedUnit) {
    return { ...defaultUnitData };
  }
  
  return {
    ...defaultUnitData,
    ...selectedUnit,
    supervisors: selectedUnit.supervisors ?? defaultUnitData.supervisors,
    educationalSections: selectedUnit.educationalSections 
      ? (Array.isArray(selectedUnit.educationalSections) ? selectedUnit.educationalSections : [selectedUnit.educationalSections])
      : defaultUnitData.educationalSections,
    products: selectedUnit.products ?? defaultUnitData.products
  };
};

// Computed unit data with defaults
const unitData = computed(() => getUnitDataWithDefaults(props.selectedUnit));

const handleBackToUnit = () => {
  emit('back-to-unit');
};
</script>
