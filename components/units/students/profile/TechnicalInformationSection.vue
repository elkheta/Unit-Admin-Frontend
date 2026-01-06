<template>
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <!-- Header -->
        <button class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            @click="isExpanded = !isExpanded">
            <h3 class="text-lg font-bold text-gray-900">Technical Information</h3>
            <ChevronUp :size="20" class="text-gray-500 transition-transform" :class="{ 'rotate-180': !isExpanded }" />
        </button>

        <!-- Content -->
        <div v-if="isExpanded" class="px-6 pb-6">
            <div class="flex items-center justify-between">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Seen on Site</label>
                    <p class="text-sm text-gray-900">{{ lastSeenTimestamp }}</p>
                </div>
                <div class="flex items-center gap-2">
                    <Monitor :size="18" class="text-orange-500" />
                    <span class="text-sm text-orange-600 font-medium">{{ relativeTime }}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronUp, Monitor } from 'lucide-vue-next';

const props = defineProps({
    student: {
        type: Object,
        default: null
    }
});

const isExpanded = ref(false);

const lastSeenTimestamp = computed(() => {
    if (props.student?.lastSeenTimestamp) {
        return props.student.lastSeenTimestamp;
    }
    // Format current date as example
    const now = new Date();
    return now.toLocaleString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    });
});

const relativeTime = computed(() => {
    if (props.student?.lastActive) {
        return props.student.lastActive;
    }
    // Calculate relative time from lastActive string
    if (props.student?.lastActive) {
        const lastActive = props.student.lastActive;
        if (lastActive.includes('day')) {
            const days = parseInt(lastActive);
            return `${days}d ago`;
        } else if (lastActive.includes('hour')) {
            const hours = parseInt(lastActive);
            return `${hours}h ago`;
        } else if (lastActive.includes('minutes')) {
            const minutes = parseInt(lastActive);
            return `${minutes}m ago`;
        }
    }
    return '3d ago'; // Default
});
</script>
