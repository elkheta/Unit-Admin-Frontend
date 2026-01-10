<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="isOpen && student"
        class="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center backdrop-blur-sm p-4"
        @click.self="$emit('close')"
      >
        <div class="bg-white rounded-2xl w-full max-w-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
          <!-- Header -->
          <div class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 class="font-bold text-lg text-gray-900">Notes &amp; Activity</h3>
              <p class="text-xs text-gray-500 mt-0.5">
                For <span class="font-semibold text-gray-700">{{ student.name }}</span>
              </p>
            </div>
            <button
              type="button"
              class="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
              @click="$emit('close')"
            >
              <X :size="20" />
            </button>
          </div>

          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-5 scrollbar-thin scrollbar-thumb-gray-200">
            <!-- Add Note Section -->
            <div class="mb-6">
              <h4 class="text-sm font-bold text-gray-800 mb-3">Add Note</h4>
              <div class="flex gap-3 mb-3">
                <input
                  v-model="noteDate"
                  type="date"
                  class="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white text-gray-700"
                />
                <div class="flex-1 relative">
                  <select
                    v-model="noteCategory"
                    class="w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">Select Category</option>
                    <option value="student data">student data</option>
                    <option value="follow up">follow up</option>
                    <option value="report">report</option>
                  </select>
                  <ChevronDown :size="14" class="absolute right-3 top-3 text-gray-400 pointer-events-none" />
                </div>
              </div>
              <textarea
                v-model="noteText"
                placeholder="Enter your note here..."
                class="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px] resize-none text-gray-700 bg-white mb-3"
              ></textarea>
              <button
                type="button"
                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!noteText.trim() || !noteCategory"
                @click="handleAddNote"
              >
                Add Note
              </button>
            </div>

            <!-- Add Reminder Section -->
            <div class="mb-6 pt-2 border-t border-gray-100">
              <h4 class="text-sm font-bold text-gray-800 mb-3 mt-4">Add Reminder</h4>
              <input
                v-model="reminderText"
                type="text"
                placeholder="What needs to be done?"
                class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-gray-700 mb-3"
              />

              <div class="grid grid-cols-2 gap-3 mb-3">
                <button
                  type="button"
                  class="py-2 px-3 border rounded-lg text-xs font-semibold transition-colors"
                  :class="reminderDays === 1 ? activeDayClass : inactiveDayClass"
                  @click="selectReminderDays(1)"
                >
                  1 Day
                </button>
                <button
                  type="button"
                  class="py-2 px-3 border rounded-lg text-xs font-semibold transition-colors"
                  :class="reminderDays === 2 ? activeDayClass : inactiveDayClass"
                  @click="selectReminderDays(2)"
                >
                  2 Days
                </button>
                <button
                  type="button"
                  class="py-2 px-3 border rounded-lg text-xs font-semibold transition-colors"
                  :class="reminderDays === 3 ? activeDayClass : inactiveDayClass"
                  @click="selectReminderDays(3)"
                >
                  3 Days
                </button>
                <button
                  type="button"
                  class="py-2 px-3 border rounded-lg text-xs font-semibold transition-colors"
                  :class="reminderDays === 7 ? activeDayClass : inactiveDayClass"
                  @click="selectReminderDays(7)"
                >
                  7 Days
                </button>
              </div>

              <div class="mb-3">
                <button
                  v-if="!showCustomDateInput"
                  type="button"
                  class="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm font-semibold rounded-lg transition-colors"
                  @click="openCustomDate"
                >
                  Custom Date
                </button>
                <div v-else class="relative">
                  <input
                    v-model="reminderCustomDate"
                    type="date"
                    class="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white text-gray-700"
                    autofocus
                  />
                  <button
                    type="button"
                    class="absolute right-10 top-2.5 text-xs text-gray-400 hover:text-gray-600 underline"
                    @click="cancelCustomDate"
                  >
                    Cancel
                  </button>
                </div>
              </div>

              <button
                type="button"
                class="w-full bg-orange-600 hover:bg-orange-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="!reminderText.trim() || (!reminderDays && !reminderCustomDate)"
                @click="handleAddReminder"
              >
                Add Reminder
              </button>
            </div>

            <!-- History Tabs -->
            <div class="flex items-center gap-2 mb-4 mt-6">
              <button
                type="button"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                :class="activeTab === 'recent' ? tabActive : tabInactive"
                @click="activeTab = 'recent'"
              >
                <Clock :size="14" />
                <span>Recent</span>
              </button>
              <button
                type="button"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                :class="activeTab === 'archived' ? tabActive : tabInactive"
                @click="activeTab = 'archived'"
              >
                <Archive :size="14" />
                <span>Archived</span>
              </button>
              <button
                type="button"
                class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                :class="activeTab === 'notes' ? tabActive : tabInactive"
                @click="activeTab = 'notes'"
              >
                <StickyNote :size="14" />
                <span>Notes</span>
              </button>
            </div>

            <!-- Notes Timeline -->
            <div class="space-y-4">
              <div v-for="item in filteredHistory" :key="item.id" class="relative pl-4 border-l-2 border-gray-100">
                <div
                  class="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white"
                  :class="item.type === 'reminder' ? 'bg-amber-400' : 'bg-blue-400'"
                ></div>

                <div class="bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div class="flex justify-between items-start mb-2">
                    <div class="flex items-center gap-2">
                      <span
                        class="text-[10px] font-bold px-2 py-0.5 rounded-full"
                        :class="item.type === 'reminder' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'"
                      >
                        {{ item.type === 'reminder' ? 'Reminder' : 'Note' }}
                      </span>
                      <span
                        v-if="item.pinned"
                        class="text-[10px] font-bold px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600"
                      >
                        Pinned
                      </span>
                    </div>
                    <span class="text-[10px] text-gray-400">{{ item.date }}</span>
                  </div>

                  <span
                    v-if="item.category"
                    class="inline-block text-[10px] font-medium px-2 py-0.5 rounded bg-gray-100 text-gray-600 mb-2"
                  >
                    {{ item.category }}
                  </span>

                  <div v-if="item.dueDate" class="text-[10px] text-orange-600 font-medium mb-2">
                    Due: {{ item.dueDate }}
                  </div>

                  <!-- Edit mode or view mode -->
                  <div v-if="editingId === item.id" class="space-y-2">
                    <textarea
                      v-model="editingText"
                      class="w-full border border-gray-300 rounded-lg p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[60px] resize-none"
                    ></textarea>
                    <div class="flex gap-2">
                      <button
                        type="button"
                        class="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-1.5 rounded transition-colors"
                        @click="saveEdit(item.id)"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        class="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xs font-medium py-1.5 rounded transition-colors"
                        @click="cancelEdit"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                  <template v-else>
                    <p class="text-sm text-gray-700 mb-2">{{ item.text }}</p>

                    <div v-if="item.author === 'You'" class="flex items-center justify-between pt-2 border-t border-gray-100">
                      <div class="text-[10px] text-gray-400 font-medium">Added by: {{ item.author }}</div>
                      <div class="flex items-center gap-1">
                        <button
                          type="button"
                          class="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-yellow-600 transition-colors"
                          :title="item.pinned ? 'Unpin' : 'Pin'"
                          @click="togglePin(item.id)"
                        >
                          <Pin :size="12" :class="item.pinned ? 'text-yellow-600' : ''" />
                        </button>
                        <button
                          type="button"
                          class="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-blue-600 transition-colors"
                          title="Edit"
                          @click="startEdit(item)"
                        >
                          <Edit3 :size="12" />
                        </button>
                        <button
                          type="button"
                          class="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-orange-600 transition-colors"
                          :title="item.archived ? 'Unarchive' : 'Archive'"
                          @click="toggleArchive(item.id)"
                        >
                          <Archive :size="12" />
                        </button>
                        <button
                          type="button"
                          class="p-1.5 hover:bg-gray-100 rounded text-gray-500 hover:text-red-600 transition-colors"
                          title="Delete"
                          @click="deleteItem(item.id)"
                        >
                          <Trash2 :size="12" />
                        </button>
                      </div>
                    </div>

                    <div
                      v-else
                      class="text-[10px] text-gray-400 font-medium text-right pt-2 border-t border-gray-100"
                    >
                      Added by: {{ item.author }}
                    </div>
                  </template>
                </div>
              </div>

              <div class="text-center py-2">
                <span class="text-[10px] text-gray-300 uppercase tracking-widest">End of History</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { Archive, ChevronDown, Clock, Edit3, Pin, StickyNote, Trash2, X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  student: { type: Object, default: null },
  notes: { type: Array, default: () => [] }
});

