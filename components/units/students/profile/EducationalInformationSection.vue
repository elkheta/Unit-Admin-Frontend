<template>
    <div class="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <!-- Header -->
        <button class="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            @click="isExpanded = !isExpanded">
            <h3 class="text-lg font-bold text-gray-900">Educational Information</h3>
            <ChevronUp :size="20" class="text-gray-500 transition-transform" :class="{ 'rotate-180': !isExpanded }" />
        </button>

        <!-- Content -->
        <div v-if="isExpanded" class="px-6 pb-6 space-y-4">
            <!-- Educational Section -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Educational Section</label>
                <BaseInput :model-value="educationalSection" disabled input-class="bg-gray-50" />
            </div>

            <!-- Second Language -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Second Language</label>
                <BaseInput :model-value="secondLanguage" disabled input-class="bg-gray-50" />
            </div>

            <!-- Religion Language -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Religion Language</label>
                <BaseInput :model-value="religionLanguage" disabled input-class="bg-gray-50" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { ChevronUp } from 'lucide-vue-next';
import { BaseInput } from '../../../ui';

const props = defineProps({
    student: {
        type: Object,
        default: null
    }
});

const isExpanded = ref(false);

const educationalSection = computed(() => {
    return props.student?.educationalSection || '';
});

const secondLanguage = computed(() => {
    return props.student?.secondLanguage || '';
});

const religionLanguage = computed(() => {
    return props.student?.religionLanguage || '';
});
</script>
