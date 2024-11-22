<template>
  <div>
    <button 
      @click="createBackup"
      class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
    >
      Backup Games
    </button>

    <div v-if="backups.length > 0" class="mt-4">
      <h3 class="text-lg font-bold mb-2">Previous Backups</h3>
      <div class="space-y-2">
        <div v-for="backup in backups" :key="backup.id" 
             class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <div class="flex justify-between items-start">
            <div>
              <div class="text-sm text-gray-500">
                {{ new Date(backup.created_at).toLocaleString() }}
              </div>
              <div class="text-sm mt-1">
                Players: {{ backup.player_names.join(', ') }}
              </div>
              <div v-if="backup.description" class="text-sm italic mt-1">
                {{ backup.description }}
              </div>
            </div>
            <button 
              @click="restore(backup.id)"
              class="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
            >
              Restore
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { backupService } from '../services/backupService';

const backups = ref([]);

const loadBackups = async () => {
  try {
    backups.value = await backupService.getBackups();
  } catch (error) {
    console.error('Failed to load backups:', error);
  }
};

const createBackup = async () => {
  const description = prompt('Add a description for this backup (optional):');
  try {
    await backupService.backupGames(description || undefined);
    await loadBackups();
  } catch (error) {
    console.error('Failed to create backup:', error);
  }
};

const restore = async (backupId: string) => {
  if (confirm('Are you sure you want to restore this backup? Current game data will be replaced.')) {
    try {
      await backupService.restoreBackup(backupId);
      window.location.reload();
    } catch (error) {
      console.error('Failed to restore backup:', error);
    }
  }
};

onMounted(loadBackups);
</script> 