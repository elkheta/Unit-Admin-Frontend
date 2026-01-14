<template>
    <div class="bg-white border border-gray-200 rounded-lg p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Parent Info</h3>
            <button
                class="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 text-sm font-medium rounded-lg border border-gray-200 hover:from-blue-100 hover:to-blue-200 transition-all"
                @click="handleAddParent"
            >
                <Plus :size="16" class="text-blue-600" />
                <span> Add Parent</span>
            </button>
        </div>

        <!-- Main Parent (Non-editable) -->
        <div v-if="mainParentName || mainParentPhone" class="space-y-3 mb-4">
            <BaseInput :model-value="mainParentName" disabled input-class="bg-gray-100 text-gray-600 cursor-not-allowed" />
            <div v-if="mainParentPhone" class="text-sm font-bold text-gray-900 px-1">{{ mainParentPhone }}</div>
        </div>

        <!-- Extra Parents -->
        <div v-if="extraParents.length > 0" class="space-y-4">
            <div
                v-for="(p, index) in extraParents"
                :key="`extra-parent-${index}`"
                class="border-t border-gray-200 pt-4"
            >
                <!-- Parent Name -->
                <div class="flex items-center gap-2 mb-3">
                    <div class="flex-1">
                        <BaseInput
                            v-model="p.name"
                            placeholder="Parent Name"
                            input-class="bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <button
                        type="button"
                        class="w-9 h-9 flex-shrink-0 bg-red-50 text-red-600 border border-red-100 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                        title="Remove parent"
                        @click="removeParent(index)"
                    >
                        <X :size="18" />
                    </button>
                </div>

                <!-- Parent Phone -->
                <div class="flex items-center gap-2">
                    <div class="flex-1">
                        <BaseInput
                            v-model="p.phone_number"
                            placeholder="Phone Number"
                            input-class="bg-white focus:ring-2 focus:ring-blue-100"
                        />
                    </div>
                    <input
                        v-model="p.is_whatsapp"
                        type="checkbox"
                        class="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-2 focus:ring-green-100 cursor-pointer"
                        title="Has WhatsApp"
                    />
                    <button
                        type="button"
                        :disabled="!p.phone_number || !p.is_whatsapp"
                        class="w-9 h-9 flex-shrink-0 rounded-lg flex items-center justify-center transition-colors"
                        :class="
                            p.phone_number && p.is_whatsapp
                                ? 'bg-green-50 text-green-600 border border-green-100 hover:bg-green-100'
                                : 'bg-gray-50 text-gray-300 border border-gray-100 cursor-not-allowed'
                        "
                        :title="p.is_whatsapp ? 'Open WhatsApp' : 'WhatsApp not available'"
                        @click="openWhatsApp(p.phone_number)"
                    >
                        <MessageCircle :size="18" />
                    </button>
                </div>
            </div>
        </div>

        <!-- Parent Notes -->
        <div class="mb-4 mt-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Parent Notes</label>
            <textarea v-model="parentNotes" rows="4" placeholder="Add notes about parents..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" />
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
            <BaseButton
                variant="success"
                class="w-full"
                :icon="MessageCircle"
                :disabled="!mainParentPhone"
                @click="$emit('whatsapp-contact')"
            >
                Contact Main Parent via WhatsApp
            </BaseButton>
            <BaseButton variant="primary" class="w-full" :icon="UserRound" @click="$emit('go-to-parent-profile')">
                Go to Parent Profile
            </BaseButton>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { MessageCircle, Plus, UserRound, X } from 'lucide-vue-next';
import { BaseInput, BaseButton } from '../../../ui';

const props = defineProps({
  parentInfo: {
    type: Object,
    default: null
  }
});

const emit = defineEmits(['go-to-parent-profile', 'whatsapp-contact', 'field-change']);

const parentNotes = ref('');
const extraParents = ref([]);

const mainParentName = computed(() => {
  const name = props.parentInfo?.parent?.name;
  if (!name) return '';
  return `${name} (Parent)`;
});

const mainParentPhone = computed(() => {
  return props.parentInfo?.parent?.phone_number || '';
});

const normalizeExtraParents = (parents) => {
  if (!Array.isArray(parents)) return [];
  const mainPhone = mainParentPhone.value;
  return parents
    .filter(Boolean)
    .map((p) => ({
      name: p?.name || '',
      phone_number: p?.phone_number || '',
      is_whatsapp: Boolean(p?.is_whatsapp)
    }))
    .filter((p) => p.name || p.phone_number)
    .filter((p) => !mainPhone || p.phone_number !== mainPhone);
};

watch(
  () => props.parentInfo,
  (pi) => {
    if (!pi) return;
    parentNotes.value = pi.parent_note || '';
    extraParents.value = normalizeExtraParents(pi.parents);
  },
  { immediate: true }
);

watch(parentNotes, (value) => {
  emit('field-change', 'parent_note', value ?? '');
});

const handleAddParent = () => {
  extraParents.value.push({ name: '', phone_number: '', is_whatsapp: false });
};

const removeParent = (index) => {
  extraParents.value.splice(index, 1);
};

const openWhatsApp = (rawPhone) => {
  if (!rawPhone) return;
  const phoneNumber = String(rawPhone).replace(/[\s+]/g, '');
  window.open(`https://wa.me/${phoneNumber}`, '_blank');
};

watch(
  extraParents,
  (parents) => {
    const cleaned = (Array.isArray(parents) ? parents : [])
      .map((p) => ({
        name: String(p?.name || '').trim(),
        phone_number: String(p?.phone_number || '').trim(),
        is_whatsapp: Boolean(p?.is_whatsapp)
      }))
      .filter((p) => p.name && p.phone_number);

    emit('field-change', 'parents', cleaned);
  },
  { deep: true }
);
</script>
