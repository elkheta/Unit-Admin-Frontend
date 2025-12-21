<template>
    <div class="bg-white border border-gray-200 rounded-lg p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Personal Information</h3>
            <span
                v-if="subscriptionStatus"
                class="px-3 py-1.5 bg-green-50 text-green-800 text-xs font-semibold rounded-lg border border-green-200"
            >
                {{ subscriptionStatus }}
            </span>
        </div>

        <!-- Action Buttons Row -->
        <div class="flex items-center gap-2 mb-4">
            <button
                class="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 text-sm font-medium rounded-lg border border-gray-200 hover:from-blue-100 hover:to-blue-200 transition-all"
                @click="handleAddName"
            >
                <Plus :size="16" class="text-blue-600" />
                <span>Add Name</span>
            </button>
            <button
                class="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 text-sm font-medium rounded-lg border border-gray-200 hover:from-blue-100 hover:to-blue-200 transition-all"
                @click="handleAddPhone"
            >
                <Plus :size="16" class="text-blue-600" />
                <span>Add Phone</span>
            </button>
        </div>

        <!-- Name Fields -->
        <div class="grid grid-cols-2 gap-4 mb-4">
            <div>
                <BaseInput :model-value="firstName" disabled input-class="bg-gray-50" />
            </div>
            <div>
                <BaseInput :model-value="lastName" disabled input-class="bg-gray-50" />
            </div>
        </div>

        <!-- Phone Number -->
        <div class="mb-4">
            <div class="relative">
                <BaseInput :model-value="phoneNumber" disabled input-class="bg-gray-50 pr-24" />
                <div class="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                    <div
                        class="w-5 h-5 rounded-full bg-yellow-100 flex items-center justify-center border border-yellow-200"
                    >
                        <Check :size="14" class="text-yellow-600" />
                    </div>
                    <MessageCircle :size="18" class="text-green-600" />
                </div>
            </div>
            <p class="text-xs text-gray-500 mt-1">(Account)</p>
        </div>

        <!-- Email -->
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <BaseInput v-model="email" type="email" placeholder="Email Address" />
        </div>

        <!-- Go to Student Profile Button -->
        <BaseButton class="w-full bg-purple-600 hover:bg-purple-700 text-white" :icon="User"
            @click="$emit('go-to-profile')">
            Go to Student Profile
        </BaseButton>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { Check, MessageCircle, User, Plus } from 'lucide-vue-next';
import { BaseInput, BaseButton } from '../../../ui';

const props = defineProps({
    student: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['go-to-profile', 'add-name', 'add-phone']);

const email = ref('');

const firstName = computed(() => {
    if (!props.student?.name) return '';
    const parts = props.student.name.split(' ');
    return parts[0] || '';
});

const lastName = computed(() => {
    if (!props.student?.name) return '';
    const parts = props.student.name.split(' ');
    return parts.slice(1).join(' ') || '';
});

const phoneNumber = computed(() => {
    return props.student?.phone || '';
});

const subscriptionStatus = computed(() => {
    if (props.student?.subscriptionStatus) {
        return props.student.subscriptionStatus;
    }
    if (props.student?.daysToExpire !== undefined) {
        return `ACTIVE (${props.student.daysToExpire} DAYS TO EXPIRE)`;
    }
    return null;
});

watch(() => props.student, (newStudent) => {
    if (newStudent) {
        email.value = newStudent.email || '';
    }
}, { immediate: true });

const handleAddName = () => {
    emit('add-name');
};

const handleAddPhone = () => {
    emit('add-phone');
};
</script>
