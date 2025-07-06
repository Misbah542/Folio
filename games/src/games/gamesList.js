// List of available games
export const games = [
    {
      id: 'snake',
      name: 'Snake',
      icon: '🐍',
      description: 'Classic snake game - eat food and grow longer!',
      instructions: 'Use arrow keys to control the snake. Eat the food to grow longer. Avoid hitting walls or yourself!',
      difficulty: 2,
      controls: 'Arrow Keys',
      component: 'Snake' // Component name to load
    },
    {
      id: 'tetris',
      name: 'Tetris',
      icon: '🧱',
      description: 'Stack falling blocks and clear lines',
      instructions: 'Use arrow keys to move blocks, up arrow to rotate. Clear complete lines to score points!',
      difficulty: 3,
      controls: 'Arrow Keys',
      additionalControls: { key: '↑', desc: 'Rotate' },
      component: 'Tetris'
    },
    {
      id: 'pong',
      name: 'Pong',
      icon: '🏓',
      description: 'The original arcade tennis game',
      instructions: 'Move your paddle to hit the ball. First to 10 points wins!',
      difficulty: 1,
      controls: 'W/S or ↑/↓',
      component: 'Pong'
    },
    {
      id: 'space-invaders',
      name: 'Space Invaders',
      icon: '👾',
      description: 'Defend Earth from alien invaders',
      instructions: 'Move your ship and shoot the invaders before they reach you. Use cover wisely!',
      difficulty: 3,
      controls: '←/→ to move',
      additionalControls: { key: 'Space', desc: 'Shoot' },
      component: 'SpaceInvaders'
    },
    {
      id: 'breakout',
      name: 'Breakout',
      icon: '🧱',
      description: 'Break all the bricks with your ball',
      instructions: 'Move the paddle to keep the ball in play. Break all bricks to advance!',
      difficulty: 2,
      controls: '←/→ or Mouse',
      component: 'Breakout'
    },
    {
      id: 'pacman',
      name: 'Pac-Man',
      icon: '🟡',
      description: 'Eat dots and avoid ghosts',
      instructions: 'Navigate the maze, eat all dots, and avoid the ghosts. Eat power pellets to turn the tables!',
      difficulty: 4,
      controls: 'Arrow Keys',
      component: 'PacMan'
    }
  ];