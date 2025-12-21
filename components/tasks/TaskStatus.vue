<template>
  <span
:class="`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium ${
    status === 'active' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'
  }`">
    {{ status }}
  </span>
</template>

<script setup>
defineProps({
  status: {
    type: String,
    required: true
  }
});
</script>