const emit = defineEmits(['close', 'update:notes']);

const noteDate = ref('');
const noteCategory = ref('');
const noteText = ref('');

const reminderText = ref('');
const reminderDays = ref(null);
const reminderCustomDate = ref('');
const showCustomDateInput = ref(false);

const activeTab = ref('recent'); // recent | archived | notes

const editingId = ref(null);
const editingText = ref('');

const tabActive = 'bg-blue-100 text-blue-700';
const tabInactive = 'bg-gray-100 text-gray-500 hover:bg-gray-200';

const activeDayClass = 'bg-orange-100 border-orange-300 text-orange-700';
const inactiveDayClass = 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100';

watch(
  () => props.isOpen,
  (open) => {
    if (open) {
      // reset input state each time modal opens
      noteDate.value = '';
      noteCategory.value = '';
      noteText.value = '';
      reminderText.value = '';
      reminderDays.value = null;
      reminderCustomDate.value = '';
      showCustomDateInput.value = false;
      activeTab.value = 'recent';
      editingId.value = null;
      editingText.value = '';
    }
  }
);

const filteredHistory = computed(() => {
  const list = Array.isArray(props.notes) ? props.notes : [];

  if (activeTab.value === 'archived') return list.filter((n) => n.archived);
  if (activeTab.value === 'notes') return list.filter((n) => n.type === 'note' && !n.archived);
  return list.filter((n) => !n.archived); // recent
});

