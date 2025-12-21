<template>
  <div class="w-full">
    <!-- Main Dashboard -->
    <template v-if="activeTab === 'main'">
      <div class="flex flex-col gap-2 animate-fade-in max-w-7xl mx-auto">
        <!-- Units Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <BaseCard v-for="unit in units" :key="unit.id" padding="md" class="flex flex-col">
            <!-- Card Header: Icon, Title & Admin -->
            <div class="flex items-start gap-3 mb-3">
              <IconBadge :icon="Package" :size="20" :stroke-width="2" variant="primary" custom-size="w-10 h-10"
                class="shadow-blue-100 shadow-lg" />
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-gray-900 leading-tight mb-1.5">{{ unit.title }}</h3>
                <div class="flex items-center gap-2 text-gray-500">
                  <User :size="14" />
                  <span class="text-xs">{{ unit.admin }}</span>
                </div>
              </div>
            </div>

            <!-- Expired Button -->
            <div class="flex justify-end mb-6">
              <BaseButton v-if="getExpiredStudentsCount() > 0" @click="handleExpiredClick(unit)" variant="warning"
                size="sm" class="text-xs">
                {{ getExpiredStudentsCount() }} Expired
              </BaseButton>
              <BaseButton v-else disabled variant="secondary" size="sm" class="text-xs">
                0 Expired
              </BaseButton>
            </div>

            <!-- Groups Section -->
            <div class="mb-4 mt-auto">
              <div class="flex justify-between items-center mb-2">
                <span class="text-xs font-semibold text-gray-700">Groups</span>
                <span class="text-[10px] text-gray-400">{{unit.groups.filter(g => g.current > 0).length}}
                  groups</span>
              </div>
              <div class="space-y-1">
                <div v-for="(group, idx) in unit.groups.filter(group => group.current > 0)" :key="idx"
                  class="flex justify-between items-center text-xs text-gray-500">
                  <span>{{ group.name }}</span>
                  <span>{{ group.current }}</span>
                </div>
              </div>
            </div>

            <!-- Stats Grid and Button -->
            <div class="border-t border-gray-40 pt-4">
              <div class="flex items-end gap-4">
                <div class="grid grid-cols-4 gap-9 flex-1">
                  <StatDisplay :value="unit.students" label="Students" variant="primary" />
                  <StatDisplay :value="unit.outside" label="Outside" variant="danger" />
                  <StatDisplay :value="unit.availableCapacity" label="Available Capacity" variant="success" />
                  <StatDisplay :value="unit.reminders" label="Reminders" variant="warning" />
                </div>
                <!-- Action Button -->
                <BaseButton @click="handleUnitClick(unit)" variant="primary" size="md"
                  class="shadow-md shadow-blue-100 whitespace-nowrap">
                  Students List
                </BaseButton>
              </div>
            </div>
          </BaseCard>
        </div>

        <!-- Bottom Section: Reminders -->
        <BaseCard title="Upcoming Actions & Reminders" padding="lg" class="mt-2">
          <EmptyState v-if="reminders.length === 0" :icon="CheckCircle2" title="No Pending Reminders"
            message="You're all caught up!" variant="success" />

          <div v-else class="space-y-3">
            <div v-for="reminder in reminders" :key="reminder.id"
              class="flex items-start gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-bold text-gray-900">{{ reminder.personName }}</span>
                  <span class="text-xs text-gray-500">•</span>
                  <span class="text-xs text-gray-500">{{ reminder.group }}</span>
                  <span class="text-xs text-gray-500">•</span>
                  <span class="text-xs text-gray-500">{{ reminder.unit }}</span>
                </div>
                <p class="text-sm text-gray-700 mb-2">{{ reminder.description }}</p>
                <div class="flex items-center gap-3">
                  <Badge :text="reminder.statusIndicator"
                    :variant="reminder.statusIndicator === 'Overdue' ? 'danger' : reminder.statusIndicator === 'Due Soon' ? 'warning' : 'primary'" />
                  <span class="text-xs text-gray-500">Due: {{ reminder.dueDate }}</span>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <BaseButton @click="handleCompleteReminder(reminder.id)" variant="success" size="sm"
                  :icon="CheckCircle2" custom-class="p-2 text-green-600 hover:bg-green-50" title="Complete" />
                <BaseButton @click="handleDismissReminder(reminder.id)" variant="danger" size="sm" :icon="X"
                  custom-class="p-2 text-red-600 hover:bg-red-50" title="Dismiss" />
              </div>
            </div>
          </div>
        </BaseCard>
      </div>
    </template>

    <!-- Units List View -->
    <template v-else-if="activeTab === 'units-list'">
      <div class="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Units Overview</h2>
        <!-- Add units list content here -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <p class="text-gray-500">Units list view - content to be added</p>
        </div>
      </div>
    </template>

    <!-- Labels View -->
    <template v-else-if="activeTab === 'labels'">
      <div class="flex flex-col h-full animate-fade-in max-w-7xl mx-auto">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 class="text-2xl font-bold text-gray-900">Labels</h2>
            <p class="text-gray-500 mt-1">Manage labels and their assigned categories</p>
          </div>
          <BaseButton @click="openLabelModal" variant="primary" :icon="PlusCircle" size="md">
            Add New Label
          </BaseButton>
        </div>

        <!-- Labels Table -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Label Name</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Linked Category
                  </th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Creation Date</th>
                  <th class="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="label in labels" :key="label.id" class="hover:bg-gray-50 transition-colors group">
                  <td class="px-6 py-4 text-sm text-gray-500 font-mono">#{{ label.id }}</td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                      <IconBadge :icon="Tag" :size="14" variant="success" shape="circle" custom-size="w-8 h-8" />
                      <span class="text-sm font-bold text-gray-900">{{ label.name }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <Badge :text="label.category" variant="default" />
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{{ label.description }}</td>
                  <td class="px-6 py-4 text-sm text-gray-500">{{ label.creationDate }}</td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-2">
                      <BaseButton @click="handleEditLabel(label)" variant="primary" size="sm" :icon="Edit3"
                        custom-class="p-1.5 text-blue-600 hover:bg-blue-50" title="Edit" />
                      <BaseButton @click="handleDeleteLabel(label.id)" variant="danger" size="sm" :icon="Trash2"
                        custom-class="p-1.5 text-red-600 hover:bg-red-50" title="Delete" />
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div v-if="labels.length === 0" class="p-8 text-center text-gray-500">
            No labels found.
          </div>
        </div>

        <!-- Label Modal -->
        <BaseModal :is-open="isLabelModalOpen" :title="currentLabel.id ? 'Edit Label' : 'Add New Label'"
          @close="isLabelModalOpen = false">
          <div class="space-y-4">
            <BaseInput v-model="currentLabel.name" label="Label Name" placeholder="e.g. VIP, Urgent" />
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Linked Category</label>
              <div class="relative">
                <select v-model="currentLabel.category"
                  class="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="" disabled>Select Category</option>
                  <option value="Status">Status</option>
                  <option value="Behavior">Behavior</option>
                  <option value="Academic">Academic</option>
                  <option value="General">General</option>
                </select>
                <ChevronDown :size="14" class="absolute right-3 top-3 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="currentLabel.description" placeholder="Describe the purpose of this label..."
                class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none text-gray-700 bg-white"></textarea>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end gap-3">
              <BaseButton @click="isLabelModalOpen = false" variant="secondary" size="md">
                Cancel
              </BaseButton>
              <BaseButton @click="handleSaveLabel" :disabled="!currentLabel.name || !currentLabel.category"
                variant="primary" size="md">
                Save Label
              </BaseButton>
            </div>
          </template>
        </BaseModal>
      </div>
    </template>

    <!-- Task List View -->
    <template v-else-if="activeTab === 'task-list' || activeTab === 'unit-tasks'">
      <div class="flex flex-col h-full animate-fade-in max-w-[1600px] mx-auto pb-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
              <ListTodo :size="20" />
            </div>
            <h2 class="text-2xl font-bold text-gray-900">Task Management</h2>
          </div>

          <div class="flex items-center gap-3 w-full md:w-auto">
            <!-- Search Field -->
            <div class="relative flex-1 md:w-64">
              <input type="text" placeholder="Search tasks..."
                class="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all" />
              <Search :size="16" class="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>

            <BaseButton @click="handleAddTask" variant="primary" :icon="PlusCircle" size="md" class="whitespace-nowrap">
              Add Task
            </BaseButton>
          </div>
        </div>

        <!-- Tasks Table -->
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse min-w-[1500px]">
              <thead>
                <tr class="bg-gray-50 border-b border-gray-100">
                  <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Task Name</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                    Assigned Group Numbers</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Progress</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Report
                  </th>
                  <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Start Date</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Expiration Date
                  </th>
                  <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">Status
                  </th>
                  <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-center">
                    Visibility</th>
                  <th class="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider text-right">Actions
                  </th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-100">
                <tr v-for="task in tasks" :key="task.id" class="hover:bg-gray-50 transition-colors group">
                  <td class="px-6 py-4">
                    <span class="text-sm font-bold text-gray-900">{{ task.name }}</span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span
                      class="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold border border-blue-100">
                      {{ task.assignedGroups }}
                    </span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col gap-1 w-24">
                      <div class="flex justify-between text-xs text-gray-500 font-medium">
                        <span>{{ task.progressCount }}/{{ task.progressTotal }}</span>
                        <span>{{ task.progressPercent }}%</span>
                      </div>
                      <div class="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div class="h-full bg-blue-500 rounded-full" :style="{ width: `${task.progressPercent}%` }">
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex flex-col gap-1 w-24">
                      <div class="flex justify-between text-xs text-gray-500 font-medium">
                        <span>{{ task.reportAvailable ? 1 : 0 }}/{{ task.reportAvailable ? 1 : 0 }}</span>
                        <span>{{ task.reportAvailable ? 100 : 0 }}%</span>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 font-medium">
                    {{ task.startDate }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-900 font-medium">
                    {{ task.expirationDate }}
                  </td>
                  <td class="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" :title="task.description">
                    {{ task.description }}
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span :class="`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`">
                      {{ task.status }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-center">
                    <span :class="`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${task.visibility === 'visible' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
                      }`">
                      <Eye v-if="task.visibility === 'visible'" :size="12" />
                      <EyeOff v-else :size="12" />
                      {{ task.visibility === 'visible' ? 'Visible' : 'Hidden' }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex items-center justify-end gap-3 text-xs font-bold">
                      <BaseButton variant="primary" size="sm" class="text-xs">Edit</BaseButton>
                      <BaseButton variant="success" size="sm" class="text-xs">Clone</BaseButton>
                      <BaseButton variant="danger" size="sm" class="text-xs">Delete</BaseButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </template>

    <!-- Unit Student List View -->
    <template v-else-if="activeTab === 'unit-student-list'">
      <div class="flex flex-col h-full animate-fade-in">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Student List - {{ selectedUnit?.title }}</h2>
        <!-- Add student list content here -->
        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-8">
          <p class="text-gray-500">Student list view - content to be added</p>
        </div>
      </div>
    </template>

    <!-- Unit Settings View -->
    <template v-else-if="activeTab === 'unit-settings'">
      <div class="flex flex-col h-full animate-fade-in">
        <h2 class="text-2xl font-bold text-gray-900 mb-6">Unit Settings</h2>
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div class="border-b border-gray-100 pb-4 mb-4">
            <h3 class="text-lg font-medium text-gray-900">General Information</h3>
            <p class="text-sm text-gray-500">Update unit details and configurations.</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Main Name</label>
              <input type="text" :value="selectedUnit?.title"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
              <input type="number" placeholder="Enter capacity"
                class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-gray-50" />
            </div>
          </div>
          <div class="mt-6 flex justify-end">
            <BaseButton variant="primary" size="md">Save Changes</BaseButton>
          </div>
        </div>
      </div>
    </template>

    <!-- Unit Messages View -->
    <template v-else-if="activeTab === 'unit-messages'">
      <div class="flex flex-col h-full animate-fade-in">
        <div class="flex justify-between items-center mb-6">
          <h2 class="text-2xl font-bold text-gray-900">Messages</h2>
          <BaseButton variant="primary" :icon="Send" size="md">
            New Broadcast
          </BaseButton>
        </div>
        <div
          class="bg-white rounded-xl shadow-sm border border-gray-200 p-12 flex flex-col items-center justify-center text-center">
          <div class="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4">
            <Package :size="32" />
          </div>
          <h3 class="text-lg font-medium text-gray-900">Message Center</h3>
          <p class="text-gray-500 mt-2 max-w-md">Communicate with students and parents of {{ selectedUnit?.title }}
            directly from here.</p>
        </div>
      </div>
    </template>

    <!-- Default/Coming Soon View -->
    <template v-else>
      <div class="flex flex-col items-center justify-center h-full min-h-[400px] animate-fade-in">
        <div class="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
          <Settings :size="32" />
        </div>
        <h2 class="text-xl font-bold text-gray-900">Coming Soon</h2>
        <p class="text-gray-500 mt-2">The {{ activeTab.replace('unit-', '').replace('-', ' ') }} module is currently
          under development.</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import {
  Package, PlusCircle, CheckSquare, CheckCircle2, User, Search, Filter,
  MoreVertical, FileText, Send, Settings, Check,
  Eye, Gem, BarChart2, BookOpen, MessageCircle, Monitor, ChevronDown, X,
  ArrowRightLeft, Users, ChevronRight, Edit3, Trash2, Calendar, Phone, Mail, Save, Plus,
  StickyNote, Clock, AlertCircle, Archive, History, RefreshCw, UserCog, Tag, Copy, EyeOff, ListTodo
} from 'lucide-vue-next';
import BaseCard from './ui/BaseCard.vue';
import BaseButton from './ui/BaseButton.vue';
import BaseInput from './ui/BaseInput.vue';
import BaseModal from './ui/BaseModal.vue';
import IconBadge from './ui/IconBadge.vue';
import StatDisplay from './ui/StatDisplay.vue';
import EmptyState from './ui/EmptyState.vue';
import Badge from './ui/Badge.vue';

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

// State
const isSortMenuOpen = ref(false);
const selectedStudent = ref(null);
const selectedStudentSchedule = ref(null);
const selectedStudentAccumulated = ref(null);
const selectedLesson = ref(null);

// Labels state
const labels = ref([
  { id: 1, name: "VIP", category: "Status", description: "Very Important Person", creationDate: "2024-01-15" },
  { id: 2, name: "New", category: "Status", description: "Newly joined student", creationDate: "2024-03-10" },
  { id: 3, name: "Warning", category: "Behavior", description: "Student has warnings", creationDate: "2024-02-22" },
  { id: 4, name: "Excellent", category: "Academic", description: "Top performing student", creationDate: "2024-01-20" },
]);
const isLabelModalOpen = ref(false);
const currentLabel = ref({});

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

// Mock students data for expired count
const allStudents = [];

// Methods
const getExpiredStudentsCount = () => {
  const now = new Date();
  return allStudents.filter(student =>
    student.expirationDate < now && student.status === 'Inactive'
  ).length;
};

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

const openLabelModal = () => {
  currentLabel.value = {};
  isLabelModalOpen.value = true;
};

const handleEditLabel = (label) => {
  currentLabel.value = { ...label };
  isLabelModalOpen.value = true;
};

const handleDeleteLabel = (id) => {
  if (window.confirm('Are you sure you want to delete this label?')) {
    labels.value = labels.value.filter(l => l.id !== id);
  }
};

const handleSaveLabel = () => {
  if (currentLabel.value.id) {
    // Edit
    const index = labels.value.findIndex(l => l.id === currentLabel.value.id);
    if (index !== -1) {
      labels.value[index] = { ...labels.value[index], ...currentLabel.value };
    }
  } else {
    // Add
    const newLabel = {
      id: Math.max(...labels.value.map(l => l.id), 0) + 1,
      name: currentLabel.value.name || 'New Label',
      category: currentLabel.value.category || 'General',
      description: currentLabel.value.description || '',
      creationDate: new Date().toISOString().split('T')[0]
    };
    labels.value.push(newLabel);
  }
  isLabelModalOpen.value = false;
  currentLabel.value = {};
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
