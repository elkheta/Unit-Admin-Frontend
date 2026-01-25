<template>
  <MainDashboard
    :units="units"
    :reminders="reminders"
    :all-students="allStudents"
    @unit-click="handleUnitClick"
    @expired-click="handleExpiredClick"
    @complete-reminder="handleCompleteReminder"

    @dismiss-reminder="handleDismissReminder"
    @view-reminder="handleViewReminder"
    @settings-click="handleSettingsClick"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { MainDashboard } from '../components/dashboard';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { GET_DASHBOARD_UNITS, GET_DASHBOARD_REMINDERS, UPDATE_STUDENT_NOTE, DELETE_STUDENT_NOTE } from '../graphql/queries/dashboard';
import { useAuth } from '../composables/useAuth.js';

const { user } = useAuth();
const router = useRouter();

const { result, loading, error } = useQuery(
  GET_DASHBOARD_UNITS, 
  () => ({
    elkheta_id: user.value?.id
  })
);

const { result: remindersResult, refetch: refetchReminders } = useQuery(GET_DASHBOARD_REMINDERS, null, {
  pollInterval: 60000
});

const { mutate: updateNote } = useMutation(UPDATE_STUDENT_NOTE);
const { mutate: deleteNote } = useMutation(DELETE_STUDENT_NOTE);

const units = computed(() => {
  if (!result.value?.dashboardUnits) return [];
  
  return result.value.dashboardUnits.map(unit => ({
    id: unit.id,
    slug: unit.slug,
    title: unit.name,
    subtitle: `${unit.educational_sections || 'Unit'} - ${unit.admin_name || 'Admin'}`,
    badge: unit.educational_sections,
    admin: unit.admin_name,
    students: unit.current_capacity || 0,
    outside: unit.outside_count || 0, 
    availableCapacity: (unit.max_capacity || 0) - (unit.current_capacity || 0),
    reminders: unit.reminders_count || 0,
    expiredCount: unit.students_expired_at_count || 0,
    groups: unit.groups || [],
  }));
});

const getStatusIndicator = (dueDate) => {
  if (!dueDate) return 'Upcoming';
  const today = new Date();
  const due = new Date(dueDate);
  const diffTime = due - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return 'Overdue';
  if (diffDays <= 3) return 'Due Soon';
  return 'Upcoming';
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Reminders state
const removedReminderIds = ref([]);

const reminders = computed(() => {
  if (!remindersResult.value?.dashboardReminders) return [];

  return remindersResult.value.dashboardReminders
    .filter(reminder => !removedReminderIds.value.includes(reminder.id))
    .map(reminder => ({
      id: reminder.id,
      description: reminder.text,
      personName: reminder.student?.name || 'Unknown',
      group: reminder.student?.group_name || 'No Group',
      unit: reminder.student?.unit?.name || 'No Unit',
      unitSlug: reminder.student?.unit?.slug,
      status: reminder.status || 'Pending',
      dueDate: formatDate(reminder.due_date),
      statusIndicator: getStatusIndicator(reminder.due_date),
      studentId: reminder.student?.id
    }));
});

const removeReminder= (reminderId) => {
  if (!reminderId) return;
  if (removedReminderIds.value.includes(reminderId)) return;
  removedReminderIds.value = [...removedReminderIds.value, reminderId];
};

// Mock students data for expired count
const allStudents = [];

const handleUnitClick = (unit) => {
  if (unit.slug) {
    router.push({ name: 'UnitStudentList', params: { slug: unit.slug } });
  }
};

const handleExpiredClick = (unit) => {
  if (unit.slug) {
    router.push({ 
      name: 'UnitStudentList', 
      params: { slug: unit.slug },
      query: { expired: 'true' }
    });
  }
};

const handleSettingsClick = (unit) => {
  if (unit.slug) {
    router.push({ name: 'UnitSettings', params: { slug: unit.slug } });
  }
};

const handleViewReminder = (reminder) => {
  if (reminder.unitSlug && reminder.personName) {
    router.push({
      name: 'UnitStudentList',
      params: { slug: reminder.unitSlug },
      query: { search: reminder.personName }
    });
  }
};

const handleCompleteReminder = async (reminderId) => {
  // ... existing implementation
  try {
    await updateNote({
      id: reminderId,
      input: { status: 'approved' }
    });
    removeReminder(reminderId);
  } catch (e) {
    console.error('Error completing reminder:', e);
  }
};

const handleDismissReminder = async (reminderId) => {
  if (window.confirm('Are you sure you want to dismiss this reminder?')) {
    try {
      await updateNote({ 
        id: reminderId,
        input: { status: 'cancelled' }
      });
      removeReminder(reminderId);
    } catch (e) {
      console.error('Error dismissing reminder:', e);
    }
  }
};
</script>

