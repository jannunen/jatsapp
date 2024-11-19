    <template>
      <div class="max-w-md mx-auto p-4">
        <button
          v-if="savedGameExists"
          @click="resetGame"
          class="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
        >
        Start a new game
        </button>

        <div v-if="historicPlayers.length > 0 && playerNames.length === 0" class="mb-4 space-y-2">
          <button
            v-if="previousPlayers.length > 0"
            @click="usePreviousPlayers"
            class="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Use last game players: {{ previousPlayers.join(', ') }}
          </button>

          <div class="relative">
            <select 
              v-model="selectedHistoricGame"
              class="w-full bg-gray-100 border border-gray-300 px-4 py-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
            >
              <option value="">Select from historic games...</option>
              <option 
                v-for="(game, index) in historicGames" 
                :key="index" 
                :value="index"
              >
                {{ formatGameOption(game) }}
              </option>
            </select>
            <button 
              v-if="selectedHistoricGame !== ''"
              @click="useHistoricPlayers"
              class="mt-2 w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
            >
              Use selected players
            </button>
          </div>
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
    import { ref, onMounted, computed } from 'vue';
    import { useRouter } from 'vue-router';
    
    const router = useRouter();
    const emit = defineEmits(['players-added']);
    
    const playerName = ref('');
    const playerNames = ref([]);
    const savedGameExists = ref(false);
    const previousPlayers = ref([]);
    const historicGames = ref([]);
    const selectedHistoricGame = ref('');
    
    const historicPlayers = computed(() => {
      const allPlayers = new Set();
      historicGames.value.forEach(game => {
        game.players.forEach(player => {
          allPlayers.add(player.name);
        });
      });
      return Array.from(allPlayers);
    });
    
    onMounted(() => {
      const savedState = localStorage.getItem('yatzyGameState');
      savedGameExists.value = !!savedState;
    
      historicGames.value = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]')
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
      if (historicGames.value.length > 0) {
        previousPlayers.value = historicGames.value[0].players.map(p => p.name);
      }
    });
    
    const formatGameOption = (game) => {
      const date = new Date(game.timestamp).toLocaleDateString();
      const players = game.players.map(p => p.name).join(', ');
      return `${date}: ${players}`;
    };
    
    const resetGame = () => {
      localStorage.removeItem('yatzyGameState');
      window.location.reload();
    };
    
    const usePreviousPlayers = () => {
      playerNames.value = [...previousPlayers.value];
    };
    
    const useHistoricPlayers = () => {
      const selectedGame = historicGames.value[selectedHistoricGame.value];
      if (selectedGame) {
        playerNames.value = selectedGame.players.map(p => p.name);
      }
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
