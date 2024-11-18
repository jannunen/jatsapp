 <template>
   <div>
     <div class="rounded-lg overflow-x-auto relative">
       <table class="w-full text-sm">
         <thead class="sticky top-0 z-10">
           <tr class="dark:bg-gray-800 bg-white">
             <th class="w-1/8 px-2 py-1 text-left">Category</th>
             <th v-for="player in players" :key="player.name" class="w-1/12 px-2 py-1">
               {{ player.name }}
             </th>
           </tr>
         </thead>
         <tbody>
           
           <!-- Upper section -->
           <tr v-for="category in upperCategories" :key="category">
             <td class="px-2 py-1">
               <div class="flex justify-between items-center text-sm">
                 <span>{{ category }}</span>
                 <span class="text-xs text-gray-500">({{ formatAverage(getAverageForCategory(category)) }})</span>
               </div>
             </td>
             <td v-for="player in players" :key="player.name" class="px-1 py-1 text-center">
               <div v-if="isEditing(player, category)" class="relative">
                 <div class="flex flex-col gap-0.5">
                   <input
                     v-model.number="scoreInput"
                     type="number"
                     inputmode="numeric"
                     id="scoreInput"
                     class="w-12 border border-gray-300 px-1 rounded text-sm 
                            dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 
                            dark:focus:border-blue-500 dark:placeholder-gray-400
                            dark:[color-scheme:dark]"
                     ref="scoreInputRef"
                   />
                   <div class="flex gap-0.5">
                     <button 
                       @click="submitScore(player, category)"
                       class="bg-green-500 hover:bg-green-600 text-white text-xs px-1 rounded"
                     >
                       OK
                     </button>
                     <button 
                       @click="clearScore(player, category)"
                       class="bg-orange-500 hover:bg-orange-600 text-white text-xs px-1 rounded"
                     >
                      C
                     </button>
                     <button 
                       @click="cancelEdit"
                       class="bg-red-500 hover:bg-red-600 text-white text-xs px-1 rounded"
                     >
                       X
                     </button>
                   </div>
                 </div>
               </div>
               <div 
                 v-else 
                 @click="selectCell(player, category)" 
                 class="min-w-[1.5rem] min-h-[1.5rem] rounded 
                        flex items-center justify-center cursor-pointer 
                        hover:bg-gray-50 dark:hover:bg-gray-800 text-lg"
               >
                 {{ player.scores[category] !== undefined ? player.scores[category] : '-' }}
               </div>
             </td>
           </tr>
           <!-- Upper section sum -->
           <tr class="bg-blue-50 dark:bg-blue-900">
             <td class="px-2 py-0.5 font-bold">Upper Section Sum</td>
             <td v-for="player in players" :key="player.name" class="px-1 text-center text-lg">
               {{ calculateUpperSectionSum(player) }}
             </td>
           </tr>
           <!-- Upper section progress -->
           <tr class="bg-blue-50 dark:bg-blue-900">
             <td class="px-2 font-bold">Progress (+/-)</td>
             <td 
               v-for="player in players" 
               :key="player.name" 
               class=" px-1 text-center text-lg"
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
             <td class=" px-2 font-bold">Bonus (if ≥63)</td>
             <td v-for="player in players" :key="player.name" class=" px-1 text-center text-lg">
               {{ calculateUpperSectionSum(player) >= 63 ? 50 : 0 }}
             </td>
           </tr>
           
           <!-- Lower section -->
           <tr v-for="category in lowerCategories" :key="category">
             <td class="px-2 py-1">
               <div class="flex justify-between items-center text-sm">
                 <span>{{ category }}</span>
                 <span class="text-xs text-gray-500">({{ formatAverage(getAverageForCategory(category)) }})</span>
               </div>
             </td>
             <td v-for="player in players" :key="player.name" class="px-1 py-1 text-center">
               <div v-if="isEditing(player, category)" class="relative">
                 <div class="flex flex-col gap-0.5">
                   <input
                     v-model.number="scoreInput"
                     type="number"
                     inputmode="numeric"
                     id="scoreInput"
                     class="w-12 border border-gray-300 px-1 rounded text-sm 
                            dark:bg-gray-600 dark:border-gray-500 dark:text-gray-100 
                            dark:focus:border-blue-500 dark:placeholder-gray-400
                            dark:[color-scheme:dark]"
                     ref="scoreInputRef"
                   />
                   <div class="flex gap-0.5">
                     <button 
                       @click="submitScore(player, category)"
                       class="bg-green-500 hover:bg-green-600 text-white text-xs px-1 rounded"
                     >
                       OK
                     </button>
                     <button 
                       @click="cancelEdit"
                       class="bg-red-500 hover:bg-red-600 text-white text-xs px-1 rounded"
                     >
                       X
                     </button>
                   </div>
                 </div>
               </div>
               <div 
                 v-else 
                 @click="selectCell(player, category)" 
                 class="min-w-[1.5rem] min-h-[1.5rem] rounded 
                        flex items-center justify-center cursor-pointer 
                        hover:bg-gray-50 dark:hover:bg-gray-800 text-lg"
               >
                 {{ player.scores[category] !== undefined ? player.scores[category] : '-' }}
               </div>
             </td>
           </tr>
           <!-- Add this row just before the final Total Score row -->
           <tr class="bg-gray-100 dark:bg-gray-900">
             <td class="px-2 py-1 font-bold">Max Possible</td>
             <td v-for="player in players" :key="player.name" class="px-1 text-center text-md">
               {{ calculateMaxPossible(player) }}
             </td>
           </tr>
           <!-- Total score -->
           <tr class="bg-yellow-100 font-bold text-sm dark:bg-yellow-900">
             <td class="px-2 py-1">Total Score</td>
             <td v-for="player in players" :key="player.name" class="px-1 py-1 text-center text-lg">
               {{ calculateTotalScore(player) }}
             </td>
           </tr>
         </tbody>
       </table>
     </div>
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
         setTimeout(() => {
           document.getElementById('scoreInput').focus();
           document.getElementById('scoreInput').select();
           // Change text color to blue
           document.getElementById('scoreInput').style.color = 'blue';
           document.getElementById('scoreInput').click();
         }, 100);
       }
     };

     const getDefaultScore = (category) => {
       if (scoreInput.value === 0) return 0;
       
       switch (category) {
         case 'Small Straight':
           return scoreInput.value || 15;
         case 'Large Straight':
           return scoreInput.value || 20;
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

     const submitScore = (player, category) => {
       if (scoreInput.value == '-') {
         delete(player.scores[category]);
         cancelEdit();
         return;
       }

       const score = getDefaultScore(category);
       if (score >= 0) {
         // Validate upper section scores
         if (!validateUpperSectionScore(category, score)) {
           if (!confirm(`Warning: ${score} seems invalid for ${category}. Are you sure?`)) {
             return;
           }
         }
         
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
       clearScore,
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
