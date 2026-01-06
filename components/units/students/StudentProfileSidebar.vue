<template>
    <Teleport to="body">
        <Transition name="slide">
            <div v-if="isOpen"
                class="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
                <!-- Header -->
                <div class="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">{{ student?.name || 'Student Profile' }}</h2>
                            <p class="text-sm text-gray-500 mt-1">Student Profile</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <BaseButton variant="primary" size="sm" @click="handleSave">
                                Save
                            </BaseButton>
                            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" @click="handleClose">
                                <X :size="20" class="text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6 space-y-6">
                    <!-- Personal Information Section -->
                    <PersonalInformationSection :student="student" @go-to-profile="handleGoToStudentProfile" />

                    <!-- More Data Section -->
                    <MoreDataSection
                      :student="student"
                      :educational-sections="educationalSections"
                      :labels="availableLabels"
                      @update-data="handleMoreDataUpdate"
                    />

                    <!-- Special Notes -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
                        <textarea v-model="specialNotes" rows="4" placeholder="Add special notes about the student..."
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" />
                    </div>

                    <!-- Parent Info Section -->
                    <ParentInfoSection :parent="parent" @go-to-parent-profile="handleGoToParentProfile"
                        @whatsapp-contact="handleWhatsAppContact" />

                    <!-- Educational Information Section -->
                    <EducationalInformationSection :student="student" />

                    <!-- Technical Information Section -->
                    <TechnicalInformationSection :student="student" />

                    <!-- Student Orders Section -->
                    <StudentOrdersSection :orders="orders" @view-order="handleViewOrder" />
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { X } from 'lucide-vue-next';
import { BaseButton } from '../../ui';
import PersonalInformationSection from './profile/PersonalInformationSection.vue';
import MoreDataSection from './profile/MoreDataSection.vue';
import ParentInfoSection from './profile/ParentInfoSection.vue';
import EducationalInformationSection from './profile/EducationalInformationSection.vue';
import TechnicalInformationSection from './profile/TechnicalInformationSection.vue';
import StudentOrdersSection from './profile/StudentOrdersSection.vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    student: {
        type: Object,
        default: null
    },
    parent: {
        type: Object,
        default: null
    },
    orders: {
        type: Array,
        default: () => []
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

const emit = defineEmits(['close', 'save', 'go-to-student-profile', 'go-to-parent-profile', 'whatsapp-contact', 'view-order']);

const specialNotes = ref('');

// Available labels from labels page
const availableLabels = computed(() => {
  // Default labels - in a real app, this would come from a store or API
  return props.labels.length > 0 ? props.labels : [
    { id: 1, name: 'VIP', category: 'Status' },
    { id: 2, name: 'New', category: 'Status' },
    { id: 3, name: 'Warning', category: 'Behavior' },
    { id: 4, name: 'Excellent', category: 'Academic' }
  ];
});

watch(() => props.student, (newStudent) => {
  if (newStudent) {
    specialNotes.value = newStudent.specialNotes || '';
  }
}, { immediate: true });

const handleClose = () => {
    emit('close');
};

const moreData = ref({});

const handleMoreDataUpdate = (data) => {
  moreData.value = { ...moreData.value, ...data };
};

const handleSave = () => {
  emit('save', {
    specialNotes: specialNotes.value,
    ...moreData.value
  });
};

const handleGoToStudentProfile = () => {
    if (props.student?.id) {
        window.open(`https://elkheta.org/students/${props.student.id}`, '_blank');
        emit('go-to-student-profile', props.student);
    }
};

const handleGoToParentProfile = () => {
    if (props.parent?.id) {
        window.open(`https://elkheta.org/parents/${props.parent.id}`, '_blank');
        emit('go-to-parent-profile', props.parent);
    }
};

const handleWhatsAppContact = () => {
    if (props.parent?.phone) {
        const phoneNumber = props.parent.phone.replace(/[\s+]/g, '');
        const whatsappUrl = `https://wa.me/${phoneNumber}`;
        window.open(whatsappUrl, '_blank');
        emit('whatsapp-contact', props.parent);
    }
};

const handleViewOrder = (order) => {
    if (order?.id) {
        window.open(`https://elkheta.org/orders/${order.id}`, '_blank');
        emit('view-order', order);
    }
};
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from {
    transform: translateX(100%);
}

.slide-leave-to {
    transform: translateX(100%);
}
</style>
