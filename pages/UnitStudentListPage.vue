<template>
  <UnitStudentListView 
    :selected-unit="unit" 
    :students-result="studentsData"
    :loading="loading"
    :error="error"
    @search="handleSearch"
    @page-change="handlePageChange"
    @filter-change="handleFilterChange"
    @sort-change="handleSortChange"
  />
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useQuery } from '@vue/apollo-composable';
import { UnitStudentListView } from '../components/units';
import { useUnitData } from '../composables/useUnitData';
import { GET_UNIT_STUDENTS } from '../graphql/queries/students';

const route = useRoute();
const { setUnitData } = useUnitData();

const unitSlug = route.params.slug;

// Query Variables (Reactive)
const variables = ref({
  slug: unitSlug,
  page: 1,
  search: '',
  group_name: null,
  subject_id: null,
  diamonds_min: null,
  diamonds_max: null,
  progress_min: null,
  progress_max: null,
  points_min: null,
  points_max: null,
  lessons_min: null,
  last_seen_after: null,
  last_seen_before: null,
  orderBy: [{ column: 'added_to_unit_at', order: 'DESC' }] // Default sort as array
});

// Filter out nulls from variables so backend doesn't receive "operator >= null"
const cleanVariables = computed(() => {
  const vars = { ...variables.value };
  Object.keys(vars).forEach(key => {
    if (vars[key] === null) {
      delete vars[key];
    }
  });
  return vars;
});

const { result, loading, error, refetch } = useQuery(GET_UNIT_STUDENTS, cleanVariables, {
  fetchPolicy: 'network-only' // Ensure fresh data
});

const unit = computed(() => result.value?.unit || null);

const studentsData = computed(() => {
  const data = result.value?.students?.data || null;
  
  if (!data) return { data: null, paginatorInfo: {} };

  const transformedData = data.map(s => ({
    ...s,
    // Map backend fields to frontend component props
    phone: s.phone_number,
    averageProgress: s.current_progress || 0,
    score: s.points || 0,
    diamondPoints: s.diamonds || 0,
    // Format date to relative time
    lastActive: formatLastSeen(s.last_seen),
    status: 'Active', // Default or derive from expiration
    group: s.group_name || 'No Group',
    labels: s.labels || [], // Map labels
    dateAdded: s.added_to_unit_at,
    expirationDate: s.expiration_date,
    
    parent: {
      name: s.parent_name,
      phone: s.parent_phone
    },
    orders: [] // Set to empty array as backend order logic is removed for now
  }));
  
  return {
    data: transformedData,
    paginatorInfo: result.value?.students?.paginatorInfo || {}
  };
});

// Sync unit data to sidebar context
watch(unit, (newUnit) => {
  if (newUnit) {
    setUnitData(newUnit);
  }
});

// Handle errors or missing data as requested by user
watch(error, (err) => {
  if (err) {
    console.error("Failed to fetch students from backend:", err);
    // Logic to keep static data or show error - implemented in child View or here
    // The user asked to "list it in the document". I will note this in task.md later if it persists.
  }
});

const handleSearch = (query) => {
  variables.value.search = query;
  variables.value.page = 1;
};

const handlePageChange = (page) => {
  variables.value.page = page;
};

const handleFilterChange = (filters) => {
  // Map UI filters to backend variables
  variables.value = { ...variables.value, ...filters, page: 1 };
};

const handleSortChange = (sort) => {
    // Priority-based sorting mapping
    const newOrderBy = [];

    // Progress
    if (sort.progress) {
        newOrderBy.push({ 
            column: 'current_progress', 
            order: sort.progress === 'high-to-low' ? 'DESC' : 'ASC' 
        });
    }

    // Diamonds
    if (sort.diamonds) {
        newOrderBy.push({ 
            column: 'diamonds', 
            order: sort.diamonds === 'high-to-low' ? 'DESC' : 'ASC' 
        });
    }

    // Last Seen
    if (sort.lastSeen) {
        newOrderBy.push({ 
            column: 'last_seen', 
            order: sort.lastSeen === 'most-recent' ? 'DESC' : 'ASC' 
        });
    }

    // Expiration Date
    if (sort.expirationDate) {
        newOrderBy.push({ 
            column: 'expiration_date', 
            order: sort.expirationDate === 'newest-expired' ? 'DESC' : 'ASC' 
        });
    }

    // Date Added (Default fallback if nothing else is active, or explicit)
    if (sort.dateAdded) {
        newOrderBy.push({ 
            column: 'added_to_unit_at', // Mapped to added_to_unit_at column
            order: sort.dateAdded === 'newest-first' ? 'DESC' : 'ASC' 
        });
    }

    // fallback to added_to_unit_at if empty
    if (newOrderBy.length === 0) {
        newOrderBy.push({ column: 'added_to_unit_at', order: 'DESC' });
    }

    variables.value.orderBy = newOrderBy;
    variables.value.page = 1;
};
const formatLastSeen = (dateString) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    
    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
    
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days} ${days === 1 ? 'day' : 'days'}`;
    
    return date.toLocaleDateString();
};
</script>

