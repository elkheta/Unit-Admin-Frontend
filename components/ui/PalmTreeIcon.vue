<template>
    <svg :width="size" :height="size" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
        :class="iconClass">
        <!-- Palm Tree Trunk (Brown) -->
        <rect x="11" y="14" width="2" height="8" fill="#8B4513" />
        <!-- Palm Fronds (Green) -->
        <path d="M12 8 L8 12 L12 10 L16 12 Z" fill="#22c55e" />
        <path d="M12 6 L6 10 L12 8 L18 10 Z" fill="#22c55e" />
        <path d="M12 4 L4 8 L12 6 L20 8 Z" fill="#22c55e" />
        <path d="M12 8 L10 14 L12 12 L14 14 Z" fill="#22c55e" />
        <path d="M12 10 L9 16 L12 14 L15 16 Z" fill="#22c55e" />
    </svg>
</template>

<script setup>
defineProps({
    size: {
        type: Number,
        default: 24
    },
    iconClass: {
        type: String,
        default: ''
    }
});
</script>
