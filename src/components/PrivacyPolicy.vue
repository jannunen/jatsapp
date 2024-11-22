<template>
  <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black opacity-50" @click="$emit('close')"></div>
      
      <!-- Modal -->
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-2xl w-full">
        <div class="space-y-4">
          <h2 class="text-2xl font-bold dark:text-white">Privacy Policy & Data Usage</h2>
          
          <div class="space-y-4 text-gray-600 dark:text-gray-300">
            <section>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Local Data Storage</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>Game data is primarily stored locally on your device using browser's localStorage</li>
                <li>No personal data is collected or tracked</li>
                <li>Game history remains on your device until you clear it</li>
              </ul>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Cloud Backups</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>Optional backup feature stores your game data on our servers</li>
                <li>Backups include:
                  <ul class="list-circle pl-5 mt-1">
                    <li>Game history</li>
                    <li>Player names</li>
                    <li>Scores</li>
                    <li>Optional backup descriptions</li>
                  </ul>
                </li>
                <li>Each device gets a unique anonymous ID</li>
                <li>You can delete your backups at any time</li>
                <li>Backups are stored securely using Supabase</li>
              </ul>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Score Sharing</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>When sharing scores, only game-related data is stored:
                  <ul class="list-circle pl-5 mt-1">
                    <li>Player names</li>
                    <li>Game scores</li>
                    <li>Timestamps</li>
                  </ul>
                </li>
                <li>Shared scores are automatically deleted after 24 hours</li>
                <li>No tracking or analytics are performed on shared scores</li>
              </ul>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Data Security</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>All server communication is encrypted using HTTPS</li>
                <li>Backups are only accessible with your device ID</li>
                <li>No passwords or personal information are stored</li>
                <li>Data is hosted in EU-based servers</li>
              </ul>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Your Rights</h3>
              <ul class="list-disc pl-5 space-y-1">
                <li>You can clear all local data using browser settings</li>
                <li>You can delete your backups within the app</li>
                <li>You can request deletion of all your data</li>
                <li>No data is shared with third parties</li>
              </ul>
            </section>

            <section>
              <h3 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">Contact</h3>
              <p>For any privacy-related questions or data deletion requests, please contact:</p>
              <p class="font-medium mt-1">jatsapp@annunen.fi</p>
            </section>
          </div>

          <div class="flex justify-end mt-6">
            <button 
              @click="$emit('close')"
              class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  show: boolean;
}>();

defineEmits(['close']);
</script> 