<template>
  <section class="educational-sections-products-section">
    <h3 class="text-lg font-bold text-gray-900 mb-6">Educational Sections & Products</h3>
    
    <EducationalSectionsList :sections="unitData.educationalSections" />
    <UnitProductsList :products="unitData.products" />
  </section>
</template>

<script setup>
import { EducationalSectionsList, UnitProductsList } from './index.js';

defineProps({
  unitData: {
    type: Object,
    required: true
  }
});
</script>

