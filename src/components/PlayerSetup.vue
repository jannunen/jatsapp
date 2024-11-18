    <template>
      <div class="max-w-md mx-auto p-4">
        <button
          v-if="savedGameExists"
          @click="resetGame"
          class="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
        Start a new game
        </button>
        <h2 class="text-xl mb-2">Add Players</h2>
        <input v-model="playerName" placeholder="Enter player name" class="border p-2 mb-2" />
        <button @click="addPlayer" class="bg-blue-500 text-white px-4 py-2">Add Player</button>
        <ul class="mt-2">
          <li v-for="player in playerNames" :key="player">{{ player }}</li>
        </ul>
        <button @click="startGame" class="bg-green-500 text-white px-4 py-2 mt-4" :disabled="playerNames.length === 0">Start Game</button>
      </div>
    </template>
    
    <script setup>
    import { ref, onMounted } from 'vue';
    
    const emit = defineEmits(['players-added']);
    
    const playerName = ref('');
    const playerNames = ref([]);
    const savedGameExists = ref(false);
    
    onMounted(() => {
      const savedState = localStorage.getItem('yatzyGameState');
      savedGameExists.value = !!savedState;
    });
    
    const resetGame = () => {
      localStorage.removeItem('yatzyGameState');
      window.location.reload();
    };
    
    const addPlayer = () => {
      if (playerName.value.trim()) {
        playerNames.value.push(playerName.value.trim());
        playerName.value = '';
      }
    };
    
    const startGame = () => {
      emit('players-added', playerNames.value);
    };
    </script>
