<template>
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <!-- Header -->
        <button class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            @click="isExpanded = !isExpanded">
            <h3 class="text-lg font-bold text-gray-900">More Data</h3>
            <ChevronUp :size="20" class="text-gray-500 transition-transform" :class="{ 'rotate-180': !isExpanded }" />
        </button>

        <!-- Content -->
        <div v-if="isExpanded" class="px-6 pb-6 space-y-4">
            <!-- Governorate -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Governorate</label>
                <BaseSelect v-model="selectedGovernorate" :options="governorateOptions" placeholder="اختر المحافظة" />
            </div>

            <!-- Hobbies -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Hobbies</label>
                <BaseSelect
                    v-model="selectedHobby"
                    :options="hobbyOptions"
                    placeholder="+ Add hobby"
                    @update:model-value="handleHobbyAdd"
                />
            </div>
            <div v-if="selectedHobbies.length > 0" class="flex flex-wrap gap-2 mb-2">
                <span
                    v-for="(hobby, index) in selectedHobbies"
                    :key="index"
                    class="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-lg flex items-center gap-2"
                >
                    {{ hobby.name }}
                    <button
                        class="text-gray-500 hover:text-gray-700"
                        @click="removeHobby(index)"
                    >
                        <X :size="14" />
                    </button>
                </span>
            </div>

            <!-- Weakest Subjects -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Weakest Subjects</label>
                <BaseSelect
                    v-model="selectedWeakestSubject"
                    :options="subjectOptions"
                    placeholder="+ Add subject"
                    @update:model-value="handleWeakestSubjectAdd"
                />
            </div>
            <div v-if="selectedWeakestSubjects.length > 0" class="flex flex-wrap gap-2 mb-2">
                <span
                    v-for="(subject, index) in selectedWeakestSubjects"
                    :key="index"
                    class="px-3 py-1 bg-red-50 text-red-700 text-sm rounded-lg flex items-center gap-2"
                >
                    {{ subject.name }}
                    <button
                        class="text-red-500 hover:text-red-700"
                        @click="removeWeakestSubject(index)"
                    >
                        <X :size="14" />
                    </button>
                </span>
            </div>

            <!-- Preferred Subjects -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Preferred Subjects</label>
                <BaseSelect
                    v-model="selectedPreferredSubject"
                    :options="subjectOptions"
                    placeholder="+ Add subject"
                    @update:model-value="handlePreferredSubjectAdd"
                />
            </div>
            <div v-if="selectedPreferredSubjects.length > 0" class="flex flex-wrap gap-2 mb-2">
                <span
                    v-for="(subject, index) in selectedPreferredSubjects"
                    :key="index"
                    class="px-3 py-1 bg-green-50 text-green-700 text-sm rounded-lg flex items-center gap-2"
                >
                    {{ subject.name }}
                    <button
                        class="text-green-500 hover:text-green-700"
                        @click="removePreferredSubject(index)"
                    >
                        <X :size="14" />
                    </button>
                </span>
            </div>

            <!-- Labels -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Labels</label>
                <BaseSelect
                    v-model="selectedLabel"
                    :options="labelOptions"
                    placeholder="+ Add label"
                    @update:model-value="handleLabelAdd"
                />
            </div>
            <div v-if="selectedLabels.length > 0" class="flex flex-wrap gap-2 mb-2">
                <span
                    v-for="(label, index) in selectedLabels"
                    :key="index"
                    class="px-3 py-1 bg-gray-50 text-gray-700 text-sm rounded-lg flex items-center gap-2"
                >
                    {{ label.name }}
                    <button
                        class="text-gray-500 hover:text-gray-700"
                        @click="removeLabel(index)"
                    >
                        <X :size="14" />
                    </button>
                </span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { ChevronUp, X } from 'lucide-vue-next';
import { BaseSelect } from '../../../ui';

const emit = defineEmits(['field-change']);

const props = defineProps({
  /**
   * Backend payload shape (from `studentProfile.more_data`)
   * {
   *   governorate: String
   *   hobbies: [{ id, name, selected }]
   *   weakest_subjects: [{ id, name, selected }]
   *   preferred_subjects: [{ id, name, selected }]
   *   labels: [{ id, name, selected }]
   * }
   */
  moreData: {
    type: Object,
    default: null
  }
});

const isExpanded = ref(false);

const selectedGovernorate = ref('');
const selectedHobby = ref('');
const selectedWeakestSubject = ref('');
const selectedPreferredSubject = ref('');
const selectedLabel = ref('');

const selectedHobbies = ref([]); // [{ id, name }]
const selectedWeakestSubjects = ref([]); // [{ id, name }]
const selectedPreferredSubjects = ref([]); // [{ id, name }]
const selectedLabels = ref([]); // [{ id, name }]

const normalizeSelectable = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .filter(Boolean)
    .map((i) => ({
      id: i.id != null ? String(i.id) : '',
      name: i.name ?? ''
    }))
    .filter((i) => i.id && i.name);
};

