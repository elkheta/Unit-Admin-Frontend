<template>
  <div>
    <FormLabel text="UNIT PRODUCTS" />
    <div class="bg-gray-50 rounded-lg p-3 border border-gray-200">
      <div v-if="products && products.length > 0" class="space-y-3">
        <ProductItem
          v-for="(product, index) in products"
          :key="index"
          :product="product"
        />
      </div>
      <EmptyProductsMessage v-else />
    </div>
  </div>
</template>

<script setup>
import { FormLabel } from '../../ui';
import { ProductItem, EmptyProductsMessage } from './index.js';

defineProps({
  products: {
    type: Array,
    default: () => []
  }
});
</script>

