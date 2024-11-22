<template>
  <div class="max-w-md mx-auto p-4">
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold mb-4">Welcome to JatsApp! </h1>
      <p class="text-gray-600 dark:text-gray-300 mb-2">
        A modern Yatzy score tracker that works offline and saves your game history.
      </p>
      <div class="text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>✓ Save and continue games later</p>
        <p>✓ Track player statistics</p>
        <p>✓ View game history</p>
        <p>✓ Works offline</p>
        <p>✓ Share scores with friends and update them in real-time</p>
        <p>✓ No cookies, no trackers</p>
      </div>

      <!-- Game Info Section -->
      <button
              @click="showRules = !showRules"
              class="mt-4 text-blue-500 hover:text-blue-600 dark:text-blue-400 text-sm">
        {{ showRules ? 'Hide Game Info' : 'Show Game Info' }}
      </button>

      <div v-if="showRules" class="mt-4 text-left bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
        <h3 class="font-bold mb-2 text-gray-800 dark:text-gray-200">About Yatzy</h3>
        <p class="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Yatzy is a dice game where players roll five dice and try to score points in different categories.
        </p>

        <h4 class="font-bold mb-1 text-gray-800 dark:text-gray-200">Upper Section Scoring</h4>
        <ul class="text-sm text-gray-600 dark:text-gray-300 mb-3 list-disc pl-4 space-y-1">
          <li>Ones to Sixes: Sum of respective dice</li>
          <li>Bonus: 50 points if upper section ≥ 63</li>
        </ul>

        <h4 class="font-bold mb-1 text-gray-800 dark:text-gray-200">Lower Section Scoring</h4>
        <ul class="text-sm text-gray-600 dark:text-gray-300 list-disc pl-4 space-y-1">
          <li>One Pair: Two dice showing same face</li>
          <li>Two Pairs: Two different pairs</li>
          <li>Three of a Kind: Three dice showing same face</li>
          <li>Four of a Kind: Four dice showing same face</li>
          <li>Full House: Three of a kind + pair (25 points)</li>
          <li>Small Straight: 1-2-3-4-5 (15 points)</li>
          <li>Large Straight: 2-3-4-5-6 (20 points)</li>
          <li>Yahtzee: All five dice showing same face (50 points)</li>
          <li>Chance: Sum of all dice</li>
        </ul>
      </div>
    </div>

    <div class="space-y-4">
      <TopScores v-if="hasHistory" />

      <button
              @click="startNewGame"
              class="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-bold text-lg dark:bg-green-600 dark:hover:bg-green-700">
        New Game
      </button>

      <button
              v-if="hasSavedGame"
              @click="continueGame"
              class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-lg dark:bg-blue-600 dark:hover:bg-blue-700">
        Continue Game
      </button>

      <button
              v-if="hasHistory"
              @click="showHistory = !showHistory"
              class="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-bold text-lg dark:bg-purple-600 dark:hover:bg-purple-700">
        {{ showHistory ? 'Hide History' : 'Show History' }}
      </button>

      <div v-if="showHistory && hasHistory" class="space-y-4">
        <h2 class="text-xl font-bold">Statistics</h2>
        <ScoreStats />

        <h2 class="text-xl font-bold mt-6">Game History</h2>
        <ScoreHistory />
      </div>
    </div>
    <!-- Footer -->
    <footer class="mt-8 py-4 border-t border-gray-200 dark:border-gray-700">
      <div class="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
        <p class="mb-2">
          From a slave of Yatzy to slaves of Yatzy
          <br />
          We don't use cookies, we don't use trackers. See our
          <button
                  @click="showPrivacy = true"
                  class="text-blue-500 hover:text-blue-600 dark:text-blue-400 ml-2 underline">
            privacy Policy
          </button>
          for more info.
        </p>
        <p class="text-xs italic">
          "In Yatzy, as in life, it's not about the rolls you get, but how you use them."
          <br>
          - Ancient Dice Wisdom (probably)
        </p>
      </div>
    </footer>



  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import ScoreHistory from '../components/ScoreHistory.vue';
import ScoreStats from '../components/ScoreStats.vue';
import TopScores from '../components/TopScores.vue';

const router = useRouter();
const hasSavedGame = ref(false);
const hasHistory = ref(false);
const showHistory = ref(false);
const showRules = ref(false);

onMounted(() => {
  const savedState = localStorage.getItem('yatzyGameState');
  hasSavedGame.value = !!savedState;

  const history = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]');
  hasHistory.value = history.length > 0;
});

const startNewGame = () => {
  if (hasSavedGame.value) {
    if (confirm('Do you want to start a new game? Current game progress will be lost.')) {
      localStorage.removeItem('yatzyGameState');
      router.push('/game');
    }
  } else {
    router.push('/game');
  }
};

const continueGame = () => {
  router.push('/game');
};
</script> 