const selectedFromBackend = (items) => {
  if (!Array.isArray(items)) return [];
  return items
    .filter((i) => i?.selected)
    .map((i) => ({ id: String(i.id), name: i.name }))
    .filter((i) => i.id && i.name);
};

// Watch for backend data changes to load defaults
watch(
  () => props.moreData,
  (md) => {
    if (!md) return;
    selectedGovernorate.value = md.governorate || '';
    selectedHobbies.value = selectedFromBackend(md.hobbies);
    selectedWeakestSubjects.value = selectedFromBackend(md.weakest_subjects);
    selectedPreferredSubjects.value = selectedFromBackend(md.preferred_subjects);
    selectedLabels.value = selectedFromBackend(md.labels);
  },
  { immediate: true }
);

const handleHobbyAdd = (value) => {
  if (value && !selectedHobbies.value.some((h) => h.id === String(value))) {
    const found = hobbyOptions.value.find((h) => h.value === String(value));
    if (!found) return;
    selectedHobbies.value.push({ id: String(found.value), name: found.label });
    selectedHobby.value = '';
    emit('field-change', 'hobbies_ids', selectedHobbies.value.map((h) => h.id));
  }
};

const removeHobby = (index) => {
  selectedHobbies.value.splice(index, 1);
  emit('field-change', 'hobbies_ids', selectedHobbies.value.map((h) => h.id));
};

const handleWeakestSubjectAdd = (value) => {
  if (value && !selectedWeakestSubjects.value.some((s) => s.id === String(value))) {
    const found = subjectOptions.value.find((s) => s.value === String(value));
    if (!found) return;
    selectedWeakestSubjects.value.push({ id: String(found.value), name: found.label });
    selectedWeakestSubject.value = '';
    emit('field-change', 'weakest_subject_ids', selectedWeakestSubjects.value.map((s) => s.id));
  }
};

const removeWeakestSubject = (index) => {
  selectedWeakestSubjects.value.splice(index, 1);
  emit('field-change', 'weakest_subject_ids', selectedWeakestSubjects.value.map((s) => s.id));
};

const handlePreferredSubjectAdd = (value) => {
  if (value && !selectedPreferredSubjects.value.some((s) => s.id === String(value))) {
    const found = subjectOptions.value.find((s) => s.value === String(value));
    if (!found) return;
    selectedPreferredSubjects.value.push({ id: String(found.value), name: found.label });
    selectedPreferredSubject.value = '';
    emit('field-change', 'preferred_subject_ids', selectedPreferredSubjects.value.map((s) => s.id));
  }
};

const removePreferredSubject = (index) => {
  selectedPreferredSubjects.value.splice(index, 1);
  emit('field-change', 'preferred_subject_ids', selectedPreferredSubjects.value.map((s) => s.id));
};

const handleLabelAdd = (value) => {
  if (value && !selectedLabels.value.some((l) => l.id === String(value))) {
    const found = labelOptions.value.find((l) => l.value === String(value));
    if (!found) return;
    selectedLabels.value.push({ id: String(found.value), name: found.label });
    selectedLabel.value = '';
    emit('field-change', 'labels_ids', selectedLabels.value.map((l) => l.id));
  }
};

const removeLabel = (index) => {
  selectedLabels.value.splice(index, 1);
  emit('field-change', 'labels_ids', selectedLabels.value.map((l) => l.id));
};

watch(selectedGovernorate, (value) => {
  emit('field-change', 'governorate', value ?? '');
});

const hobbyOptions = computed(() => {
  return normalizeSelectable(props.moreData?.hobbies).map((h) => ({
    value: h.id,
    label: h.name
  }));
});

const subjectOptions = computed(() => {
  // Backend sends subjects lists twice (weakest/preferred) with separate `selected`.
  // We just need the unique selectable catalog for BaseSelect options.
  const weak = normalizeSelectable(props.moreData?.weakest_subjects);
  const pref = normalizeSelectable(props.moreData?.preferred_subjects);
  const byId = new Map();
  for (const s of [...weak, ...pref]) {
    byId.set(s.id, s.name);
  }
  return Array.from(byId.entries()).map(([id, name]) => ({ value: id, label: name }));
});

const labelOptions = computed(() => {
  return normalizeSelectable(props.moreData?.labels).map((l) => ({
    value: l.id,
    label: l.name
  }));
});

// Governorate options (Egyptian governorates in Arabic)
const governorateOptions = [
    { value: 'القاهرة', label: 'القاهرة' },
    { value: 'الاسكندرية', label: 'الإسكندرية' },
    { value: 'الجيزة', label: 'الجيزة' },
    { value: 'الشرقية', label: 'الشرقية' },
    { value: 'الدقهلية', label: 'الدقهلية' },
    { value: 'البحيرة', label: 'البحيرة' },
    { value: 'المنوفية', label: 'المنوفية' },
    { value: 'القليوبية', label: 'القليوبية' },
    { value: 'الغربية', label: 'الغربية' },
    { value: 'كفر الشيخ', label: 'كفر الشيخ' }
];
</script>
