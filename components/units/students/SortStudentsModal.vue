<template>
    <BaseModal :is-open="isOpen" @close="$emit('close')">
        <template #header>
            <h3 class="text-lg font-semibold text-gray-900">Sort Students By</h3>
        </template>

        <template #default>
            <div class="space-y-6">
                <!-- Progress Sorting -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Progress</label>
                    <div class="flex gap-2">
                        <button :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            sortOptions.progress === 'high-to-low'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]" @click="sortOptions.progress = 'high-to-low'">
                            High to Low
                        </button>
                        <button :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            sortOptions.progress === 'low-to-high'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]" @click="sortOptions.progress = 'low-to-high'">
                            Low to High
                        </button>
                    </div>
                </div>

                <!-- Diamonds Sorting -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Diamonds</label>
                    <div class="flex gap-2">
                        <button :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            sortOptions.diamonds === 'high-to-low'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]" @click="sortOptions.diamonds = 'high-to-low'">
                            High to Low
                        </button>
                        <button :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            sortOptions.diamonds === 'low-to-high'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]" @click="sortOptions.diamonds = 'low-to-high'">
                            Low to High
                        </button>
                    </div>
                </div>

                <!-- Last Seen on Site Sorting -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Last Seen on Site</label>
                    <div class="flex gap-2">
                        <button :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            sortOptions.lastSeen === 'most-recent'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]" @click="sortOptions.lastSeen = 'most-recent'">
                            Most Recent
                        </button>
                        <button :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            sortOptions.lastSeen === 'oldest'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]" @click="sortOptions.lastSeen = 'oldest'">
                            Oldest
                        </button>
                    </div>
                </div>

                <!-- Date Added Sorting -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date Added</label>
                    <div class="flex gap-2">
                        <button :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            sortOptions.dateAdded === 'newest-first'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]" @click="sortOptions.dateAdded = 'newest-first'">
                            Newest First
                        </button>
                        <button :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            sortOptions.dateAdded === 'oldest-first'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]" @click="sortOptions.dateAdded = 'oldest-first'">
                            Oldest First
                        </button>
                    </div>
                </div>

                <!-- Expiration Date Sorting -->
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Expiration Date</label>
                    <div class="flex gap-2">
                        <button :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            sortOptions.expirationDate === 'newest-expired'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]" @click="sortOptions.expirationDate = 'newest-expired'">
                            Newest Expired
                        </button>
                        <button :class="[
                            'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                            sortOptions.expirationDate === 'oldest-expired'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        ]" @click="sortOptions.expirationDate = 'oldest-expired'">
                            Oldest Expired
                        </button>
                    </div>
                </div>
            </div>
        </template>

        <template #footer>
            <div class="flex justify-end gap-3">
                <BaseButton variant="secondary" @click="handleCancel">Cancel</BaseButton>
                <BaseButton variant="primary" @click="handleApply">Apply Sort</BaseButton>
            </div>
        </template>
    </BaseModal>
</template>

<script setup>
import { ref, watch } from 'vue';
import { BaseModal, BaseButton } from '../../ui';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    currentSortOptions: {
        type: Object,
        default: () => ({
            progress: null,
            diamonds: null,
            lastSeen: null,
            dateAdded: 'newest-first', // Default
            expirationDate: null
        })
    }
});

const emit = defineEmits(['close', 'apply-sort']);

const sortOptions = ref({
    progress: null,
    diamonds: null,
    lastSeen: null,
    dateAdded: 'newest-first', // Default
    expirationDate: null
});

// Watch for prop changes to update local state
watch(() => props.currentSortOptions, (newOptions) => {
    if (newOptions) {
        sortOptions.value = { ...newOptions };
    }
}, { immediate: true, deep: true });

// Watch for modal open to reset to current options
watch(() => props.isOpen, (isOpen) => {
    if (isOpen && props.currentSortOptions) {
        sortOptions.value = { ...props.currentSortOptions };
    }
});

const handleApply = () => {
    emit('apply-sort', { ...sortOptions.value });
    emit('close');
};

const handleCancel = () => {
    // Reset to current options
    sortOptions.value = { ...props.currentSortOptions };
    emit('close');
};
</script>
