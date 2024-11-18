<template>
  <div class="mt-8 mb-4">
    <h3 class="text-lg font-bold mb-2">Average Scores</h3>
    <table class="w-full border-collapse border">
      <thead>
        <tr class="bg-gray-50">
          <th class="border px-4 py-2 text-left">Category</th>
          <th class="border px-4 py-2 text-right">Average</th>
          <th class="border px-4 py-2 text-right">Games</th>
        </tr>
      </thead>
      <tbody>
        <!-- Upper section -->
        <tr class="bg-blue-50">
          <td colspan="3" class="border px-4 py-1 font-bold">Upper Section</td>
        </tr>
        <tr v-for="category in upperCategories" :key="category">
          <td class="border px-4 py-1">{{ category }}</td>
          <td class="border px-4 py-1 text-right">
            {{ formatAverage(getAverageForCategory(category)) }}
          </td>
          <td class="border px-4 py-1 text-right">
            {{ getCategoryUsageCount(category) }}
          </td>
        </tr>
        <!-- Lower section -->
        <tr class="bg-purple-50">
          <td colspan="3" class="border px-4 py-1 font-bold">Lower Section</td>
        </tr>
        <tr v-for="category in lowerCategories" :key="category">
          <td class="border px-4 py-1">{{ category }}</td>
          <td class="border px-4 py-1 text-right">
            {{ formatAverage(getAverageForCategory(category)) }}
          </td>
          <td class="border px-4 py-1 text-right">
            {{ getCategoryUsageCount(category) }}
          </td>
        </tr>
        <!-- Total -->
        <tr class="bg-yellow-50 font-bold">
          <td class="border px-4 py-1">Average Total</td>
          <td class="border px-4 py-1 text-right">
            {{ formatAverage(getAverageTotalScore()) }}
          </td>
          <td class="border px-4 py-1 text-right">
            {{ games.length }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const games = ref([]);
const upperCategories = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'];
const lowerCategories = [
  'One Pair', 'Two Pairs', 'Three of a Kind', 'Four of a Kind', 
  'Full House', 'Small Straight', 'Large Straight', 'Yahtzee', 'Chance'
];

onMounted(() => {
  const history = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]');
  games.value = history;
});

const getAverageForCategory = (category) => {
  let sum = 0;
  let count = 0;

  games.value.forEach(game => {
    game.players.forEach(player => {
      if (player.scores[category] !== undefined && 
          player.scores[category] !== '-' &&
          !isNaN(parseInt(player.scores[category]))) {
        sum += parseInt(player.scores[category]);
        count++;
      }
    });
  });

  return count > 0 ? sum / count : 0;
};

const getCategoryUsageCount = (category) => {
  let count = 0;
  games.value.forEach(game => {
    game.players.forEach(player => {
      if (player.scores[category] !== undefined && 
          player.scores[category] !== '-' &&
          !isNaN(parseInt(player.scores[category]))) {
        count++;
      }
    });
  });
  return count;
};

const getAverageTotalScore = () => {
  let sum = 0;
  let count = 0;

  games.value.forEach(game => {
    game.players.forEach(player => {
      if (player.total) {
        sum += player.total;
        count++;
      }
    });
  });

  return count > 0 ? sum / count : 0;
};

const formatAverage = (value) => {
  return value.toFixed(1);
};
</script> 