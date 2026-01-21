<template>
  <div class="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-200">
    <ProductIcon />
    <ProductName :name="product.name" />
    <ProductStatus :status="product.status" />
  </div>
</template>

<script setup>
import { ProductIcon, ProductName, ProductStatus } from './index.js';

defineProps({
  product: {
    type: Object,
    required: true
  }
});
</script>

