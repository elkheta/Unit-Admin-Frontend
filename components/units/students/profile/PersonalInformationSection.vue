<template>
    <div class="bg-white border border-gray-200 rounded-lg p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Personal Information</h3>
            <span
                v-if="status"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg border"
                :class="isExpired ? 'bg-orange-50 text-orange-800 border-orange-200' : 'bg-green-50 text-green-800 border-green-200'"
            >
                {{ status }} ( {{ expiresAt }} )
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
                    :model-value="mainPhoneNumber"
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
                :disabled="!mainPhoneNumber || !mainPhoneHasWhatsapp"
                class="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors"
                :class="
                    mainPhoneNumber && mainPhoneHasWhatsapp
                        ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100'
                        : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                "
                :title="mainPhoneHasWhatsapp ? 'Open WhatsApp' : 'WhatsApp not available'"
                @click="openWhatsApp(mainPhoneNumber)"
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
                disabled
                input-class="bg-gray-100 text-gray-600 cursor-not-allowed"
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
  personalInformation: {
    type: Object,
    default: null
  },
  status: {
    type: String,
    default: ''
  },
  expiresAt: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['go-to-profile', 'add-name', 'add-phone', 'field-change']);

const email = ref('');
const extraNames = ref([]);
const extraPhones = ref([]);
const mainPhoneHasWhatsapp = ref(true);

const firstName = computed(() => props.personalInformation?.first_name || '');
const lastName = computed(() => props.personalInformation?.last_name || '');

const mainPhoneNumber = computed(() => props.personalInformation?.phone_number || '');

const isExpired = computed(() => {
  const s = String(props.status || '').toUpperCase();
  return props.status === 'EXPIRED';
});

watch(
  () => props.personalInformation,
  (pi) => {
    if (!pi) return;
    email.value = pi.email || '';
    extraNames.value = Array.isArray(pi.names) ? [...pi.names] : [];

    mainPhoneHasWhatsapp.value = Boolean(pi.is_whatsapp);

    const phones = Array.isArray(pi.phone_numbers) ? pi.phone_numbers : [];
    extraPhones.value = phones.map((p) => ({
      phone: p?.phone_number || '',
      hasWhatsapp: Boolean(p?.is_whatsapp)
    }));
  },
  { immediate: true }
);

const emitPhoneNumbers = () => {
  const list = [];

  for (const p of Array.isArray(extraPhones.value) ? extraPhones.value : []) {
    const phone = String(p?.phone || '').trim();
    if (!phone) continue;
    list.push({
      phone_number: phone,
      is_whatsapp: Boolean(p?.hasWhatsapp)
    });
  }

  emit('field-change', 'phone_numbers', list);
};

watch(mainPhoneHasWhatsapp, () => {
  emitPhoneNumbers();
});

watch(extraPhones, () => {
  emitPhoneNumbers();
}, { deep: true });

watch(extraNames, (value) => {
  const cleaned = Array.isArray(value)
    ? value.map((v) => String(v ?? '').trim()).filter(Boolean)
    : [];
  emit('field-change', 'names', cleaned);
}, { deep: true });

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
