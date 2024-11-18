<template>
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4">Game History</h2>
    
    <ScoreStats v-if="games.length > 0" />
    
    <div v-if="games.length === 0" class="text-gray-500">
      No completed games yet
    </div>
    <div v-else class="space-y-4">
      <div v-for="game in games" :key="game.timestamp" class="border rounded-lg p-4 bg-white shadow">
        <div class="flex justify-between items-center mb-2">
          <div class="text-sm text-gray-500">
            {{ new Date(game.timestamp).toLocaleString() }}
          </div>
          <div class="text-green-600 font-bold">
            Winner: {{ game.winner }}
          </div>
        </div>
        <table class="w-full border-collapse">
          <thead>
            <tr>
              <th class="text-left py-2">Player</th>
              <th class="text-right py-2">Total Score</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="player in game.players" :key="player.name">
              <td class="py-1">{{ player.name }}</td>
              <td class="text-right">{{ player.total }}</td>
            </tr>
          </tbody>
        </table>
        <button 
          @click="game.showDetails = !game.showDetails" 
          class="text-blue-500 text-sm mt-2 hover:underline"
        >
          {{ game.showDetails ? 'Hide Details' : 'Show Details' }}
        </button>
        <div v-if="game.showDetails" class="mt-2">
          <table class="w-full text-sm">
            <thead>
              <tr>
                <th class="text-left">Category</th>
                <th v-for="player in game.players" :key="player.name" class="text-right">
                  {{ player.name }}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="category in allCategories" :key="category">
                <td>{{ category }}</td>
                <td 
                  v-for="player in game.players" 
                  :key="player.name"
                  class="text-right"
                >
                  {{ player.scores[category] || '-' }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ScoreStats from './ScoreStats.vue';

const games = ref([]);
const allCategories = [
  'Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes',
  'One Pair', 'Two Pairs', 'Three of a Kind', 'Four of a Kind', 
  'Full House', 'Small Straight', 'Large Straight', 'Yahtzee', 'Chance'
];

onMounted(() => {
  const history = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]');
  games.value = history.map(game => ({
    ...game,
    showDetails: false
  })).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
});
</script> 