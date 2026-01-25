
<template>
  <div class="p-6">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
      <div class="flex-1 w-full sm:w-auto">
        <h2 class="text-2xl font-bold text-gray-900 mb-3">Units Overview</h2>
        
        <!-- Search Bar -->
        <div class="relative max-w-md">
          <Search :size="18" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search by unit name..." 
            v-model="unitSearchQuery"
            class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all"
          />
        </div>
      </div>
      <button 
        @click="handleSync"
        class="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 hover:text-blue-600 transition-colors shadow-sm whitespace-nowrap"
      >
        <RefreshCw :size="18" />
        <span class="font-medium text-sm">Sync Data</span>
      </button>
    </div>

    <!-- Loading State -->
    <!-- managed globally -->

    <!-- Error State -->
    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg">
      Error loading units: {{ error.message }}
    </div>

    <!-- Data State -->
    <div v-else class="flex flex-col gap-6">
      
      <!-- Units Grid -->
      <div v-if="mappedUnits.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <UnitListCard
          v-for="unit in mappedUnits"
          :key="unit.id"
          :unit="unit"
          @unit-click="handleUnitClick"
          @settings-click="handleSettingsClick"
        />
      </div>
      <div v-else class="text-center py-12 text-gray-500">
        No units found matching "{{ searchQuery }}"
      </div>

      <!-- Pagination -->
      <div v-if="paginator && mappedUnits.length > 0" class="flex justify-center items-center gap-4 mt-8 pb-8">
        <BaseButton
          variant="secondary"
          :disabled="page === 1"
          @click="page--"
        >
          Previous
        </BaseButton>
        <span class="text-sm text-gray-600">
          Page {{ paginator.currentPage }} of {{ paginator.lastPage }}
        </span>
        <BaseButton
          variant="secondary"
          :disabled="!paginator.hasMorePages"
          @click="page++"
        >
          Next
        </BaseButton>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { GET_ALL_UNITS } from '../graphql/queries/units';
import UnitListCard from '../components/units/UnitListCard.vue';
import { BaseButton, BaseInput } from '../components/ui';
import { Search, RefreshCw } from 'lucide-vue-next';
import debounce from 'lodash.debounce';

const page = ref(1);
const perPage = ref(10);
const unitSearchQuery = ref('');
const searchQuery = ref('');
const router = useRouter();

// Update search query with debounce
const updateSearch = debounce((value) => {
  searchQuery.value = value;
  page.value = 1; // Reset to first page on search
}, 300);

watch(unitSearchQuery, (value) => {
  updateSearch(value);
});

const { result, loading, error } = useQuery(GET_ALL_UNITS, () => ({
  page: page.value,
  first: perPage.value,
  name: searchQuery.value ? `%${searchQuery.value}%` : undefined
}));

const paginator = computed(() => result.value?.units?.paginatorInfo);

const mappedUnits = computed(() => {
  return result.value?.units?.data.map(unit => ({
    id: unit.id,
    slug: unit.slug,
    title: unit.name,
    admin: unit.admin_name,
    adminPhone: unit.admin_phone,
    students: unit.current_capacity || 0,
    groups: unit.groups || [],
    outside: unit.outside_count || 0,
    lost: unit.lost_count || 0,
    maxCapacity: unit.max_capacity || 0,
    availableCapacity: Math.max(0, (unit.max_capacity || 0) - (unit.current_capacity || 0)),
    reminders: 0, // Not used in UnitCard stats anymore, but kept for compatibility if needed
    expiredCount: unit.students_expired_at_count || 0,
    educational_sections: unit.educational_sections
  })) || [];
});

const handleUnitClick = (unit) => {
  if (unit.slug) {
    router.push({ name: 'UnitStudentList', params: { slug: unit.slug } });
  }
};

const handleExpiredClick = (unit) => {
  console.log('Expired clicked:', unit);
  // Implement modal or filter logic here if needed
};

const handleSettingsClick = (unit) => {
  if (unit.slug) {
    router.push({ name: 'UnitSettings', params: { slug: unit.slug } });
  }
};

const handleSync = () => {
  console.log('Sync data clicked');
  // Implement sync logic here
};
</script>
