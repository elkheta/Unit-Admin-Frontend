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

        <!-- Add Name/Phone Buttons Row -->
        <div class="flex gap-2 mb-3">
            <button
                type="button"
                class="flex-1 px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors text-xs font-medium"
                title="Add extra name"
                @click="handleAddName"
            >
                <Plus :size="14" />
                <span>Add Name</span>
            </button>
            <button
                type="button"
                class="flex-1 px-3 py-2 bg-blue-50 text-blue-600 border border-blue-200 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors text-xs font-medium"
                title="Add extra phone"
                @click="handleAddPhone"
            >
                <Plus :size="14" />
                <span>Add Phone</span>
            </button>
        </div>

        <!-- Main Name (Non-editable) -->
        <div class="flex items-center gap-3 mb-3">
            <div class="flex-1">
                <BaseInput
                    :model-value="firstName"
                    disabled
                    placeholder="First Name"
                    input-class="bg-gray-100 text-gray-600 cursor-not-allowed border-blue-200"
                />
            </div>
            <div class="flex-1">
                <BaseInput
                    :model-value="lastName"
                    disabled
                    placeholder="Last Name"
                    input-class="bg-gray-100 text-gray-600 cursor-not-allowed"
                />
            </div>
        </div>

        <!-- Extra Names -->
        <div v-for="(name, index) in extraNames" :key="`extra-name-${index}`" class="flex items-center gap-3 mb-3">
            <div class="flex-1">
                <BaseInput
                    v-model="extraNames[index]"
                    placeholder="Extra Name"
                    input-class="bg-white focus:ring-2 focus:ring-blue-100"
                />
            </div>
            <button
                type="button"
                class="w-9 h-9 flex-shrink-0 bg-red-50 text-red-600 border border-red-100 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                title="Remove"
                @click="removeExtraName(index)"
            >
                <X :size="18" />
            </button>
        </div>

        <!-- Main Phone (Non-editable) -->
        <div class="flex items-center gap-2 mb-3">
            <div class="flex-1 relative">
                <BaseInput
                    :model-value="phoneNumber"
                    disabled
                    input-class="bg-gray-100 text-gray-600 cursor-not-allowed pr-20"
                />
                <span class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">(Account)</span>
            </div>
            <input
                v-model="mainPhoneHasWhatsapp"
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-100 cursor-pointer"
                title="Has WhatsApp"
            />
            <button
                type="button"
                :disabled="!mainPhoneHasWhatsapp"
                class="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors"
                :class="
                    mainPhoneHasWhatsapp
                        ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100'
                        : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                "
                :title="mainPhoneHasWhatsapp ? 'Open WhatsApp' : 'WhatsApp not available'"
                @click="openWhatsApp(phoneNumber)"
            >
                <MessageCircle :size="18" />
            </button>
        </div>

        <!-- Extra Phones -->
        <div
            v-for="(phoneObj, index) in extraPhones"
            :key="`extra-phone-${index}`"
            class="flex items-center gap-2 mb-3"
        >
            <div class="flex-1">
                <BaseInput
                    v-model="phoneObj.phone"
                    placeholder="Extra Phone Number"
                    input-class="bg-white focus:ring-2 focus:ring-blue-100"
                />
            </div>
            <input
                v-model="phoneObj.hasWhatsapp"
                type="checkbox"
                class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-100 cursor-pointer"
                title="Has WhatsApp"
            />
            <button
                type="button"
                :disabled="!phoneObj.phone || !phoneObj.hasWhatsapp"
                class="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors"
                :class="
                    phoneObj.phone && phoneObj.hasWhatsapp
                        ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100'
                        : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                "
                :title="phoneObj.hasWhatsapp ? 'Open WhatsApp' : 'WhatsApp not available'"
                @click="openWhatsApp(phoneObj.phone)"
            >
                <MessageCircle :size="18" />
            </button>
            <button
                type="button"
                class="w-9 h-9 flex-shrink-0 bg-red-50 text-red-600 border border-red-100 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                title="Remove"
                @click="removeExtraPhone(index)"
            >
                <X :size="18" />
            </button>
        </div>

        <!-- Email -->
        <div class="mb-4">
            <BaseInput
                v-model="email"
                type="email"
                placeholder="Email Address"
                input-class="bg-gray-50 text-gray-400 italic focus:ring-2 focus:ring-blue-100"
            />
        </div>

        <!-- Go to Student Profile Button -->
        <BaseButton class="w-full bg-indigo-600 hover:bg-indigo-700 text-white" :icon="User" @click="$emit('go-to-profile')">
            Go to Student Profile
        </BaseButton>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { MessageCircle, User, Plus, X } from 'lucide-vue-next';
import { BaseInput, BaseButton } from '../../../ui';

const props = defineProps({
    student: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['go-to-profile', 'add-name', 'add-phone']);

const email = ref('');
const extraNames = ref([]);
const extraPhones = ref([]);
const mainPhoneHasWhatsapp = ref(true);

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
        // If backend provides arrays later, we can hydrate them here. For now start empty.
        extraNames.value = Array.isArray(newStudent.extraNames) ? [...newStudent.extraNames] : [];
        extraPhones.value = Array.isArray(newStudent.extraPhones) ? [...newStudent.extraPhones] : [];
    }
}, { immediate: true });

const handleAddName = () => {
    extraNames.value.push('');
    emit('add-name');
};

const handleAddPhone = () => {
    extraPhones.value.push({ phone: '', hasWhatsapp: false });
    emit('add-phone');
};

const removeExtraName = (index) => {
    extraNames.value.splice(index, 1);
};

const removeExtraPhone = (index) => {
    extraPhones.value.splice(index, 1);
};

const openWhatsApp = (rawPhone) => {
    if (!rawPhone) return;
    const phoneNumber = String(rawPhone).replace(/[\s+]/g, '');
    window.open(`https://wa.me/${phoneNumber}`, '_blank');
};
</script>
