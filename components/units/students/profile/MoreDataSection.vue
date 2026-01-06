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
                    {{ hobby }}
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
                    {{ subject }}
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
                    {{ subject }}
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
                    class="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg flex items-center gap-2"
                >
                    {{ label }}
                    <button
                        class="text-blue-500 hover:text-blue-700"
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

const emit = defineEmits(['update-data']);

const props = defineProps({
    student: {
        type: Object,
        default: null
    },
    educationalSections: {
        type: Array,
        default: () => []
    },
    labels: {
        type: Array,
        default: () => []
    }
});

const isExpanded = ref(false);

const selectedGovernorate = ref('');
const selectedHobby = ref('');
const selectedWeakestSubject = ref('');
const selectedPreferredSubject = ref('');
const selectedLabel = ref('');

const selectedHobbies = ref([]);
const selectedWeakestSubjects = ref([]);
const selectedPreferredSubjects = ref([]);
const selectedLabels = ref([]);

// Watch for student changes to load data
watch(() => props.student, (newStudent) => {
  if (newStudent) {
    selectedGovernorate.value = newStudent.governorate || '';
    selectedHobbies.value = newStudent.hobbies || [];
    selectedWeakestSubjects.value = newStudent.weakestSubjects || [];
    selectedPreferredSubjects.value = newStudent.preferredSubjects || [];
    selectedLabels.value = newStudent.labels || [];
  }
}, { immediate: true });

const handleHobbyAdd = (value) => {
  if (value && !selectedHobbies.value.includes(value)) {
    const hobbyLabel = hobbyOptions.value.find(h => h.value === value)?.label || value;
    selectedHobbies.value.push(hobbyLabel);
    selectedHobby.value = '';
    emit('update-data', { hobbies: selectedHobbies.value });
  }
};

const removeHobby = (index) => {
  selectedHobbies.value.splice(index, 1);
  emit('update-data', { hobbies: selectedHobbies.value });
};

const handleWeakestSubjectAdd = (value) => {
  if (value && !selectedWeakestSubjects.value.includes(value)) {
    const subjectLabel = subjectOptions.value.find(s => s.value === value)?.label || value;
    selectedWeakestSubjects.value.push(subjectLabel);
    selectedWeakestSubject.value = '';
    emit('update-data', { weakestSubjects: selectedWeakestSubjects.value });
  }
};

const removeWeakestSubject = (index) => {
  selectedWeakestSubjects.value.splice(index, 1);
  emit('update-data', { weakestSubjects: selectedWeakestSubjects.value });
};

const handlePreferredSubjectAdd = (value) => {
  if (value && !selectedPreferredSubjects.value.includes(value)) {
    const subjectLabel = subjectOptions.value.find(s => s.value === value)?.label || value;
    selectedPreferredSubjects.value.push(subjectLabel);
    selectedPreferredSubject.value = '';
    emit('update-data', { preferredSubjects: selectedPreferredSubjects.value });
  }
};

const removePreferredSubject = (index) => {
  selectedPreferredSubjects.value.splice(index, 1);
  emit('update-data', { preferredSubjects: selectedPreferredSubjects.value });
};

const handleLabelAdd = (value) => {
  if (value && !selectedLabels.value.includes(value)) {
    const labelName = labelOptions.value.find(l => l.value === value)?.label || value;
    selectedLabels.value.push(labelName);
    selectedLabel.value = '';
    emit('update-data', { labels: selectedLabels.value });
  }
};

const removeLabel = (index) => {
  selectedLabels.value.splice(index, 1);
  emit('update-data', { labels: selectedLabels.value });
};

const handleGovernorateChange = (value) => {
  emit('update-data', { governorate: value });
};

// Hard-coded hobbies
const hobbyOptions = computed(() => {
    const hobbies = [
        'Reading',
        'Sports',
        'Music',
        'Art',
        'Programming',
        'Gaming',
        'Photography',
        'Writing',
        'Dancing',
        'Cooking'
    ];
    return hobbies.map(hobby => ({ value: hobby.toLowerCase(), label: hobby }));
});

// Subjects based on educational section
const subjectOptions = computed(() => {
    // This would typically come from the student's educational section
    // For now, using common subjects
    const subjects = [
        'Mathematics',
        'Arabic',
        'English',
        'Science',
        'History',
        'Geography',
        'Physics',
        'Chemistry',
        'Biology',
        'French',
        'German'
    ];
    return subjects.map(subject => ({ value: subject.toLowerCase(), label: subject }));
});

// Labels from labels page
const labelOptions = computed(() => {
    return props.labels.map(label => ({
        value: label.id,
        label: label.name
    }));
});

// Governorate options (Egyptian governorates in Arabic)
const governorateOptions = [
    { value: 'cairo', label: 'القاهرة' },
    { value: 'alexandria', label: 'الإسكندرية' },
    { value: 'giza', label: 'الجيزة' },
    { value: 'sharqia', label: 'الشرقية' },
    { value: 'dakahlia', label: 'الدقهلية' },
    { value: 'beheira', label: 'البحيرة' },
    { value: 'monufia', label: 'المنوفية' },
    { value: 'qalyubia', label: 'القليوبية' },
    { value: 'gharbia', label: 'الغربية' },
    { value: 'kafr-elsheikh', label: 'كفر الشيخ' }
];
</script>
