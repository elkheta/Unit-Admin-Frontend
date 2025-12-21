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
import { ref } from 'vue';
import { MainDashboard } from '../components/dashboard';

// Units data
const units = ref([
  {
    id: 2,
    title: "S3 - Rania",
    subtitle: "Unit created for S3 - Rania",
    badge: "Senior 3",
    admin: "Ahmed Hassan",
    students: 61,
    outside: 15,
    availableCapacity: 39,
    reminders: 2,
    groups: [
      { name: "Group A", current: 4, capacity: 25 },
      { name: "Group B", current: 0, capacity: 25 },
    ],
  },
  {
    id: 3,
    title: "Senior Two - Alia",
    subtitle: "Unit created for Senior Two - Alia",
    badge: "Senior Two",
    admin: "Sara Mohamed",
    students: 40,
    outside: 10,
    availableCapacity: 60,
    reminders: 0,
    groups: [
      { name: "Group A", current: 12, capacity: 25 },
      { name: "Group B", current: 8, capacity: 25 },
    ],
  }
]);

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

