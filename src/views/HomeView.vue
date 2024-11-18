<template>
  <div class="max-w-md mx-auto p-4">
    <div class="space-y-4">
      <button
        @click="startNewGame"
        class="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg font-bold text-lg dark:bg-green-600 dark:hover:bg-green-700"
      >
        New Game
      </button>

      <button
        v-if="hasSavedGame"
        @click="continueGame"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-lg font-bold text-lg dark:bg-blue-600 dark:hover:bg-blue-700"
      >
        Continue Game
      </button>

      <button
        v-if="hasHistory"
        @click="showHistory = !showHistory"
        class="w-full bg-purple-500 hover:bg-purple-600 text-white px-4 py-3 rounded-lg font-bold text-lg dark:bg-purple-600 dark:hover:bg-purple-700"
      >
        {{ showHistory ? 'Hide History' : 'Show History' }}
      </button>

      <div v-if="showHistory && hasHistory" class="space-y-4">
        
        <h2 class="text-xl font-bold mt-6">Game History</h2>
        <ScoreHistory />
      </div>
        <h2 class="text-xl font-bold">Statistics</h2>
        <ScoreStats />

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ScoreHistory from '../components/ScoreHistory.vue';
import ScoreStats from '../components/ScoreStats.vue';

const router = useRouter();
const hasSavedGame = ref(false);
const hasHistory = ref(false);
const showHistory = ref(false);

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