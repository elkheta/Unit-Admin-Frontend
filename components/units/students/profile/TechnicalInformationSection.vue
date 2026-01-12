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
            <div class="flex items-center justify-between mt-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Last Seen on Site</label>
                    <p class="text-sm text-gray-900">{{ lastSeenTimestamp }}</p>
                </div>
                <div class="flex items-center gap-2">
                    <template v-if="relativeTime">  
                        <Monitor :size="18" class="text-orange-500" />
                        <span class="text-sm text-orange-600 font-medium" >{{ relativeTime }} ago</span>
                    </template>
                    <span class="text-sm text-orange-600 font-medium" v-else>N/A</span>
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
    return props.student?.lastSeenTimestamp || '';
});

const relativeTime = computed(() => {
    return props.student?.lastActive || '';
});
</script>
