<template>
  <div class="min-h-screen transition-colors duration-200 dark:bg-gray-900 dark:text-white flex flex-col">
    <div class="container mx-auto px-2 py-2 max-w-3xl flex-grow">
      <div class="flex justify-between items-center mb-1">
        <div class="w-10">
        </div>
        <router-link to="/" class="text-xl sm:text-2xl font-bold">JatsApp <small class="text-xs text-gray-500 dark:text-gray-400">v{{  version }}</small></router-link>
        <button 
          @click="toggleTheme" 
          class="p-1.5 sm:p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 w-10"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <!-- Sun icon for dark mode -->
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon for light mode -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
      <router-view></router-view>
    </div>


  </div>
</template>

<script setup>
import { ref , computed} from 'vue';
import { useTheme } from './composables/useTheme';

const version = computed(() => import.meta.env.VITE_APP_VERSION);
const { isDark, toggleTheme } = useTheme();
</script>

<style>
/* Add any global styles here */
</style>
