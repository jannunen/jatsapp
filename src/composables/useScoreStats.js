import { ref, onMounted } from 'vue';

export function useScoreStats() {
  const games = ref([]);

  onMounted(() => {
    const history = JSON.parse(localStorage.getItem('yatzyGameHistory') || '[]');
    games.value = history;
  });

  const getAverageForCategory = (category) => {
    let sum = 0;
    let count = 0;

    games.value.forEach(game => {
      game.players.forEach(player => {
        if (player.scores[category] !== undefined && 
            player.scores[category] !== '-' &&
            !isNaN(parseInt(player.scores[category]))) {
          sum += parseInt(player.scores[category]);
          count++;
        }
      });
    });

    return count > 0 ? sum / count : 0;
  };

  const formatAverage = (value) => {
    return value.toFixed(1);
  };

  return {
    getAverageForCategory,
    formatAverage
  };
} 