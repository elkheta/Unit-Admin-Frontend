<template>
  <div class="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
    <!-- Page Title Section with Search and Sync -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
      <div class="flex-1">
        <h2 class="text-2xl font-bold text-gray-900 mb-4">Units Overview</h2>
        <div class="max-w-md">
          <BaseInput
            v-model="searchQuery"
            :icon="Search"
            placeholder="Search by unit name..."
            input-class="bg-white border border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <BaseButton 
        variant="primary" 
        :icon="RefreshCw" 
        size="md"
        @click="handleSync"
        :loading="isSyncing"
      >
        Sync Data
      </BaseButton>
    </div>

    <!-- Units Cards Area -->
    <div v-if="filteredUnits.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <UnitOverviewCard
        v-for="unit in filteredUnits"
        :key="unit.id"
        :unit="unit"
        @view-students="handleViewStudents"
        @unit-settings="handleUnitSettings"
      />
    </div>
    
    <!-- Empty State -->
    <div v-else class="bg-white rounded-xl border border-gray-200 shadow-sm p-12 text-center">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Package :size="32" class="text-gray-400" />
      </div>
      <h3 class="text-lg font-semibold text-gray-900 mb-2">No units found</h3>
      <p class="text-gray-500">
        {{ searchQuery ? 'Try adjusting your search query' : 'No units available at the moment' }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Search, RefreshCw, Package } from 'lucide-vue-next';
import { BaseInput, BaseButton } from '../ui';
import UnitOverviewCard from './UnitOverviewCard.vue';

const props = defineProps({
  units: {
    type: Array,
    default: () => [
      {
        id: 2,
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
    ]
  }
});

const emit = defineEmits(['view-students', 'unit-settings', 'sync']);

const searchQuery = ref('');
const isSyncing = ref(false);

const filteredUnits = computed(() => {
  if (!searchQuery.value.trim()) {
    return props.units;
  }
  const query = searchQuery.value.toLowerCase();
  return props.units.filter(unit => 
    unit.name.toLowerCase().includes(query)
  );
});

const handleSync = async () => {
  isSyncing.value = true;
  emit('sync');
  // Simulate sync delay
  setTimeout(() => {
    isSyncing.value = false;
  }, 1000);
};

const handleViewStudents = (unit) => {
  emit('view-students', unit);
};

const handleUnitSettings = (unit) => {
  emit('unit-settings', unit);
};
</script>

