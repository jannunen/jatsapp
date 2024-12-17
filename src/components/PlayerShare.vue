<template>
  <div class="fixed inset-0 z-50 overflow-y-auto" v-if="show">
    <div class="flex items-center justify-center min-h-screen px-4">
      <!-- Backdrop -->
      <div class="fixed inset-0 bg-black opacity-50" @click="$emit('close')"></div>
      
      <!-- Modal -->
      <div class="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-sm w-full">
        <div class="flex flex-col items-center gap-4">
          <h3 class="text-lg font-bold dark:text-white">
            Share {{ player?.name }}'s Stats
          </h3>
          
          <div v-if="shareId" class="w-full">
            <QRCode
              :value="shareUrl"
              class="bg-white p-2 rounded w-full"
              :size="200"
              level="M"
              render-as="svg"
            />

            <div class="text-sm text-gray-600 dark:text-gray-300 mt-4 text-center">
              Scan with phone camera or
            </div>

            <div class="text-center my-2">
            <a :href="shareUrl" target="_blank" class="text-center my-2 text-blue-500 hover:text-blue-600 dark:text-blue-400 hover:underline">Share URL</a>
            </div>

            <div class="flex gap-2 mt-2">
              <button 
                @click="copyUrl"
                class="flex-1 px-4 py-2 text-sm bg-blue-500 text-white rounded hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
              >
                Copy Link
              </button>
            </div>
          </div>
          
          <div v-else-if="error" class="text-center text-red-500 dark:text-red-400">
            Failed to generate share link. Please try again.
          </div>
          
          <div v-else class="text-center text-gray-600 dark:text-gray-300">
            Generating share link...
          </div>

          <button 
            @click="$emit('close')"
            class="mt-4 px-4 py-2 text-sm bg-gray-500 text-white rounded hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue';
import QRCode from 'qrcode.vue';
import { supabase } from '../lib/supabase';

interface PlayerScore {
  name: string;
  scores: Record<string, number>;
  total: number;
}

interface OtherPlayerScore {
  name: string;
  total: number;
}

interface SharedData {
  player_name: string;
  scores: Record<string, number>;
  total: number;
  other_players: OtherPlayerScore[];
  updated_at: string;
}

const props = defineProps<{
  show: boolean;
  player: PlayerScore;
  players: PlayerScore[];
}>();

defineEmits(['close']);

const shareId = ref<string>('');
const error = ref(false);

const shareUrl = computed(() => {
  if (!shareId.value) return '';
  const baseUrl = window.location.origin + import.meta.env.VITE_BASE_URL;
  return `${baseUrl}share?id=${shareId.value}`;
});

const getOtherPlayers = (): OtherPlayerScore[] => {
  return props.players
    .filter(p => p.name !== props.player.name)
    .map(p => ({
      name: p.name,
      total: Object.values(p.scores).reduce((sum, score) => sum + (score || 0), 0)
    }));
};

const initShare = async () => {
  if (!props.player) return;
  
  error.value = false;
  shareId.value = '';
  
  try {
    const sharedData: SharedData = {
      player_name: props.player.name,
      scores: props.player.scores,
      total: Object.values(props.player.scores).reduce((a, b) => a + (b || 0), 0),
      other_players: getOtherPlayers(),
      updated_at: new Date().toISOString()
    };

    const { data, error: supabaseError } = await supabase
      .from('shared_scores')
      .upsert(sharedData)
      .select()
      .single();
      
    if (supabaseError) throw supabaseError;
    if (!data?.id) throw new Error('No ID returned');
    
    shareId.value = data.id;
  } catch (err) {
    console.error('Failed to initialize share:', err);
    error.value = true;
  }
};

const copyUrl = async () => {
  try {
    await navigator.clipboard.writeText(shareUrl.value);
    alert('Link copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
    alert('Failed to copy link');
  }
};

// Watch for show prop changes to reinitialize share when modal opens
watchEffect(() => {
  if (props.show && props.player) {
    initShare();
  }
});
</script> 