 <template>
   <div>
     <div class="flex justify-between items-center mb-1">
       <h2 class="text-base">Score Table</h2>
       <button 
         @click="$emit('reset-scores')"
         class="bg-orange-500 hover:bg-orange-600 text-white text-xs px-2 py-1 rounded dark:bg-orange-600 dark:hover:bg-orange-700"
       >
         Reset Scores
       </button>
     </div>
     <table class="table-auto w-full mb-2 border-collapse border border-gray-300 dark:border-gray-600 text-sm">
       <thead>
         <tr class="dark:bg-gray-800">
           <th class="w-1/4 border px-2 py-1 dark:border-gray-600">Category</th>
           <th v-for="player in players" :key="player.name" class="w-1/12 border px-2 py-1 dark:border-gray-600">
             {{ player.name }}
           </th>
         </tr>
       </thead>
       <tbody>
         <!-- Upper section header -->
         <tr class="bg-blue-100 dark:bg-blue-900">
           <td colspan="100%" class="border px-2 py-0.5 font-bold text-blue-800 dark:text-blue-200">
             Upper Section
           </td>
         </tr>
         <!-- Upper section -->
         <tr v-for="category in upperCategories" :key="category">
           <td class="border px-2 py-0.5">
             <div class="flex justify-between items-center text-sm">
               <span>{{ category }}</span>
               <span class="text-xs text-gray-500">({{ formatAverage(getAverageForCategory(category)) }})</span>
             </div>
           </td>
           <td v-for="player in players" :key="player.name" class="border px-1 py-0.5">
             <div v-if="isEditing(player, category)" class="relative">
               <div class="flex flex-col gap-0.5">
                 <input
                   v-model.number="scoreInput"
                   type="number"
                   class="w-12 border border-gray-300 px-1 py-0.5 rounded text-sm"
                   ref="scoreInputRef"
                   @focus="$event.target.select()"
                 />
                 <div class="flex gap-0.5">
                   <button 
                     @click="submitScore(player, category)"
                     class="bg-green-500 hover:bg-green-600 text-white text-xs px-1 py-0.5 rounded"
                   >
                     OK
                   </button>
                   <button 
                     @click="cancelEdit"
                     class="bg-red-500 hover:bg-red-600 text-white text-xs px-1 py-0.5 rounded"
                   >
                     X
                   </button>
                 </div>
               </div>
             </div>
             <div 
               v-else 
               @click="selectCell(player, category)" 
               class="min-w-[1.5rem] min-h-[1.5rem] border border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50"
             >
               {{ player.scores[category] !== undefined ? player.scores[category] : '-' }}
             </div>
           </td>
         </tr>
         <!-- Upper section sum -->
         <tr class="bg-blue-50 dark:bg-blue-900">
           <td class="border px-2 py-0.5 font-bold">Upper Section Sum</td>
           <td v-for="player in players" :key="player.name" class="border px-1 py-0.5 text-center">
             {{ calculateUpperSectionSum(player) }}
           </td>
         </tr>
         <!-- Upper section progress -->
         <tr class="bg-blue-50 dark:bg-blue-900">
           <td class="border px-2 py-0.5 font-bold">Progress (+/-)</td>
           <td 
             v-for="player in players" 
             :key="player.name" 
             class="border px-1 py-0.5 text-center"
             :class="{
               'text-red-600': calculateProgress(player) < 0,
               'text-green-600': calculateProgress(player) > 0
             }"
           >
             {{ formatProgress(calculateProgress(player)) }}
           </td>
         </tr>
         <!-- Bonus -->
         <tr class="bg-green-100 dark:bg-green-900">
           <td class="border px-2 py-0.5 font-bold">Bonus (if ≥63)</td>
           <td v-for="player in players" :key="player.name" class="border px-1 py-0.5 text-center">
             {{ calculateUpperSectionSum(player) >= 63 ? 50 : 0 }}
           </td>
         </tr>
         <!-- Lower section header -->
         <tr class="bg-purple-100 dark:bg-purple-900">
           <td colspan="100%" class="border px-2 py-0.5 font-bold text-purple-800 dark:text-purple-200 text-sm">
             Lower Section
           </td>
         </tr>
         <!-- Lower section -->
         <tr v-for="category in lowerCategories" :key="category">
           <td class="border px-2 py-0.5">
             <div class="flex justify-between items-center text-sm">
               <span>{{ category }}</span>
               <span class="text-xs text-gray-500">({{ formatAverage(getAverageForCategory(category)) }})</span>
             </div>
           </td>
           <td v-for="player in players" :key="player.name" class="border px-1 py-0.5">
             <div v-if="isEditing(player, category)" class="relative">
               <div class="flex flex-col gap-0.5">
                 <input
                   v-model.number="scoreInput"
                   type="number"
                   class="w-12 border border-gray-300 px-1 py-0.5 rounded text-sm"
                   ref="scoreInputRef"
                   @focus="$event.target.select()"
                 />
                 <div class="flex gap-0.5">
                   <button 
                     @click="submitScore(player, category)"
                     class="bg-green-500 hover:bg-green-600 text-white text-xs px-1 py-0.5 rounded"
                   >
                     OK
                   </button>
                   <button 
                     @click="cancelEdit"
                     class="bg-red-500 hover:bg-red-600 text-white text-xs px-1 py-0.5 rounded"
                   >
                     X
                   </button>
                 </div>
               </div>
             </div>
             <div 
               v-else 
               @click="selectCell(player, category)" 
               class="min-w-[1.5rem] min-h-[1.5rem] border border-gray-300 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50"
             >
               {{ player.scores[category] !== undefined ? player.scores[category] : '-' }}
             </div>
           </td>
         </tr>
         <!-- Add this row just before the final Total Score row -->
         <tr class="bg-gray-100 dark:bg-gray-900">
           <td class="border px-2 py-0.5 font-bold">Max Possible</td>
           <td v-for="player in players" :key="player.name" class="border px-1 py-0.5 text-center">
             {{ calculateMaxPossible(player) }}
           </td>
         </tr>
         <!-- Total score -->
         <tr class="bg-yellow-100 font-bold text-sm dark:bg-yellow-900">
           <td class="border px-2 py-0.5">Total Score</td>
           <td v-for="player in players" :key="player.name" class="border px-1 py-0.5 text-center">
             {{ calculateTotalScore(player) }}
           </td>
         </tr>
       </tbody>
     </table>
   </div>
 </template>

 <script>
 import { ref, nextTick } from 'vue';
 import { useScoreStats } from '../composables/useScoreStats';

 export default {
   props: {
     players: Array,
   },
   emits: ['reset-scores'],
   setup() {
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
         scoreInput.value = 0;
       }
       
       editingPlayer.value = player;
       editingCategory.value = category;
       
       // Wait for the input to be rendered
       nextTick();
       if (scoreInputRef.value) {
         scoreInputRef.value.focus();
         scoreInputRef.value.select();
       }
     };

     const getDefaultScore = (category) => {
       switch (category) {
         case 'Small Straight':
           return 15;
         case 'Large Straight':
           return 20;
         default:
           return scoreInput.value;
       }
     };

     const submitScore = (player, category) => {
       if (scoreInput.value == '-') {
         delete(player.scores[category]);
         cancelEdit();
         return;
       }

       const score = getDefaultScore(category);
       if (score >= 0) {
         player.scores[category] = score;
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
       calculateUpperSectionSum,
       calculateTotalScore,
       calculateProgress,
       formatProgress,
       cancelEdit,
       calculateMaxPossible,
       getAverageForCategory,
       formatAverage,
     };
   },
 };
 </script>
