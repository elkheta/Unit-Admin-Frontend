<template>
    <div class="bg-white border border-gray-200 rounded-lg p-6">
        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
            <h3 class="text-lg font-bold text-gray-900">Parent Info</h3>
            <button
                class="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-600 text-sm font-medium rounded-lg border border-gray-200 hover:from-blue-100 hover:to-blue-200 transition-all"
                @click="handleAddParent">
                <Plus :size="16" class="text-blue-600" />
                <span>+ Add Parent</span>
            </button>
        </div>

        <!-- Parent Identity -->
        <div v-if="parent" class="mb-4">
            <div class="mb-2">
                <BaseInput :model-value="parentName" disabled input-class="bg-gray-50" />
            </div>
            <p class="text-sm font-bold text-gray-900">{{ parent.phone }}</p>
        </div>

        <!-- Parent Notes -->
        <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-2">Parent Notes</label>
            <textarea v-model="parentNotes" rows="4" placeholder="Add notes about parents..."
                class="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none" />
        </div>

        <!-- Action Buttons -->
        <div class="space-y-3">
            <BaseButton variant="success" class="w-full" :icon="MessageCircle" @click="$emit('whatsapp-contact')">
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
import { MessageCircle, User, Plus, UserRound } from 'lucide-vue-next';
import { BaseInput, BaseButton } from '../../../ui';

const props = defineProps({
    parent: {
        type: Object,
        default: null
    }
});

const emit = defineEmits(['go-to-parent-profile', 'whatsapp-contact', 'add-parent']);

const parentNotes = ref('');

const parentName = computed(() => {
    if (!props.parent?.name) return '';
    return `${props.parent.name} (Parent)`;
});

watch(() => props.parent, (newParent) => {
    if (newParent) {
        parentNotes.value = newParent.notes || '';
    }
}, { immediate: true });

const handleAddParent = () => {
    emit('add-parent');
};
</script>
