    <template>
      <div class="max-w-md mx-auto p-4">
        <button
          v-if="savedGameExists"
          @click="resetGame"
          class="mb-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
        >
        Start a new game
        </button>
        <h2 class="text-xl mb-2">Add Players</h2>
        <input 
          v-model="playerName" 
          placeholder="Enter player name" 
          class="border p-2 mb-2 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" 
        />
        <div class="flex gap-2">
          <button 
            @click="addPlayer" 
            class="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Add Player
          </button>
          <button 
            @click="cancel" 
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
        <ul class="mt-2">
          <li v-for="player in playerNames" :key="player">{{ player }}</li>
        </ul>
        <button 
          @click="startGame" 
          class="bg-green-500 hover:bg-green-600 text-white px-4 py-2 mt-4 rounded dark:bg-green-600 dark:hover:bg-green-700" 
          :disabled="playerNames.length === 0"
        >
          Start Game
        </button>
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
    
    const cancel = () => {
      router.push('/');
    };
    </script>