function formatNowLabel() {
  const d = new Date();
  const time = d.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
  return `Today, ${time}`;
}

function formatDateInput(dateStr) {
  if (!dateStr) return formatNowLabel();
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return formatNowLabel();
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function addItem(item) {
  const next = [item, ...(Array.isArray(props.notes) ? props.notes : [])];
  emit('update:notes', next);
}

const handleAddNote = () => {
  const item = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: 'note',
    text: noteText.value.trim(),
    category: noteCategory.value,
    date: formatDateInput(noteDate.value),
    author: 'You',
    pinned: false,
    archived: false
  };
  addItem(item);
  noteText.value = '';
  noteCategory.value = '';
  noteDate.value = '';
};

const selectReminderDays = (days) => {
  reminderDays.value = days;
  reminderCustomDate.value = '';
  showCustomDateInput.value = false;
};

const openCustomDate = () => {
  showCustomDateInput.value = true;
  reminderDays.value = null;
};

const cancelCustomDate = () => {
  showCustomDateInput.value = false;
  reminderCustomDate.value = '';
};

function computeDueDate() {
  if (reminderCustomDate.value) return formatDateInput(reminderCustomDate.value);
  if (!reminderDays.value) return '';
  const d = new Date();
  d.setDate(d.getDate() + Number(reminderDays.value));
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

const handleAddReminder = () => {
  const item = {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    type: 'reminder',
    text: reminderText.value.trim(),
    category: '',
    date: formatNowLabel(),
    dueDate: computeDueDate(),
    author: 'You',
    pinned: false,
    archived: false
  };
  addItem(item);
  reminderText.value = '';
  reminderDays.value = null;
  reminderCustomDate.value = '';
  showCustomDateInput.value = false;
};

const startEdit = (item) => {
  editingId.value = item.id;
  editingText.value = item.text;
};

const cancelEdit = () => {
  editingId.value = null;
  editingText.value = '';
};

const saveEdit = (id) => {
  const list = Array.isArray(props.notes) ? props.notes : [];
  const next = list.map((n) => (n.id === id ? { ...n, text: editingText.value } : n));
  emit('update:notes', next);
  cancelEdit();
};

const togglePin = (id) => {
  const list = Array.isArray(props.notes) ? props.notes : [];
  const next = list.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n));
  emit('update:notes', next);
};

const toggleArchive = (id) => {
  const list = Array.isArray(props.notes) ? props.notes : [];
  const next = list.map((n) => (n.id === id ? { ...n, archived: !n.archived } : n));
  emit('update:notes', next);
};

const deleteItem = (id) => {
  const list = Array.isArray(props.notes) ? props.notes : [];
  const next = list.filter((n) => n.id !== id);
  emit('update:notes', next);
  if (editingId.value === id) cancelEdit();
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom scrollbar */
.scrollbar-thin {
  scrollbar-width: thin;
}

.scrollbar-thumb-gray-200::-webkit-scrollbar {
  width: 6px;
}

.scrollbar-thumb-gray-200::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thumb-gray-200::-webkit-scrollbar-thumb {
  background-color: #e5e7eb;
  border-radius: 3px;
}

.scrollbar-thumb-gray-200::-webkit-scrollbar-thumb:hover {
  background-color: #d1d5db;
}
</style>


