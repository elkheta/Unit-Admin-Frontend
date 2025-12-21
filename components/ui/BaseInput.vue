<template>
  <div>
    <label v-if="label" class="block text-sm font-medium mb-2" :class="labelClass">
      {{ label }}
    </label>
    <div class="relative">
      <div v-if="icon" class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <component :is="icon" class="h-5 w-5" :class="iconClass" />
      </div>
      <input
        :type="type"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        :placeholder="placeholder"
        :disabled="disabled"
        :class="computedInputClasses"
        :dir="dir"
      />
      <div v-if="$slots.suffix" class="absolute inset-y-0 right-0 pr-4 flex items-center">
        <slot name="suffix" />
      </div>
    </div>
    <p v-if="error" class="mt-2 text-sm font-medium" :class="errorClass" :dir="errorDir">
      {{ error }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  modelValue: {
    type: [String, Number],
    default: ''
  },
  type: {
    type: String,
    default: 'text'
  },
  placeholder: {
    type: String,
    default: ''
  },
  label: {
    type: String,
    default: ''
  },
  error: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    default: null
  },
  disabled: {
    type: Boolean,
    default: false
  },
  labelClass: {
    type: String,
    default: ''
  },
  iconClass: {
    type: String,
    default: 'text-gray-400'
  },
  inputClass: {
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
  },
  dir: {
    type: String,
    default: 'ltr'
  }
});

defineEmits(['update:modelValue']);

const computedInputClasses = computed(() => {
  const base = 'w-full rounded-xl text-sm focus:outline-none focus:ring-2 transition-all';
  const padding = props.icon ? 'pl-12 pr-4' : 'px-4';
  const errorState = props.error ? 'border-red-500' : 'border-white/10';
  const disabledState = props.disabled ? 'opacity-50 cursor-not-allowed' : '';
  
  return `${base} ${padding} py-3.5 ${errorState} ${disabledState} ${props.inputClass}`;
});
</script>
