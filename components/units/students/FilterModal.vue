<template>
    <Teleport to="body">
        <div v-if="isOpen" class="fixed inset-0 z-50" @click.self="$emit('close')">
            <div class="bg-white rounded-lg shadow-xl border border-gray-200 p-6 min-w-[320px] max-w-md absolute"
                :style="positionStyle">
                <!-- Comparison Type Selection -->
                <div class="flex gap-2 mb-4">
                    <button :class="[
                        'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        comparisonType === 'more-than'
                            ? activeClass
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]" @click="comparisonType = 'more-than'">
                        More than
                    </button>
                    <button :class="[
                        'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        comparisonType === 'less-than'
                            ? activeClass
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]" @click="comparisonType = 'less-than'">
                        Less than
                    </button>
                    <button :class="[
                        'flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        comparisonType === 'between'
                            ? activeClass
                            : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                    ]" @click="comparisonType = 'between'">
                        Between
                    </button>
                </div>

                <!-- Value Input (for More than / Less than) -->
                <div v-if="comparisonType !== 'between'" class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ valueLabel }}</label>
                    <BaseInput v-model.number="singleValue" type="number" :placeholder="valuePlaceholder"
                        input-class="bg-white border border-gray-300" />
                </div>

                <!-- Range Inputs (for Between) -->
                <div v-else class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 mb-2">{{ rangeLabel }}</label>
                    <div class="flex gap-2">
                        <BaseInput v-model.number="rangeMin" type="number" placeholder="Min"
                            input-class="bg-white border border-gray-300" />
                        <BaseInput v-model.number="rangeMax" type="number" placeholder="Max"
                            input-class="bg-white border border-gray-300" />
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-3">
                    <BaseButton :variant="applyButtonVariant" class="flex-1" @click="handleApply">
                        Apply Filter
                    </BaseButton>
                    <BaseButton variant="danger" class="flex-1" @click="handleCancel">
                        Cancel Filter
                    </BaseButton>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { BaseInput, BaseButton } from '../../ui';

const props = defineProps({
    isOpen: {
        type: Boolean,
        default: false
    },
    filterType: {
        type: String,
        required: true,
        validator: (value) => ['diamonds', 'progress', 'lessons', 'last-seen', 'score'].includes(value)
    },
    currentFilter: {
        type: Object,
        default: null
    },
    position: {
        type: Object,
        default: () => ({ top: 0, left: 0 })
    }
});

const emit = defineEmits(['close', 'apply-filter']);

const comparisonType = ref('more-than');
const singleValue = ref(0);
const rangeMin = ref(0);
const rangeMax = ref(100);

// Filter type configurations
const filterConfigs = {
    diamonds: {
        valueLabel: 'Value:',
        valuePlaceholder: '0',
        rangeLabel: 'Range',
        activeClass: 'bg-blue-50 border-blue-300 text-blue-700',
        applyButtonVariant: 'primary'
    },
    progress: {
        valueLabel: 'Progress Value:',
        valuePlaceholder: '0',
        rangeLabel: 'Range',
        activeClass: 'bg-green-50 border-green-300 text-green-700',
        applyButtonVariant: 'success'
    },
    score: {
        valueLabel: 'Score Value:',
        valuePlaceholder: '0',
        rangeLabel: 'Score Range',
        activeClass: 'bg-indigo-50 border-indigo-300 text-indigo-700',
        applyButtonVariant: 'primary'
    },
    lessons: {
        valueLabel: 'Subjects Parts Count:',
        valuePlaceholder: '0',
        rangeLabel: 'Subjects Parts Count',
        activeClass: 'bg-purple-50 border-purple-300 text-purple-700',
        applyButtonVariant: 'primary'
    },
    'last-seen': {
        valueLabel: 'Days:',
        valuePlaceholder: '0',
        rangeLabel: 'Days',
        activeClass: 'bg-purple-50 border-purple-300 text-purple-700',
        applyButtonVariant: 'primary'
    }
};

const config = computed(() => filterConfigs[props.filterType] || filterConfigs.diamonds);
const valueLabel = computed(() => config.value.valueLabel);
const valuePlaceholder = computed(() => config.value.valuePlaceholder);
const rangeLabel = computed(() => config.value.rangeLabel);
const activeClass = computed(() => config.value.activeClass);
const applyButtonVariant = computed(() => config.value.applyButtonVariant);

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

// Watch for modal open to reset values
watch(() => props.isOpen, (isOpen) => {
    if (isOpen) {
        if (props.currentFilter) {
            comparisonType.value = props.currentFilter.type || 'more-than';
            singleValue.value = props.currentFilter.value || 0;
            rangeMin.value = props.currentFilter.min || 0;
            rangeMax.value = props.currentFilter.max || 100;
        } else {
            comparisonType.value = 'more-than';
            singleValue.value = 0;
            rangeMin.value = 0;
            rangeMax.value = 100;
        }
    }
});

const handleApply = () => {
    const filterData = {
        type: comparisonType.value,
        value: comparisonType.value !== 'between' ? singleValue.value : null,
        min: comparisonType.value === 'between' ? rangeMin.value : null,
        max: comparisonType.value === 'between' ? rangeMax.value : null
    };

    emit('apply-filter', filterData);
    emit('close');
};

const handleCancel = () => {
    emit('close');
};
</script>
