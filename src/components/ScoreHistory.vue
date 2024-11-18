<template>
  <div class="mt-8">
    <div class="flex justify-between items-center mb-4">
      <h2 class="text-xl font-bold">Game History</h2>
      <button 
        v-if="games.length > 0"
        @click="clearHistory" 
        class="bg-red-500 hover:bg-red-600 text-white text-sm px-3 py-1 rounded dark:bg-red-600 dark:hover:bg-red-700"
      >
        Clear History
      </button>
    </div>
    
    <div v-if="games.length === 0" class="text-gray-500 dark:text-gray-400">
      No completed games yet
    </div>
    <div v-else class="space-y-4">
      <div v-for="(game, index) in games" :key="game.timestamp" 
           class="border rounded-lg p-4 bg-white dark:bg-gray-800 shadow dark:border-gray-700">
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {{ new Date(game.timestamp).toLocaleString() }}
          </div>
          <div class="flex items-center gap-2">
            <div class="text-green-600 dark:text-green-400 font-bold">
              Winner: {{ game.winner }}
            </div>
            <button 
              @click="deleteGame(index)"
              class="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-500"
              title="Delete game"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        <table class="w-full border-collapse">
          <thead>
            <tr class="border-b dark:border-gray-700">
              <th class="text-left py-2 dark:text-gray-200">Player</th>
              <th class="text-right py-2 dark:text-gray-200">Total Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in game.players" :key="player.name" 
                class="border-b dark:border-gray-700">
              <td class="py-1">{{ player.name }}</td>
              <td class="text-right">{{ player.total }}</td>
            </tr>
          </tbody>
        </table>
        <div class="flex justify-between items-center mt-2">
          <button 
            @click="game.showDetails = !game.showDetails" 
            class="text-blue-500 dark:text-blue-400 text-sm hover:underline"
          >
            {{ game.showDetails ? 'Hide Details' : 'Show Details' }}
          </button>
          <button 
            @click="startGameWithPlayers(game.players)"
            class="bg-green-500 hover:bg-green-600 text-white text-sm px-3 py-1 rounded dark:bg-green-600 dark:hover:bg-green-700"
          >
            Use these players
          </button>
        </div>
        <div v-if="game.showDetails" class="mt-2">
          <table class="w-full text-sm">
            <thead>
              <tr class="border-b dark:border-gray-700">
                <th class="text-left py-1 dark:text-gray-200">Category</th>
                <th v-for="player in game.players" :key="player.name" 
                    class="text-right py-1 dark:text-gray-200">
                  {{ player.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in allCategories" :key="category" 
                  class="border-b dark:border-gray-700">
                <td class="py-1">{{ category }}</td>
                <td 
                  v-for="player in game.players" 
                  :key="player.name"
                  class="text-right py-1"
                >
                  {{ player.scores[category] || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <Toast :show="showToast" :message="toastMessage" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ScoreStats from './ScoreStats.vue';
import Toast from './Toast.vue';

const router = useRouter();
const games = ref([]);
const allCategories = [
  'Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes',
  'One Pair', 'Two Pairs', 'Three of a Kind', 'Four of a Kind', 
  'Full House', 'Small Straight', 'Large Straight', 'Yahtzee', 'Chance'
];
const showToast = ref(false);
const toastMessage = ref('');

const loadGames = () => {
  const history = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]');
  games.value = history.map(game => ({
    ...game,
    showDetails: false
  })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

onMounted(loadGames);

const showNotification = (message) => {
  toastMessage.value = message;
  showToast.value = true;
  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};

const deleteGame = (index) => {
  if (confirm('Are you sure you want to delete this game?')) {
    const history = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]');
    const deletedGame = history[index];
    history.splice(index, 1);
    localStorage.setItem('yatzyGameHistory', JSON.stringify(history));
    loadGames();
    showNotification(`Game from ${new Date(deletedGame.timestamp).toLocaleDateString()} deleted`);
  }
};

const clearHistory = () => {
  if (confirm('Are you sure you want to delete all game history? This cannot be undone.')) {
    localStorage.removeItem('yatzyGameHistory');
    games.value = [];
    showNotification('All game history cleared');
  }
};

const startGameWithPlayers = (players) => {
  if (localStorage.getItem('yatzyGameState')) {
    if (!confirm('There is a game in progress. Do you want to start a new game with these players?')) {
      return;
    }
    localStorage.removeItem('yatzyGameState');
  }
  
  // Initialize new game with the selected players
  const newGame = {
    players: players.map(p => ({ name: p.name, scores: {}, total: 0 })),
    gameStarted: true
  };
  
  localStorage.setItem('yatzyGameState', JSON.stringify(newGame));
  router.push('/game');
};
</script> 