 <template>
  <div>
    <div class="flex justify-between items-center mb-2">
      <h2 class="text-base">Score Table</h2>
      <div class="flex gap-2">
        <button 
          @click="showAddPlayer = true"
          class="bg-green-500 hover:bg-green-600 text-white text-xs px-2 py-1 rounded dark:bg-green-600 dark:hover:bg-green-700"
        >
          Add Player
        </button>
        <button 
          @click="$emit('reset-scores')"
          class="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          Reset Scores
        </button>
      </div>
    </div>
    <div class="rounded-lg overflow-x-auto">
      <div class="max-h-[80vh] overflow-y-auto">
        <table class="w-full text-sm relative">
          <thead class="sticky top-0 z-20">
            <tr class="dark:bg-gray-800 bg-white">
              <th class="w-4/12 md:w-2/12 px-2 py-1 text-left bg-inherit">Category</th>
              <th v-for="player in playersWithWins" :key="player.name" class="w-1/12 px-2 py-1 transition-colors duration-300" :class="getPlayerPositionClass(player)">
                <div class="flex flex-col items-center">
                  <div class="flex items-center gap-1">
                    <span>{{ player.name }}</span>
                    <button 
                      @click.stop="removePlayer(player)"
                      class="text-red-500 hover:text-red-600 dark:text-red-400 hover:scale-125 transition-transform"
                      title="Remove player"
                    >
                      ×
                    </button>
                  </div>
                  <span v-if="player.wins > 0" class="text-xs">
                    {{ player.wins }} {{ player.wins === 1 ? 'win' : 'wins' }}
                  </span>
                </div>
              </th>
              <th class="w-4/12 md:w-2/12 px-2 py-1 text-left bg-inherit">Category</th>
            </tr>
          </thead>
          <tbody>
            <!-- Upper section -->
            <tr v-for="category in upperCategories" :key="category">
              <td class="px-2 py-1 bg-white dark:bg-gray-900">
                <div class="flex justify-between items-center text-sm">
                  <span>{{ category }}</span>
                  <span class="text-xs text-gray-500">({{ formatAverage(getAverageForCategory(category)) }})</span>
                </div>
              </td>
              <!-- Player scores -->
              <td v-for="player in props.players" :key="player.name" class="px-1 text-center">
                
                <div
                     @click="selectCell(player, category)"
                     class="min-w-[1.5rem] min-h-[1.5rem] rounded  border border-gray-300
                            dark:border-gray-500
                            flex items-center justify-center cursor-pointer 
                            hover:bg-gray-50 dark:hover:bg-gray-800 text-lg">
                  {{ player.scores[category] !== undefined ? player.scores[category] : '-' }}
                </div>
              </td>
              <!-- Right side category -->
              <td class="px-2 py-1 bg-white dark:bg-gray-900">
                <div class="flex justify-between items-center text-sm">
                  <span>{{ category }}</span>
                  <span class="text-xs text-gray-500">({{ formatAverage(getAverageForCategory(category)) }})</span>
                </div>
              </td>
            </tr>
            <!-- Upper section sum -->
            <tr class="bg-blue-50 dark:bg-blue-900">
              <td class="px-2 py-0.5 font-bold bg-inherit">Sum</td>
              <td v-for="player in props.players" :key="player.name" class="px-1 text-center text-lg">
                {{ calculateUpperSectionSum(player) }}
              </td>
              <td class="px-2 py-0.5 font-bold bg-inherit">Sum</td>
            </tr>
            <!-- Upper section progress -->
            <tr class="bg-blue-50 dark:bg-blue-900">
              <td class="px-2 font-bold bg-inherit">(+/-)</td>
              <td
                  v-for="player in props.players"
                  :key="player.name"
                  class=" px-1 text-center text-md"
                  :class="{
                   'text-red-600': calculateProgress(player) < 0,
                   'text-green-600': calculateProgress(player) > 0
                 }">
                {{ formatProgress(calculateProgress(player)) }}
              </td>
              <td class="px-2 font-bold bg-inherit">(+/-)</td>
            </tr>
            <!-- Bonus -->
            <tr class="bg-green-100 dark:bg-green-900">
              <td class="px-2 font-bold bg-inherit">Bonus </td>
              <td v-for="player in props.players" :key="player.name" class=" px-1 text-center text-md">
                {{ calculateUpperSectionSum(player) >= 63 ? 50 : 0 }}
              </td>
              <td class="px-2 font-bold bg-inherit">Bonus </td>
            </tr>

            <!-- Lower section -->
            <tr v-for="category in lowerCategories" :key="category">
              <td class="px-2 bg-white dark:bg-gray-900">
                <div class="flex justify-between items-center text-sm">
                  <span>{{ category }}</span>
                  <span class="text-xs text-gray-500">({{ formatAverage(getAverageForCategory(category)) }})</span>
                </div>
              </td>
              <!-- Player scores -->
              <td v-for="player in props.players" :key="player.name" class="px-1 text-center">
                
                <div
                     @click="selectCell(player, category)"
                     class="min-w-[1.5rem] min-h-[1.5rem] rounded  border border-gray-300
                            dark:border-gray-500
                            flex items-center justify-center cursor-pointer 
                            hover:bg-gray-50 dark:hover:bg-gray-800 text-lg">
                  {{ player.scores[category] !== undefined ? player.scores[category] : '-' }}
                </div>
              </td>
              <!-- Right side category -->
              <td class="px-2 bg-white dark:bg-gray-900">
                <div class="flex justify-between items-center text-sm">
                  <span>{{ category }}</span>
                  <span class="text-xs text-gray-500">({{ formatAverage(getAverageForCategory(category)) }})</span>
                </div>
              </td>
            </tr>
          </tbody>
          <tfoot class="sticky bottom-0 z-20">
            <!-- Theoretical max -->
            <tr class="bg-gray-100 dark:bg-gray-800">
              <td class="px-2 py-1 font-bold bg-inherit">Theoretical</td>
              <td v-for="player in props.players" :key="player.name" class="px-1 text-center text-md">
                {{ calculateMaxPossible(player) }}
              </td>
              <td class="px-2 py-1 font-bold bg-inherit">Theoretical</td>
            </tr>
            <!-- Total score -->
            <tr class="bg-yellow-100 font-bold text-sm dark:bg-yellow-900">
              <td class="px-2 py-1 bg-inherit">Total Score</td>
              <td v-for="player in props.players" :key="player.name" class="px-1 py-1 text-center text-md transition-colors duration-300" :class="getPlayerPositionClass(player)">
                {{ calculateTotalScore(player) }}
              </td>
              <td class="px-2 py-1 bg-inherit">Total Score</td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>

    <!-- Point Entry Modal -->
    <Modal 
      :show="!!editingPlayer" 
      :title="`Enter points for ${editingCategory}`"
    >
      <div class="flex flex-col gap-4">
        <div class="text-sm dark:text-gray-300">
          Player: {{ editingPlayer?.name }}
        </div>
        <input
          v-model.number="scoreInput"
          type="text"
          inputmode="numeric"
          class="w-full border border-gray-300 px-3 py-2 rounded text-lg 
                 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          ref="scoreInputRef"
          id="modalScoreInput"
          @keyup.enter="submitScore(editingPlayer, editingCategory)"
          autofocus
        />
      </div>
      
      <template #actions>
        <button 
          @click="skipScore(editingPlayer, editingCategory)"
          class="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          Skip
        </button>
        <button 
          @click="clearScore(editingPlayer, editingCategory)"
          class="px-4 py-2 text-sm bg-orange-500 text-white rounded hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-700"
        >
          Clear
        </button>
        <button 
          @click="cancelEdit"
          class="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button 
          @click="submitScore(editingPlayer, editingCategory)"
          class="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Save
        </button>
      </template>
    </Modal>

    <!-- Add Player Modal -->
    <Modal 
      :show="showAddPlayer" 
      title="Add New Player"
    >
      <div class="flex flex-col gap-4">
        <input
          v-model="newPlayerName"
          type="text"
          class="w-full border border-gray-300 px-3 py-2 rounded text-lg 
                 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
          placeholder="Enter player name"
          @keyup.enter="addPlayer"
        />
      </div>
      
      <template #actions>
        <button 
          @click="cancelAddPlayer"
          class="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button 
          @click="addPlayer"
          class="px-4 py-2 text-sm bg-green-500 text-white rounded hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
        >
          Add
        </button>
      </template>
    </Modal>

    <!-- Remove Player Modal -->
    <Modal 
      :show="playerToRemove !== null" 
      title="Remove Player"
    >
      <div class="text-center">
        Are you sure you want to remove {{ playerToRemove?.name }}?
        <br>
        All scores will be lost.
      </div>
      
      <template #actions>
        <button 
          @click="cancelRemovePlayer"
          class="px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
        >
          Cancel
        </button>
        <button 
          @click="confirmRemovePlayer"
          class="px-4 py-2 text-sm bg-red-500 text-white rounded hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
        >
          Remove
        </button>
      </template>
    </Modal>
  </div>
