<template>
  <div class="max-w-md mx-auto p-4">
    <div v-if="playerData" class="space-y-4">
      <h2 class="text-xl font-bold">{{ playerData.player_name }}'s Score</h2>
      
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="text-2xl font-bold text-center mb-4">Current Total: {{ playerData.total }}</div>
        
        <div class="mb-6 space-y-2">
          <div v-for="(maxScore, category) in upperSection" :key="category"
               class="flex justify-between items-center py-1 border-b dark:border-gray-700">
            <span>{{ category }}</span>
            <span v-if="playerData.scores[category]" 
                  :class="{'text-green-600 dark:text-green-400': playerData.scores[category] === maxScore}"
                  class="font-bold">
              {{ playerData.scores[category] }}
            </span>
            <span v-else class="text-gray-400">-</span>
          </div>

          <div class="flex justify-between items-center py-1 bg-gray-50 dark:bg-gray-700 px-2 rounded">
            <div>
              <span>Bonus</span>
              <span class="text-xs text-gray-500 ml-2">(if sum ≥ 63)</span>
            </div>
            <div class="font-bold">{{ getUpperSectionSum() >= 63 ? '+50' : `${getUpperSectionSum()}/63` }}</div>
          </div>
        </div>
        
        <div class="space-y-2">
          <div v-for="(maxScore, category) in lowerSection" :key="category"
               class="flex justify-between items-center py-1 border-b dark:border-gray-700">
            <span>{{ category }}</span>
            <span v-if="playerData.scores[category]" 
                  :class="{'text-green-600 dark:text-green-400': playerData.scores[category] === maxScore}"
                  class="font-bold">
              {{ playerData.scores[category] }}
            </span>
            <span v-else class="text-gray-400">-</span>
          </div>
        </div>
      </div>
      
      <div class="text-sm text-gray-500 dark:text-gray-400 text-center">
        Last updated: {{ new Date(playerData.updated_at).toLocaleString() }}
      </div>
    </div>
    
    <div v-else class="text-center text-gray-500 dark:text-gray-400">Loading scores...</div>
    
    <!-- Current Standings -->
    <div v-if="playerData && playerData.other_players?.length" class="mt-6">
      <h3 class="text-lg font-bold mb-2">Current Standings</h3>
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow space-y-2">
        <div v-for="(player, index) in standings" :key="player.name"
             class="flex items-center justify-between p-2 rounded"
             :class="{
               'bg-yellow-50 dark:bg-yellow-900/50': index === 0,
               'bg-gray-50 dark:bg-gray-700': index !== 0
             }"
        >
          <div class="flex items-center gap-2">
            <span class="text-lg">
              {{ ['🥇', '🥈', '🥉'][index] || (index + 1) }}
            </span>
            <span :class="{ 'font-bold': player.name === playerData.player_name }">
              {{ player.name }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <span class="font-bold">{{ player.total }}</span>
            <span v-if="index > 0" class="text-sm text-gray-500">
              (-{{ standings[0].total - player.total }})
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue';
import { supabase } from '../lib/supabase';

interface GameHistory {
  timestamp: string;
  scores: Record<string, number>;
  total: number;
  categories: string[];
}

interface SharedScore {
  id: string;
  player_name: string;
  scores: Record<string, number>;
  total: number;
  game_history: GameHistory[];
  updated_at: string;
  other_players: OtherPlayer[];
}

interface OtherPlayer {
  name: string;
  scores: Record<string, number>;
  total: number;
}

interface Standing {
  name: string;
  total: number;
}

const upperSection = {
  'Ones': 5, 'Twos': 10, 'Threes': 15,
  'Fours': 20, 'Fives': 25, 'Sixes': 30
} as const;

const lowerSection = {
  'One Pair': 12, 'Two Pairs': 22,
  'Three of a Kind': 30, 'Four of a Kind': 30,
  'Full House': 28, 'Small Straight': 15,
  'Large Straight': 20, 'Yahtzee': 50, 'Chance': 30
} as const;

const playerData = ref<SharedScore | null>(null);
let subscription: any = null;

const getUpperSectionSum = () => {
  if (!playerData.value) return 0;
  return Object.entries(upperSection).reduce((sum, [category]) => 
    sum + (playerData.value?.scores[category] || 0), 0);
};

// Computed property for standings
const standings = computed<Standing[]>(() => {
  if (!playerData.value) return [];

  // Combine main player and other players
  const allPlayers = [
    {
      name: playerData.value.player_name,
      total: playerData.value.total
    },
    ...playerData.value.other_players.map(p => ({
      name: p.name,
      total: p.total
    }))
  ];

  // Sort by total score in descending order
  return allPlayers.sort((a, b) => b.total - a.total);
});

onMounted(async () => {
  const shareId = new URLSearchParams(window.location.search).get('id');
  
  if (shareId) {
    const { data, error } = await supabase
      .from('shared_scores')
      .select('*')
      .eq('id', shareId)
      .single();
      
    if (error) {
      console.error('Error fetching scores:', error);
      return;
    }
    
    playerData.value = data as SharedScore;
    
    subscription = supabase
      .channel('shared_scores')
      .on('postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'shared_scores',
          filter: `id=eq.${shareId}`
        },
        (payload) => {
          playerData.value = payload.new as SharedScore;
        }
      )
      .subscribe();
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});
</script> 