<template>
  <div class="w-full">
    <!-- Main Dashboard -->
    <MainDashboard
      v-if="activeTab === 'main'"
      :units="units"
      :reminders="reminders"
      :all-students="allStudents"
      @unit-click="handleUnitClick"
      @expired-click="handleExpiredClick"
      @complete-reminder="handleCompleteReminder"
      @dismiss-reminder="handleDismissReminder"
    />

    <!-- Units List View -->
    <UnitsListView v-else-if="activeTab === 'units-list'" />

    <!-- Labels View -->
    <LabelsView
      v-else-if="activeTab === 'labels'"
      :labels="labels"
      @edit="handleEditLabel"
      @delete="handleDeleteLabel"
      @save="handleSaveLabel"
    />

    <!-- Task List View -->
    <TasksView
      v-else-if="activeTab === 'task-list' || activeTab === 'unit-tasks'"
      :tasks="tasks"
      @add-task="handleAddTask"
    />

    <!-- Unit Student List View -->
    <UnitStudentListView
      v-else-if="activeTab === 'unit-student-list'"
      :selected-unit="selectedUnit"
    />

    <!-- Unit Settings View -->
    <UnitSettingsView
      v-else-if="activeTab === 'unit-settings'"
      :selected-unit="selectedUnit"
    />

    <!-- Unit Messages View -->
    <UnitMessagesView
      v-else-if="activeTab === 'unit-messages'"
      :selected-unit="selectedUnit"
    />

    <!-- Default/Coming Soon View -->
    <div v-else class="flex flex-col items-center justify-center h-full min-h-[400px] animate-fade-in">
      <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
        <Settings :size="32" />
      </div>
      <h2 class="text-xl font-bold text-gray-900">Coming Soon</h2>
      <p class="text-gray-500 mt-2">
        The {{ activeTab.replace('unit-', '').replace('-', ' ') }} module is currently under development.
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { Settings } from 'lucide-vue-next';
import { useQuery } from '@vue/apollo-composable';
import { MainDashboard } from './index.js';
import { UnitsListView, UnitStudentListView, UnitSettingsView, UnitMessagesView } from '../units';
import { LabelsView } from '../labels';
import { TasksView } from '../tasks';
import { GET_DASHBOARD_UNITS } from '../../graphql/queries/dashboard';

const props = defineProps({
  activeTab: {
    type: String,
    required: true
  },
  onUnitSelect: {
    type: Function,
    default: null
  },
  onTabChange: {
    type: Function,
    default: null
  },
  selectedUnit: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['unitSelect', 'tabChange']);

// Labels state
const labels = ref([
  { id: 1, name: "VIP", category: "Status", description: "Very Important Person", creationDate: "2024-01-15" },
  { id: 2, name: "New", category: "Status", description: "Newly joined student", creationDate: "2024-03-10" },
  { id: 3, name: "Warning", category: "Behavior", description: "Student has warnings", creationDate: "2024-02-22" },
  { id: 4, name: "Excellent", category: "Academic", description: "Top performing student", creationDate: "2024-01-20" },
]);

// Tasks state
const tasks = ref([
  {
    id: 1,
    name: "g1 diamond above 21",
    assignedGroups: 1,
    progressCount: 0,
    progressTotal: 1,
    progressPercent: 0,
    reportAvailable: false,
    startDate: "11/2/2025",
    expirationDate: "11/9/2025",
    description: "No description",
    status: "active",
    visibility: "visible"
  },
  {
    id: 2,
    name: "group 1 task",
    assignedGroups: 1,
    progressCount: 1,
    progressTotal: 2,
    progressPercent: 50,
    reportAvailable: false,
    startDate: "11/2/2025",
    expirationDate: "11/9/2025",
    description: "No description",
    status: "active",
    visibility: "visible"
  },
  {
    id: 3,
    name: "متابعة الطلاب الغائبين",
    assignedGroups: 3,
    progressCount: 3,
    progressTotal: 3,
    progressPercent: 100,
    reportAvailable: true,
    startDate: "11/5/2025",
    expirationDate: "11/12/2025",
    description: "متابعة الطلاب الغائبين عن الحصة السابقة",
    status: "active",
    visibility: "visible"
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

// Units data
import { useAuth } from '../../composables/useAuth.js';

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
    subtitle: `${unit.educational_sections || 'Unit'} - ${unit.admin_name || 'Admin'}`, // Derived
    badge: unit.educational_sections,
    admin: unit.admin_name,
    students: unit.current_capacity || 0,
    outside: 0, // Not implemented yet
    availableCapacity: (unit.max_capacity || 0) - (unit.current_capacity || 0),
    reminders: 0, // Not implemented yet
    groups: [], // Not implemented yet
  }));
});

// Mock students data for expired count
const allStudents = [];

// Methods
const handleExpiredClick = (unit) => {
  if (props.onUnitSelect) {
    props.onUnitSelect(unit);
  } else {
    emit('unitSelect', unit);
  }
};

const handleUnitClick = (unit) => {
  if (props.onUnitSelect) {
    props.onUnitSelect(unit);
  } else {
    emit('unitSelect', unit);
  }
};

const handleCompleteReminder = (reminderId) => {
  reminders.value = reminders.value.filter(r => r.id !== reminderId);
};

const handleDismissReminder = (reminderId) => {
  if (window.confirm('Are you sure you want to delete this reminder?')) {
    reminders.value = reminders.value.filter(r => r.id !== reminderId);
  }
};

const handleEditLabel = (_label) => {
  // Handled by LabelsView component
};

const handleDeleteLabel = (id) => {
  if (window.confirm('Are you sure you want to delete this label?')) {
    labels.value = labels.value.filter(l => l.id !== id);
  }
};

const handleSaveLabel = (labelData) => {
  if (labelData.id) {
    // Edit
    const index = labels.value.findIndex(l => l.id === labelData.id);
    if (index !== -1) {
      labels.value[index] = { ...labels.value[index], ...labelData };
    }
  } else {
    // Add
    const newLabel = {
      id: Math.max(...labels.value.map(l => l.id), 0) + 1,
      name: labelData.name || 'New Label',
      category: labelData.category || 'General',
      description: labelData.description || '',
      creationDate: new Date().toISOString().split('T')[0]
    };
    labels.value.push(newLabel);
  }
};

const handleAddTask = () => {
  if (props.onTabChange) {
    props.onTabChange('add-task');
  } else if (props.onUnitSelect && props.selectedUnit) {
    props.onUnitSelect(props.selectedUnit, 'add-task');
  } else {
    emit('tabChange', 'add-task');
  }
};
</script>
