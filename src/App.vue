<template>
  <div class="min-h-screen transition-colors duration-200 dark:bg-gray-900 dark:text-white">
    <div class="container mx-auto p-4">
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">JatsApp</h1>
        <button 
          @click="toggleTheme" 
          class="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <!-- Sun icon for dark mode -->
          <svg v-if="isDark" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
          <!-- Moon icon for light mode -->
          <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        </button>
      </div>
      <div v-if="!gameStarted">
        <PlayerSetup @players-added="initializeGame" />
        <ScoreHistory />
      </div>
      <div v-if="gameStarted">
        <ScoreTable :players="players" @reset-scores="resetScores" />
        <div class="mt-4 flex gap-2">
          <button 
            @click="endGame" 
            class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded dark:bg-red-600 dark:hover:bg-red-700"
          >
            End Game
          </button>
          <button 
            @click="cancelGame" 
            class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Cancel Game
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import PlayerSetup from './components/PlayerSetup.vue';
import ScoreTable from './components/ScoreTable.vue';
import ScoreHistory from './components/ScoreHistory.vue';
import { useTheme } from './composables/useTheme';

const { isDark, toggleTheme } = useTheme();

const players = ref([]);
const gameStarted = ref(false);

// Load saved game state when the component mounts
const savedState = localStorage.getItem('yatzyGameState');
if (savedState) {
  const state = JSON.parse(savedState);
  players.value = state.players;
  gameStarted.value = state.gameStarted;
}

// Watch for changes in the game state and save them
watch(
  [players, gameStarted],
  () => {
    localStorage.setItem(
      'yatzyGameState',
      JSON.stringify({
        players: players.value,
        gameStarted: gameStarted.value
      })
    );
  },
  { deep: true }
);

const initializeGame = (playerNames) => {
  players.value = playerNames.map(name => ({ name, scores: {}, total: 0 }));
  gameStarted.value = true;
};

const updateScore = (playerIndex, category, score) => {
  players.value[playerIndex].scores[category] = score;
  // Recalculate total
  players.value[playerIndex].total = Object.values(players.value[playerIndex].scores).reduce((a, b) => a + b, 0);
};

const saveGameHistory = () => {
  const gameHistory = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]');
  
  const finishedGame = {
    timestamp: new Date().toISOString(),
    players: players.value.map(player => ({
      name: player.name,
      scores: player.scores,
      total: Object.values(player.scores).reduce((a, b) => a + (b || 0), 0)
    })),
    winner: players.value.reduce((prev, current) => {
      const prevTotal = Object.values(prev.scores).reduce((a, b) => a + (b || 0), 0);
      const currentTotal = Object.values(current.scores).reduce((a, b) => a + (b || 0), 0);
      return prevTotal > currentTotal ? prev : current;
    }).name
  };

  gameHistory.push(finishedGame);
  localStorage.setItem('yatzyGameHistory', JSON.stringify(gameHistory));
};

const endGame = () => {
  if (confirm('Are you sure you want to end the game? This will save the results and reset all scores.')) {
    saveGameHistory();
    localStorage.removeItem('yatzyGameState');
    players.value = [];
    gameStarted.value = false;
  }
};

const cancelGame = () => {
  if (confirm('Are you sure you want to cancel the game? All progress will be lost.')) {
    localStorage.removeItem('yatzyGameState');
    players.value = [];
    gameStarted.value = false;
  }
};

const resetScores = () => {
  if (confirm('Are you sure you want to reset all scores? This cannot be undone.')) {
    players.value = players.value.map(player => ({
      ...player,
      scores: {},
      total: 0
    }));
  }
};
</script>

<style>
/* Add any global styles here */
</style>
