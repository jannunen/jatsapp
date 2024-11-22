import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from 'uuid';

// Get or create device ID
const getDeviceId = (): string => {
  let deviceId = localStorage.getItem('device_id');
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('device_id', deviceId);
  }
  return deviceId;
};

export const backupService = {
  // Backup all game data
  async backupGames(description?: string) {
    const deviceId = getDeviceId();
    const gameHistory = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]');
    const currentGame = JSON.parse(localStorage.getItem('yatzyGameState') || 'null');

    const playerNames = [...new Set([
      ...gameHistory.flatMap(game => game.players.map(p => p.name)),
      ...(currentGame?.players?.map(p => p.name) || [])
    ])];

    const { data, error } = await supabase
      .from('game_backups')
      .insert({
        device_id: deviceId,
        game_data: {
          history: gameHistory,
          currentGame: currentGame
        },
        description,
        player_names: playerNames
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get all backups for this device
  async getBackups() {
    const deviceId = getDeviceId();
    const { data, error } = await supabase
      .from('game_backups')
      .select('*')
      .eq('device_id', deviceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Restore from backup
  async restoreBackup(backupId: string) {
    const { data, error } = await supabase
      .from('game_backups')
      .select('game_data')
      .eq('id', backupId)
      .single();

    if (error) throw error;

    if (data.game_data.currentGame) {
      localStorage.setItem('yatzyGameState', JSON.stringify(data.game_data.currentGame));
    }
    localStorage.setItem('yatzyGameHistory', JSON.stringify(data.game_data.history));

    return data;
  }
}; 