<template>
  <Teleport to="body">
    <div v-if="state.loading" class="loader-overlay">
      <div class="flex flex-col items-center gap-3">
        <Loader class="w-10 h-10 text-primary-500 animate-spin" />
        <span class="text-black font-medium">جاري التحميل...</span>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { Loader } from 'lucide-vue-next';
import { useLoader } from '../../composables/useLoader';

const { state } = useLoader();
</script>

<style scoped>
.loader-overlay {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
