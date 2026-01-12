<template>
  <MainDashboard
    :units="units"
    :reminders="reminders"
    :all-students="allStudents"
    @unit-click="handleUnitClick"
    @expired-click="handleExpiredClick"
    @complete-reminder="handleCompleteReminder"
    @dismiss-reminder="handleDismissReminder"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { MainDashboard } from '../components/dashboard';
import { useQuery } from '@vue/apollo-composable';
import { GET_DASHBOARD_UNITS } from '../graphql/queries/dashboard';
import { useAuth } from '../composables/useAuth.js';

const { user } = useAuth();

const { result, loading, error } = useQuery(
  GET_DASHBOARD_UNITS, 
  () => ({
    kheta_id: user.value?.id
  })
);

const units = computed(() => {
  if (!result.value?.dashboardUnits) return [];
  
  return result.value.dashboardUnits.map(unit => ({
    id: unit.id,
    title: unit.name,
    subtitle: `${unit.educational_sections || 'Unit'} - ${unit.admin_name || 'Admin'}`,
    badge: unit.educational_sections,
    admin: unit.admin_name,
    students: unit.current_capacity || 0,
    outside: unit.outside_count || 0, 
    availableCapacity: (unit.max_capacity || 0) - (unit.current_capacity || 0),
    reminders: 0,
    expiredCount: unit.students_expired_at_count || 0,
    groups: unit.groups || [],
  }));
});

// Reminders state
const reminders = ref([
  {
    id: 1,
    description: "Contact parent regarding progress",
    personName: "Dina Sayed",
    group: "Group A",
    unit: "S3 - Rania",
    status: "Pending",
    dueDate: "Sep 20",
    statusIndicator: "Overdue",
    studentId: 12
  },
  {
    id: 2,
    description: "هكلمها بخصوص",
    personName: "Rania Farid",
    group: "Group A",
    unit: "S3 - Rania",
    status: "Pending",
    dueDate: "Sep 25",
    statusIndicator: "Overdue",
    studentId: 13
  },
  {
    id: 3,
    description: "Follow up on homework",
    personName: "Youssef Ali",
    group: "Group B",
    unit: "S3 - Rania",
    status: "Pending",
    dueDate: "Sep 28",
    statusIndicator: "Due Soon",
    studentId: 5
  },
  {
    id: 4,
    description: "Schedule meeting with parent",
    personName: "Karim Adel",
    group: "Outside",
    unit: "S3 - Rania",
    status: "Pending",
    dueDate: "Oct 1",
    statusIndicator: "Upcoming",
    studentId: 9
  }
]);

// Mock students data for expired count
const allStudents = [];

const handleUnitClick = (_unit) => {
  // Navigate to unit details or keep on main page
  // TODO: Implement unit navigation
};

const handleExpiredClick = (_unit) => {
  // Navigate to unit details or keep on main page
  // TODO: Implement expired navigation
};

const handleCompleteReminder = (reminderId) => {
  reminders.value = reminders.value.filter(r => r.id !== reminderId);
};

const handleDismissReminder = (reminderId) => {
  if (window.confirm('Are you sure you want to delete this reminder?')) {
    reminders.value = reminders.value.filter(r => r.id !== reminderId);
  }
};
</script>

