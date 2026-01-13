<template>
    <Teleport to="body">
        <Transition name="slide">
            <div v-if="isOpen"
                class="fixed inset-y-0 right-0 w-full max-w-2xl bg-white shadow-2xl z-50 flex flex-col overflow-hidden">
                <!-- Header -->
                <div class="flex-shrink-0 px-6 py-4 border-b border-gray-200 bg-white">
                    <div class="flex items-center justify-between mb-2">
                        <div>
                            <h2 class="text-2xl font-bold text-gray-900">{{ displayStudent?.name || student?.name || 'Student Profile' }}</h2>
                            <p class="text-sm text-gray-500 mt-1">Student Profile</p>
                        </div>
                        <div class="flex items-center gap-3">
                            <BaseButton v-if="!profileError" variant="primary" size="sm" :disabled="saving || profileLoading" @click="handleSave">
                                Save
                            </BaseButton>
                            <button class="p-2 hover:bg-gray-100 rounded-lg transition-colors" @click="handleClose">
                                <X :size="20" class="text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Content -->
                <div class="flex-1 overflow-y-auto px-6 py-6">
                    <div v-if="effectiveProfileLoading" class="py-10 text-center text-sm text-gray-500">
                        Loading profile...
                    </div>

                    <div v-else-if="effectiveProfileError" class="py-10">
                        <div class="border border-red-200 bg-red-50 rounded-lg p-4">
                            <div class="font-semibold text-red-800 mb-1">Failed to load student profile</div>
                            <div class="text-sm text-red-700 break-words">{{ profileErrorMessage }}</div>
                        </div>
                    </div>

                    <div v-else class="space-y-6">
                    <!-- Personal Information Section -->
                    <PersonalInformationSection
                        :personal-information="personalInformation"
                        :status="profile?.orders?.status"
                        :expires-at="profile?.orders?.expires_at"
                        @go-to-profile="handleGoToStudentProfile"
                        @field-change="handleFieldChange"
                    />

                    <!-- More Data Section -->
                    <MoreDataSection
                      :more-data="profile?.more_data"
                      @field-change="handleFieldChange"
                    />

                    <!-- Special Notes -->
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Special Notes</label>
                        <textarea v-model="specialNotes" rows="4" placeholder="Add special notes about the student..."
                            class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" />
                    </div>

                    <!-- Parent Info Section -->
                    <ParentInfoSection
                        :parent-info="profile?.parent_info"
                        @go-to-parent-profile="handleGoToParentProfile"
                        @whatsapp-contact="handleWhatsAppContact"
                        @field-change="handleFieldChange"
                    />

                    <!-- Educational Information Section -->
                    <EducationalInformationSection :student="displayStudent || student" />

                    <!-- Technical Information Section -->
                    <TechnicalInformationSection :student="displayStudent || student" />

                    <!-- Student Orders Section -->
                    <StudentOrdersSection :orders="displayOrders || orders" @view-order="handleViewOrder" />
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<script setup>
import { ref, watch, computed, nextTick } from 'vue';
import { X } from 'lucide-vue-next';
import { useQuery, useMutation } from '@vue/apollo-composable';
import { BaseButton } from '../../ui';
import PersonalInformationSection from './profile/PersonalInformationSection.vue';
import MoreDataSection from './profile/MoreDataSection.vue';
import ParentInfoSection from './profile/ParentInfoSection.vue';
import EducationalInformationSection from './profile/EducationalInformationSection.vue';
import TechnicalInformationSection from './profile/TechnicalInformationSection.vue';
import StudentOrdersSection from './profile/StudentOrdersSection.vue';
import { GET_STUDENT_PROFILE } from '../../../graphql/queries/studentProfile';
import { UPDATE_PROFILE_MUTATION } from '../../../graphql/mutations/updateProfile';
import { useToast } from '../../../composables/useToast';

const studentProfileCache = ref({});

const setCachedProfile = (id, p) => {
  if (!id || !p) return;
  studentProfileCache.value = { ...studentProfileCache.value, [id]: p };
};



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
const parentNote = ref('');

const studentId = computed(() => props.student?.id ? String(props.student.id) : null);
const cachedProfile = computed(() => (studentId.value ? (studentProfileCache.value[studentId.value] || null) : null));
const shouldFetchProfile = computed(() => Boolean(props.isOpen && studentId.value && !cachedProfile.value));

const { error: toastError, success: toastSuccess } = useToast();

const {
  result: profileResult,
  loading: profileLoading,
  error: profileError,
} = useQuery(
  GET_STUDENT_PROFILE,
  computed(() => ({ studentId: studentId.value })),
  computed(() => ({
    enabled: shouldFetchProfile.value,
    fetchPolicy: 'no-cache', 
  }))
);

// Prefer cached profile when available (avoid network).
const profile = computed(() => cachedProfile.value || profileResult.value?.studentProfile || null);
const effectiveProfileLoading = computed(() => (cachedProfile.value ? false : profileLoading.value));
const effectiveProfileError = computed(() => (cachedProfile.value ? null : profileError.value));

