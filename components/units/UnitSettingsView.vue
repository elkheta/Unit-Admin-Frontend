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
    default: () => ({
      id: 2,
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
    })
  }
});

const emit = defineEmits(['back-to-unit']);

// Computed unit data with defaults
const unitData = computed(() => ({
  id: props.selectedUnit?.id || 2,
  name: props.selectedUnit?.name || 'S3 - Rania',
  adminName: props.selectedUnit?.adminName || 'Rania Farid',
  supervisors: props.selectedUnit?.supervisors || ['Mona Ali', 'Sara Mahmoud'],
  currentCapacity: props.selectedUnit?.currentCapacity || 90,
  maxCapacity: props.selectedUnit?.maxCapacity || 150,
  totalGroups: props.selectedUnit?.totalGroups || 2,
  educationalSections: props.selectedUnit?.educationalSections || ['الأول الثانوي عام', 'الثالث الثانوي علمي علوم عام'],
  products: props.selectedUnit?.products || [
    { name: 's1- ar - bundle', status: 'Active' },
    { name: 's3- ar - single - arabic', status: 'Active' }
  ]
}));

const handleBackToUnit = () => {
  emit('back-to-unit');
};
</script>
