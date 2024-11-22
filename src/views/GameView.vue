<template>
  <div>
    <div v-if="!gameStarted">
      <PlayerSetup @players-added="initializeGame" />
    </div>
    <div v-else>
      <ScoreTable 
        :players="players" 
        @reset-scores="resetScores"
        @remove-player="removePlayer"
      />
      
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import PlayerSetup from '../components/PlayerSetup.vue';
import ScoreTable from '../components/ScoreTable.vue';

const router = useRouter();
const players = ref([]);
const gameStarted = ref(false);

onMounted(() => {
  const savedState = localStorage.getItem('yatzyGameState');
  if (savedState) {
    const state = JSON.parse(savedState);
    players.value = state.players;
    gameStarted.value = state.gameStarted;
  }
});

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

const resetScores = () => {
  if (confirm('Are you sure you want to reset all scores? This cannot be undone.')) {
    players.value = players.value.map(player => ({
      ...player,
      scores: {},
      total: 0
    }));
  }
};

const removePlayer = (player) => {
  if (confirm(`Are you sure you want to remove ${player.name}? Their scores will be lost.`)) {
    const index = players.value.findIndex(p => p.name === player.name);
    if (index !== -1) {
      players.value = players.value.filter(p => p.name !== player.name);
    }
  }
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

</script> 