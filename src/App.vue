<template>
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Yatzy Score Manager</h1>
    <div v-if="!gameStarted">
      <PlayerSetup @players-added="initializeGame" />
      <ScoreHistory />
    </div>
    <div v-if="gameStarted">
      <ScoreTable :players="players" @reset-scores="resetScores" />
      <div class="mt-4 flex gap-2">
        <button 
          @click="endGame" 
          class="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
        >
          End Game
        </button>
        <button 
          @click="cancelGame" 
          class="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
        >
          Cancel Game
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import PlayerSetup from './components/PlayerSetup.vue';
import ScoreTable from './components/ScoreTable.vue';
import ScoreHistory from './components/ScoreHistory.vue';

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