</template>

 <script>
 import { ref, nextTick, computed } from 'vue';
 import { useScoreStats } from '../composables/useScoreStats';
 import Modal from './Modal.vue';

 export default {
   components: {
     Modal
   },
   props: {
     players: Array,
   },
   emits: ['reset-scores', 'remove-player'],
   setup(props, { emit }) {
     const upperCategories = ['Ones', 'Twos', 'Threes', 'Fours', 'Fives', 'Sixes'];
     const lowerCategories = [
       'One Pair', 'Two Pairs', 'Three of a Kind', 'Four of a Kind', 
       'Full House', 'Small Straight', 'Large Straight', 'Yahtzee', 'Chance'
     ];

     const editingPlayer = ref(null);
     const editingCategory = ref('');
     const scoreInput = ref(0);
     const scoreInputRef = ref(null);

     const calculateUpperSectionSum = (player) => {
       return upperCategories.reduce((sum, category) => {
         return sum + (player.scores[category] || 0);
       }, 0);
     };

     const calculateTotalScore = (player) => {
       const upperSum = calculateUpperSectionSum(player);
       const bonus = upperSum >= 63 ? 50 : 0;
       const lowerSum = lowerCategories.reduce((sum, category) => {
         return sum + (player.scores[category] || 0);
       }, 0);
       return upperSum + bonus + lowerSum;
     };

     const isEditing = (player, category) => {
       return editingPlayer.value === player && editingCategory.value === category;
     };

     const cancelEdit = () => {
       editingPlayer.value = null;
       editingCategory.value = '';
       scoreInput.value = 0;
     };

     const selectCell = async (player, category) => {
       if (player.scores[category] !== undefined) {
         scoreInput.value = player.scores[category];
       } else {
         scoreInput.value = getDefaultScore(category);
       }
       
       editingPlayer.value = player;
       editingCategory.value = category;
       
       nextTick().then(() => {
         document.getElementById('modalScoreInput').focus()
         document.getElementById('modalScoreInput').select()
         // Change text color to blue
         document.getElementById('modalScoreInput').style.color = 'blue'
         document.getElementById('modalScoreInput').click()
       })
     };

     const getDefaultScore = (category) => {
       
       switch (category) {
         case 'Small Straight':
           return  15;
         case 'Large Straight':
           return  20;
         case 'Yahtzee':
           return 50;
         default:
           return scoreInput.value;
       }
     };

     const validateUpperSectionScore = (category, score) => {
       if (score === 0) return true;
       
       const categoryValues = {
         'Ones': 1,
         'Twos': 2,
         'Threes': 3,
         'Fours': 4,
         'Fives': 5,
         'Sixes': 6
       };

       const value = categoryValues[category];
       if (!value) return true; // Not an upper section category

       // Check if score is divisible by the category value
       if (score % value !== 0) {
         return false;
       }

       // Check if score is not higher than possible (5 dice)
       const maxPossible = value * 5;
       if (score > maxPossible) {
         return false;
       }

       return true;
     };

     const clearScore = (player, category) => {
       delete(player.scores[category]);
       cancelEdit();
     };

     const skipScore = (player, category) => {  
      scoreInput.value = '0';
      submitScore(player, category);
     };

     const submitScore = (player, category) => {
       if (scoreInput.value == '-') {
         delete(player.scores[category]);
         cancelEdit();
         return;
       }

       if (scoreInput.value >= 0) {
         // Validate upper section scores
         if (!validateUpperSectionScore(category, scoreInput.value)) {
           if (!confirm(`Warning: ${scoreInput.value} seems invalid for ${category}. Are you sure?`)) {
             return;
           }
         }
         
         player.scores[category] = scoreInput.value;
         cancelEdit();
       }
     };

     const calculateProgress = (player) => {
       let totalExpected = 0;
       
       // For each category in upper section
       upperCategories.forEach((category, index) => {
         const number = index + 1; // 1 for Ones, 2 for Twos, etc.
         
         const score = player.scores[category]
         if (score !== undefined &&
            score !== '-' &&
            !isNaN(parseInt(score))) {
           // If category is filled, use actual score
           totalExpected += parseInt(score);
         } else {
           // If empty, expect 3 dice of that number
           totalExpected += number * 3;
         }
       });
       
       // Compare with target 63
       return totalExpected - 63;
     };

     const formatProgress = (progress) => {
       if (progress > 0) return `+${progress}`;
       return progress.toString();
     };

     const getMaxForCategory = (category) => {
       switch (category) {
         case 'Ones': return 5;
         case 'Twos': return 10;
         case 'Threes': return 15;
         case 'Fours': return 20;
         case 'Fives': return 25;
         case 'Sixes': return 30;
         case 'One Pair': return 12;
         case 'Two Pairs': return 22;
         case 'Three of a Kind': return 30;
         case 'Four of a Kind': return 30;
         case 'Full House': return 28;
         case 'Small Straight': return 15;
         case 'Large Straight': return 20;
         case 'Yahtzee': return 50;
         case 'Chance': return 30;
         default: return 0;
       }
     };

     const calculateMaxPossible = (player) => {
       let total = 0;
       
       // Add current scores
       [...upperCategories, ...lowerCategories].forEach(category => {
        const score = player.scores[category];
        if (score !== undefined &&
            score !== '-' &&
            !isNaN(parseInt(score))) {
           total += parseInt(score);
         } else {
           // Add maximum possible for unfilled categories
           total += getMaxForCategory(category);
         }
       });

       // Add bonus if upper section could reach 63
       const currentUpperSum = calculateUpperSectionSum(player);
       const remainingUpperMax = upperCategories
         .filter(category => player.scores[category] === undefined)
         .reduce((sum, category) => sum + getMaxForCategory(category), 0);

       if (currentUpperSum + remainingUpperMax >= 63) {
         total += 50; // Add bonus
       }

       return total;
     };

     const { getAverageForCategory, formatAverage } = useScoreStats();

     const getPlayerWins = (playerName) => {
       const history = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]');
       return history.filter(game => game.winner === playerName).length;
     };

     const playersWithWins = computed(() => {
       return props.players.map(player => ({
         ...player,
         wins: getPlayerWins(player.name)
       }));
     });

     const getPlayerPositionClass = (player) => {
       const scores = props.players.map(p => ({
         name: p.name,
         total: calculateTotalScore(p)
       }));
       
       // Sort by score in descending order
       scores.sort((a, b) => b.total - a.total);
       
       // Find position of current player
       const position = scores.findIndex(p => p.name === player.name);
       
       if (scores.length <= 1) return '';
       
       // Return color class based on position
       if (position === 0) {
         return 'bg-green-100 dark:bg-green-900'; // Leader
       } else if (position === scores.length - 1) {
         return 'bg-red-100 dark:bg-red-900'; // Last place
       } else {
         // Calculate gradient for middle positions
         const total = scores.length - 1;
         const percentage = position / total;
         if (percentage <= 0.5) {
           return 'bg-lime-50 dark:bg-lime-900/50'; // Closer to first
         } else {
           return 'bg-orange-50 dark:bg-orange-900/50'; // Closer to last
         }
       }
     };

     const showAddPlayer = ref(false);
     const newPlayerName = ref('');
     const playerToRemove = ref(null);

     const addPlayer = () => {
       if (newPlayerName.value.trim()) {
         props.players.push({
           name: newPlayerName.value.trim(),
           scores: {},
           total: 0
         });
         showAddPlayer.value = false;
         newPlayerName.value = '';
       }
     };

     const cancelAddPlayer = () => {
       showAddPlayer.value = false;
       newPlayerName.value = '';
     };

     const removePlayer = (player) => {
       emit('remove-player', player);
     };

     const confirmRemovePlayer = () => {
       playerToRemove.value = null;
     };

     const cancelRemovePlayer = () => {
       playerToRemove.value = null;
     };

     // Add player name column header with remove button
     const renderPlayerHeader = (player) => {
       return {
         name: player.name,
         wins: getPlayerWins(player.name),
         removeAction: () => removePlayer(player)
       };
     };

     return { 
       upperCategories,
       lowerCategories,
       editingPlayer, 
       editingCategory, 
       scoreInput,
       scoreInputRef,
       isEditing, 
       selectCell, 
       submitScore,
       skipScore,
       clearScore,
       calculateUpperSectionSum,
       calculateTotalScore,
       calculateProgress,
       formatProgress,
       cancelEdit,
       calculateMaxPossible,
       getAverageForCategory,
       formatAverage,
       playersWithWins,
       props,
       getPlayerPositionClass,
       showAddPlayer,
       newPlayerName,
       playerToRemove,
       addPlayer,
       cancelAddPlayer,
       removePlayer,
       confirmRemovePlayer,
       cancelRemovePlayer,
       renderPlayerHeader
     };
   },
 };
 </script>
