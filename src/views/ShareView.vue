<template>
  <div class="max-w-md mx-auto p-4">
    <div v-if="playerData" class="space-y-4">
      <h2 class="text-xl font-bold">{{ playerData.player_name }}'s Score</h2>
      
      <!-- Current Game -->
      <div class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
        <div class="text-2xl font-bold text-center mb-4">
          Current Total: {{ playerData.total }}
        </div>
        
        <div class="space-y-2">
          <div v-for="(score, category) in playerData.scores" :key="category"
               class="flex justify-between">
            <span>{{ category }}</span>
            <span class="font-bold">{{ score }}</span>
          </div>
        </div>
      </div>
      
      <!-- Game History -->
      <div class="mt-8">
        <h3 class="text-lg font-bold mb-4">Game History</h3>
        <div class="space-y-4">
          <div v-for="(game, index) in playerData.game_history" :key="index"
               class="bg-white dark:bg-gray-800 rounded-lg p-4 shadow">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm text-gray-500 dark:text-gray-400">
                {{ new Date(game.timestamp).toLocaleDateString() }}
              </span>
              <span class="font-bold">
                Total: {{ game.total }}
              </span>
            </div>
            
            <div class="space-y-1">
              <div v-for="category in game.categories" :key="category"
                   class="flex justify-between text-sm">
                <span>{{ category }}</span>
                <span>{{ game.scores[category] }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="text-sm text-gray-500 dark:text-gray-400 text-center">
        Last updated: {{ new Date(playerData.updated_at).toLocaleString() }}
      </div>
    </div>
    
    <div v-else class="text-center text-gray-500 dark:text-gray-400">
      Loading scores...
    </div>
    
    <!-- Add other players section -->
    <div v-if="playerData?.other_players?.length" class="mt-6">
      <h3 class="text-lg font-bold mb-2">Other Players</h3>
      <div class="space-y-2">
        <div v-for="otherPlayer in playerData.other_players" :key="otherPlayer.name"
             class="flex justify-between items-center p-2 bg-gray-50 dark:bg-gray-700 rounded">
          <span>{{ otherPlayer.name }}</span>
          <span class="font-bold">{{ otherPlayer.total }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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

const playerData = ref<SharedScore | null>(null);
let subscription: any = null;

onMounted(async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const shareId = urlParams.get('id');
  
  if (shareId) {
    // Get initial data
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
    
    // Subscribe to real-time updates
    subscription = supabase
      .channel('shared_scores')
      .on(
        'postgres_changes',
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
  if (subscription) {
    subscription.unsubscribe();
  }
});
</script> 