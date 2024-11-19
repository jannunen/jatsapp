<template>
  <div class="mt-8 mb-4">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200">Hall of Fame 🏆</h3>
      <button 
        @click="showShame = !showShame"
        class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
      >
        {{ showShame ? 'Hide Hall of Shame' : 'Show Hall of Shame 💀' }}
      </button>
    </div>

    <!-- Hall of Fame -->
    <div class="space-y-2">
      <div v-for="(score, index) in topScores" :key="index" 
           class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="flex items-center gap-2">
          <!-- Medal emojis -->
          <span class="text-xl" v-if="index === 0">🥇</span>
          <span class="text-xl" v-else-if="index === 1">🥈</span>
          <span class="text-xl" v-else-if="index === 2">🥉</span>
          
          <div class="flex-grow">
            <div class="flex justify-between items-baseline">
              <span class="font-bold text-gray-800 dark:text-gray-200">{{ score.player }}</span>
              <span class="text-2xl font-bold text-yellow-500 dark:text-yellow-400">{{ score.total }}</span>
            </div>
            <div class="text-sm text-gray-500 dark:text-gray-400">
              {{ new Date(score.date).toLocaleDateString() }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Hall of Shame -->
    <div v-if="showShame" class="mt-6">
      <h3 class="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Hall of Shame 💀</h3>
      <div class="space-y-2">
        <div v-for="(score, index) in worstScores" :key="index" 
             class="p-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div class="flex items-center gap-2">
            <span class="text-xl">{{ ['🪦', '⚰️', '☠️'][index] || '💀' }}</span>
            
            <div class="flex-grow">
              <div class="flex justify-between items-baseline">
                <span class="font-bold text-gray-800 dark:text-gray-200">{{ score.player }}</span>
                <span class="text-2xl font-bold text-red-500 dark:text-red-400">{{ score.total }}</span>
              </div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ new Date(score.date).toLocaleDateString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div v-if="topScores.length === 0" class="text-center text-gray-500 dark:text-gray-400 py-4">
      No games played yet
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const topScores = ref([]);
const worstScores = ref([]);
const showShame = ref(false);

onMounted(() => {
  const history = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]');
  
  // Get all player scores from all games
  const allScores = history.flatMap(game => 
    game.players.map(player => ({
      player: player.name,
      total: player.total,
      date: game.timestamp
    }))
  );
  
  // Sort by score and get top 5
  topScores.value = allScores
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  // Get worst 3 scores (minimum 50 points to filter out incomplete games)
  worstScores.value = allScores
    .filter(score => score.total >= 50)
    .sort((a, b) => a.total - b.total)
    .slice(0, 3);
});
</script> 