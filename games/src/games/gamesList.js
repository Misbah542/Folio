import Snake from './Snake';

// Game configuration object
const gamesList = [
  {
    id: 'snake',
    name: 'Snake',
    description: 'Classic snake game - eat food and grow longer!',
    component: Snake,
    difficulty: 'Easy',
    category: 'Arcade',
    controls: 'Arrow Keys or WASD',
    thumbnail: '🐍',
    color: '#00ff00'
  },
  {
    id: 'tetris',
    name: 'Tetris',
    description: 'Arrange falling blocks to clear lines!',
    component: null, // To be implemented
    difficulty: 'Medium',
    category: 'Puzzle',
    controls: 'Arrow Keys, Space',
    thumbnail: '🟦',
    color: '#0066cc'
  },
  {
    id: 'pong',
    name: 'Pong',
    description: 'Classic ping-pong game for two players!',
    component: null, // To be implemented
    difficulty: 'Easy',
    category: 'Sports',
    controls: 'W/S, Up/Down',
    thumbnail: '🏓',
    color: '#ff6600'
  },
  {
    id: 'space-invaders',
    name: 'Space Invaders',
    description: 'Defend Earth from alien invasion!',
    component: null, // To be implemented
    difficulty: 'Hard',
    category: 'Shooter',
    controls: 'Arrow Keys, Space',
    thumbnail: '👾',
    color: '#ff0066'
  },
  {
    id: 'breakout',
    name: 'Breakout',
    description: 'Break all the bricks with your ball!',
    component: null, // To be implemented
    difficulty: 'Medium',
    category: 'Arcade',
    controls: 'Arrow Keys or Mouse',
    thumbnail: '🧱',
    color: '#cc00ff'
  }
];

// Helper functions
export const getGameById = (id) => {
  return gamesList.find(game => game.id === id);
};

export const getGamesByCategory = (category) => {
  return gamesList.filter(game => game.category === category);
};

export const getGamesByDifficulty = (difficulty) => {
  return gamesList.filter(game => game.difficulty === difficulty);
};

export const getAvailableGames = () => {
  return gamesList.filter(game => game.component !== null);
};

export const getAllGames = () => {
  return gamesList;
};

export const getGameCategories = () => {
  return [...new Set(gamesList.map(game => game.category))];
};

export const getGameDifficulties = () => {
  return [...new Set(gamesList.map(game => game.difficulty))];
};

export default gamesList;