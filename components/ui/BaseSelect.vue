<template>
    <div>
        <label v-if="label" class="block text-sm font-medium mb-2" :class="labelClass">
            {{ label }}
        </label>
        <div class="relative">
            <select
:value="modelValue" :disabled="disabled" :class="computedSelectClasses"
                @change="$emit('update:modelValue', $event.target.value)">
                <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
                <option v-for="option in options" :key="option.value" :value="option.value">
                    {{ option.label }}
                </option>
            </select>
            <ChevronDown
:size="14"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
        </div>
        <p v-if="error" class="mt-2 text-sm font-medium" :class="errorClass" :dir="errorDir">
            {{ error }}
        </p>
    </div>
</template>

<script setup>
import { computed } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const props = defineProps({
    modelValue: {
        type: [String, Number],
        default: ''
    },
    label: {
        type: String,
        default: ''
    },
    placeholder: {
        type: String,
        default: ''
    },
    options: {
        type: Array,
        required: true,
        validator: (options) => {
            return Array.isArray(options) && options.every(opt =>
                opt && typeof opt === 'object' && 'value' in opt && 'label' in opt
            );
        }
    },
    error: {
        type: String,
        default: ''
    },
    disabled: {
        type: Boolean,
        default: false
    },
    labelClass: {
        type: String,
        default: ''
    },
    selectClass: {
        type: String,
        default: ''
    },
    errorClass: {
        type: String,
        default: 'text-red-400'
    },
    errorDir: {
        type: String,
        default: 'ltr'
    }
});

defineEmits(['update:modelValue']);

const computedSelectClasses = computed(() => {
    const base = 'w-full appearance-none border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all';
    const errorState = props.error ? 'border-red-500' : '';
    const disabledState = props.disabled ? 'opacity-50 cursor-not-allowed' : '';

    return `${base} ${errorState} ${disabledState} ${props.selectClass}`;
});
</script>
