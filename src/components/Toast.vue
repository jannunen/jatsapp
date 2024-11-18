<template>
  <div 
    v-if="show"
    class="fixed top-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg shadow-lg 
           dark:bg-gray-700 transition-opacity duration-300 text-lg font-medium z-50
           min-w-[300px] flex items-center justify-between"
    :class="{ 'opacity-0': !show }"
  >
    <span>{{ message }}</span>
    <button 
      @click="$emit('close')" 
      class="ml-4 text-gray-400 hover:text-white"
    >
      ×
    </button>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  message: String
});

defineEmits(['close']);
</script> 