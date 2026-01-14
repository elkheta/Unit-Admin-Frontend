
<template>
  <div class="p-6">
    <div class="mb-6 flex flex-col gap-4">
      <div class="flex justify-between items-center">
        <h1 class="text-2xl font-bold text-gray-900">All Units</h1>
        <BaseButton
          variant="secondary"
          size="sm"
          class="bg-white hover:bg-gray-50 text-gray-700 border-gray-200 shadow-sm !px-2.5"
          @click="handleSync"
        >
          <span class="flex items-center gap-2">
            <RefreshCw :size="16" class="text-gray-500" />
            <span>Sync Data</span>
          </span>
        </BaseButton>
      </div>
      
      <div class="flex items-center gap-4 w-full md:w-96">
        <BaseInput
          v-model="searchInput"
          placeholder="Search units..."
          :icon="Search"
          class="w-full"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-12">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg">
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
const searchInput = ref('');
const searchQuery = ref('');
const router = useRouter();

// Update search query with debounce
const updateSearch = debounce((value) => {
  searchQuery.value = value;
  page.value = 1; // Reset to first page on search
}, 300);

watch(searchInput, (value) => {
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
