<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center backdrop-blur-sm p-4"
        @click.self="handleClose"
      >
        <div class="bg-white rounded-xl w-full max-w-md shadow-2xl overflow-hidden animate-scale-in">
          <div v-if="title || $slots.header" class="p-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h3 v-if="title" class="font-bold text-lg text-gray-900">{{ title }}</h3>
            <slot v-else name="header" />
            <button
              @click="handleClose"
              class="p-1.5 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X :size="20" />
            </button>
          </div>
          <div class="p-6">
            <slot />
          </div>
          <div v-if="$slots.footer" class="p-5 border-t border-gray-100 bg-gray-50">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { X } from 'lucide-vue-next';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  }
});

const emit = defineEmits(['close']);

const handleClose = () => {
  emit('close');
};
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.animate-scale-in {
  animation: scaleIn 0.2s ease-out;
}

@keyframes scaleIn {
  from {
    transform: scale(0.95);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>

