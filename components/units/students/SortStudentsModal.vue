<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-50" @click.self="$emit('close')">
            <div class="bg-white rounded-lg shadow-xl border border-gray-200 p-4 min-w-[280px] absolute"
                :style="positionStyle">
                <h3 class="text-base font-semibold text-gray-900 mb-3">Sort Students By:</h3>
                
                <div class="space-y-4">
                    <!-- Progress Sorting -->
                    <div>
                        <label class="block text-xs font-medium text-gray-500 mb-2">Progress</label>
                        <div class="flex gap-2">
                            <button :class="[
                                'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                                sortOptions.progress === 'high-to-low'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                            ]" @click="setSort('progress', 'high-to-low')">
                                High to Low
                            </button>
                            <button :class="[
                                'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                                sortOptions.progress === 'low-to-high'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                            ]" @click="setSort('progress', 'low-to-high')">
                                Low to High
                            </button>
                        </div>
                    </div>

                    <!-- Diamonds Sorting -->
                    <div>
                        <label class="block text-xs font-medium text-gray-500 mb-2">Diamonds</label>
                        <div class="flex gap-2">
                            <button :class="[
                                'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                                sortOptions.diamonds === 'high-to-low'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                            ]" @click="setSort('diamonds', 'high-to-low')">
                                High to Low
                            </button>
                            <button :class="[
                                'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                                sortOptions.diamonds === 'low-to-high'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                            ]" @click="setSort('diamonds', 'low-to-high')">
                                Low to High
                            </button>
                        </div>
                    </div>

                    <!-- Last Seen on Site Sorting -->
                    <div>
                        <label class="block text-xs font-medium text-gray-500 mb-2">Last Seen on Site</label>
                        <div class="flex gap-2">
                            <button :class="[
                                'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                                sortOptions.lastSeen === 'most-recent'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                            ]" @click="setSort('lastSeen', 'most-recent')">
                                Most Recent
                            </button>
                            <button :class="[
                                'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                                sortOptions.lastSeen === 'oldest'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                            ]" @click="setSort('lastSeen', 'oldest')">
                                Oldest
                            </button>
                        </div>
                    </div>

                    <!-- Date Added Sorting -->
                    <div>
                        <label class="block text-xs font-medium text-gray-500 mb-2">Date Added</label>
                        <div class="flex gap-2">
                            <button :class="[
                                'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                                sortOptions.dateAdded === 'newest-first'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                            ]" @click="setSort('dateAdded', 'newest-first')">
                                Newest First
                            </button>
                            <button :class="[
                                'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                                sortOptions.dateAdded === 'oldest-first'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                            ]" @click="setSort('dateAdded', 'oldest-first')">
                                Oldest First
                            </button>
                        </div>
                    </div>

                    <!-- Expiration Date Sorting -->
                    <div>
                        <label class="block text-xs font-medium text-gray-500 mb-2">Expiration Date</label>
                        <div class="flex gap-2">
                            <button :class="[
                                'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                                sortOptions.expirationDate === 'newest-expired'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                            ]" @click="setSort('expirationDate', 'newest-expired')">
                                Soonest
                            </button>
                            <button :class="[
                                'flex-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors border',
                                sortOptions.expirationDate === 'oldest-expired'
                                    ? 'bg-blue-50 border-blue-200 text-blue-600'
                                    : 'bg-white border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-200'
                            ]" @click="setSort('expirationDate', 'oldest-expired')">
                                Latest
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, watch, computed } from 'vue';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    position: {
        type: Object,
        default: () => ({ top: 0, left: 0 })
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

const positionStyle = computed(() => {
    if (props.position.top && props.position.left) {
        return {
            position: 'absolute',
            top: `${props.position.top}px`,
            left: `${props.position.left}px`
        };
    }
    return {};
});

// Helper to set a single sort option and clear others
const setSort = (key, value) => {
    // Reset all options
    Object.keys(sortOptions.value).forEach(k => {
        sortOptions.value[k] = null;
    });
    
    // Set the selected option
    sortOptions.value[key] = value;
    
    // Auto-apply logic
    emit('apply-sort', { ...sortOptions.value });
    emit('close');
};

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
</script>