const personalInformation = computed(() => {
  const pi = profile.value?.personal_information;
  if (!pi) return null;
  return pi;
});



const profileErrorMessage = computed(() => {
  const e = effectiveProfileError.value;
  if (!e) return '';
  return (
    e?.graphQLErrors?.[0]?.message ||
    e?.networkError?.message ||
    e.message ||
    'Unknown error'
  );
});

watch(profileError, (e) => {
  if (e) toastError('Failed to load student profile: ' + e.message);
});

// Store fetched profile in cache so next open doesn't trigger a query.
watch(
  () => profileResult.value?.studentProfile,
  (p) => {
    if (p && studentId.value) {
      setCachedProfile(studentId.value, p);
    }
  }
);

const sortIds = (ids) => {
  if (!Array.isArray(ids)) return [];
  return ids.map(String).filter(Boolean).sort();
};

const getFirstValidationMessage = (apolloError) => {
  const gqlError = apolloError?.graphQLErrors?.[0];
  const validation = gqlError?.extensions?.validation;
  if (!validation || typeof validation !== 'object') return null;

  const firstFieldErrors = Object.values(validation)?.[0];
  if (Array.isArray(firstFieldErrors) && firstFieldErrors.length > 0) {
    return String(firstFieldErrors[0]);
  }
  return null;
};

// Track only the fields that have been changed by user interaction
const changedFields = ref({});
const isHydrating = ref(true);

const hydrateFromProfile = (p) => {
  if (!p) return;
  isHydrating.value = true;

  specialNotes.value = p.personal_information?.special_note || '';
  parentNote.value = p.parent_info?.parent_note || '';

  // Clear any pending changes when new profile data loads
  changedFields.value = {};

  nextTick(() => {
    isHydrating.value = false;
  });
};

watch(profile, (p) => {
  hydrateFromProfile(p);
}, { immediate: true });

const handleClose = () => {
    emit('close');
};

// Handle field changes from child components
const handleFieldChange = (fieldName, value) => {
  if (isHydrating.value) return;
  changedFields.value[fieldName] = value;
};

// Handle special notes change (direct textarea in this component)
watch(specialNotes, (value) => {
  if (isHydrating.value) return;
  handleFieldChange('special_note', value ?? '');
});

watch(parentNote, (value) => {
  if (isHydrating.value) return;
  handleFieldChange('parent_note', value ?? '');
});

const { mutate: updateProfile, loading: saving } = useMutation(UPDATE_PROFILE_MUTATION);

const handleSave = () => {
  if (!studentId.value) return;

  const input = { 
    student_id: studentId.value,
    ...changedFields.value 
  };

  updateProfile({ input })
    ?.then((res) => {
      const ok = Boolean(res?.data?.updateProfile?.status);
      if (!ok) {
        toastError('Failed to save profile.');
        return;
      }

      toastSuccess('Profile updated.');
      
      // Clear changed fields after successful save
      changedFields.value = {};

      // Keep legacy event for any parent-side state updates
      emit('save', input);
    })
    .catch((e) => {
      const validationMsg = getFirstValidationMessage(e);
      toastError(validationMsg || (e?.message || 'Failed to save profile.'));
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
    const phone = profile.value?.parent_info?.parent?.phone_number;
    if (phone) {
        const phoneNumber = String(phone).replace(/[\s+]/g, '');
        const whatsappUrl = `https://wa.me/${phoneNumber}`;
        window.open(whatsappUrl, '_blank');
        emit('whatsapp-contact', { phone_number: phone });
    }
};

const handleViewOrder = (order) => {
    if (order?.id) {
        window.open(`https://elkheta.org/orders/${order.id}`, '_blank');
        emit('view-order', order);
    }
};

const displayStudent = computed(() => {
  const p = profile.value;
  if (!p) return props.student;

  const first = p.personal_information?.first_name || '';
  const last = p.personal_information?.last_name || '';
  const name = `${first} ${last}`.trim() || props.student?.name || '';

  const edu = p.educational_information || {};
  const tech = p.technical_information || {};

  return {
    ...(props.student || {}),
    name,
    email: p.personal_information?.email || '',
    extraNames: Array.isArray(p.personal_information?.names) ? p.personal_information.names : [],
    specialNotes: p.personal_information?.special_note || '',
    governorate: p.more_data?.governorate || '',
    educationalSection: edu.education_section?.name || '',
    secondLanguage: edu.second_language || '',
    religionLanguage: edu.religion_language || '',
    lastSeenTimestamp: tech.last_seen || '',
    lastActive: tech.since_when || ''
  };
});

const displayOrders = computed(() => {
  const p = profile.value;
  if (!p?.orders?.orders) return props.orders || [];
  return (p.orders.orders || []).map((o) => ({
    id: String(o.number),
    productName: `Order #${o.number}`,
    price: o.price ?? '',
    status: o.status ?? '',
    paidAt: o.paid_at ?? '',
    expires: o.expires_at?.date ?? '',
    timeLeft: o.expires_at?.left ?? ''
  }));
});
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
