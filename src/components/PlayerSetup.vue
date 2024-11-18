    <template>
      <div class="max-w-md mx-auto p-4">
        <button
          v-if="savedGameExists"
          @click="resetGame"
          class="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
        >
        Start a new game
        </button>

        <div v-if="previousPlayers.length > 0 && playerNames.length === 0" class="mb-4">
          <button
            @click="usePreviousPlayers"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded dark:bg-blue-600 dark:hover:bg-blue-700 mb-2"
          >
            Use previous players: {{ previousPlayers.join(', ') }}
          </button>
        </div>

        <h2 class="text-xl mb-2">Add Players</h2>
        <div class="flex gap-2 mb-2">
          <input 
            v-model="playerName" 
            placeholder="Enter player name" 
            class="flex-1 border p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" 
            @keyup.enter="addPlayer"
          />
          <button 
            @click="addPlayer" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Add
          </button>
        </div>

        <ul class="mt-2 space-y-2">
          <li 
            v-for="(player, index) in playerNames" 
            :key="player"
            class="flex justify-between items-center bg-gray-100 dark:bg-gray-800 p-2 rounded"
          >
            <span>{{ player }}</span>
            <button 
              @click="removePlayer(index)"
              class="text-red-500 hover:text-red-600 dark:text-red-400"
            >
              ×
            </button>
          </li>
        </ul>

        <div class="flex gap-2 mt-4">
          <button 
            @click="startGame" 
            class="flex-1 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded dark:bg-green-600 dark:hover:bg-green-700" 
            :disabled="playerNames.length === 0"
          >
            Start Game
          </button>
          <button 
            @click="cancel" 
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </div>
    </template>
    
    <script setup>
    import { ref, onMounted } from 'vue';
    import { useRouter } from 'vue-router';
    
    const router = useRouter();
    const emit = defineEmits(['players-added']);
    
    const playerName = ref('');
    const playerNames = ref([]);
    const savedGameExists = ref(false);
    const previousPlayers = ref([]);
    
    onMounted(() => {
      const savedState = localStorage.getItem('yatzyGameState');
      savedGameExists.value = !!savedState;
    
      const lastGame = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
      
      if (lastGame) {
        previousPlayers.value = lastGame.players.map(p => p.name);
      }
    });
    
    const resetGame = () => {
      localStorage.removeItem('yatzyGameState');
      window.location.reload();
    };
    
    const usePreviousPlayers = () => {
      playerNames.value = [...previousPlayers.value];
    };
    
    const addPlayer = () => {
      if (playerName.value.trim()) {
        playerNames.value.push(playerName.value.trim());
        playerName.value = '';
      }
    };
    
    const removePlayer = (index) => {
      playerNames.value.splice(index, 1);
    };
    
    const startGame = () => {
      emit('players-added', playerNames.value);
    };
    
    const cancel = () => {
      router.push('/');
    };
    </script>
