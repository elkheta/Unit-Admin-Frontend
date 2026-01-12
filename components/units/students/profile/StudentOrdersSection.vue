<template>
  <div class="bg-white border border-gray-200 rounded-lg p-6">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-lg font-bold text-gray-900">Student Orders</h3>
      <span
        v-if="orders.length > 0"
        class="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full"
      >
        {{ orders.length }} {{ orders.length === 1 ? 'order' : 'orders' }}
      </span>
    </div>

    <!-- Orders List -->
    <div v-if="orders.length > 0" class="space-y-4">
      <div
        v-for="order in orders"
        :key="order.id"
        class="border border-gray-200 rounded-lg p-5 hover:shadow-lg transition-all bg-white"
      >
        <!-- Order Header -->
        <div class="flex items-start justify-between mb-5">
          <h4 class="text-base font-semibold text-gray-900 leading-tight">{{ order.productName }}</h4>
          <span class="text-base font-bold text-blue-600 ml-4">{{ order.price }}</span>
        </div>

        <!-- Order Details Grid -->
        <div class="grid grid-cols-3 gap-6 mb-5 pb-4 border-b border-gray-100">
          <!-- Status -->
          <div>
            <p class="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">STATUS</p>
            <div class="flex items-center gap-2">
              <div
                class="w-2.5 h-2.5 rounded-full flex-shrink-0"
                :class="order.status === 'EXPIRED' ? 'bg-orange-500' : 'bg-green-500'"
              ></div>
              <span
                class="text-sm font-medium"
                :class="order.status === 'EXPIRED' ? 'text-orange-700' : 'text-green-700'"
              >
                {{ order.status }}
              </span>
            </div>
          </div>

          <!-- Paid At -->
          <div>
            <p class="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">PAID AT</p>
            <p class="text-sm text-gray-900 font-medium">{{ order.paidAt }}</p>
          </div>

          <!-- Expires -->
          <div>
            <p class="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">EXPIRES</p>
            <p class="text-sm text-gray-900 font-medium">{{ order.expires }}</p>
            <p v-if="order.timeLeft" class="text-xs text-orange-600 font-medium mt-1.5">
              {{ order.timeLeft }}
            </p>
          </div>
        </div>

        <!-- View Order Button -->
        <BaseButton
          variant="primary"
          class="w-full"
          :icon="Eye"
          @click="$emit('view-order', order)"
        >
          View Order
        </BaseButton>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center py-12 text-gray-500">
      <div class="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
        <ShoppingBag :size="24" class="text-gray-400" />
      </div>
      <p class="text-sm font-medium">No orders found</p>
      <p class="text-xs text-gray-400 mt-1">This student has no orders yet</p>
    </div>
  </div>
</template>

<script setup>
import { Eye, ShoppingBag } from 'lucide-vue-next';
import { BaseButton } from '../../../ui';

defineProps({
  orders: {
    type: Array,
    default: () => []
  }
});

defineEmits(['view-order']);
</script>
