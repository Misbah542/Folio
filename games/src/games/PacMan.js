import React, { useState, useEffect, useRef } from 'react';
import './PacMan.css';
import useGameLoop from '../hooks/useGameLoop';

const CELL_SIZE = 20;
const GRID_WIDTH = 28;
const GRID_HEIGHT = 31;
const CANVAS_WIDTH = GRID_WIDTH * CELL_SIZE;
const CANVAS_HEIGHT = GRID_HEIGHT * CELL_SIZE;

// Simplified maze layout (1 = wall, 0 = dot, 2 = power pellet, 3 = empty)
const MAZE = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,2,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,2,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,0,1,1,1,1,1,3,1,1,3,1,1,1,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,1,1,1,3,1,1,3,1,1,1,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,3,3,3,3,3,3,3,3,3,3,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,3,1,1,1,3,3,1,1,1,3,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,3,1,3,3,3,3,3,3,1,3,1,1,0,1,1,1,1,1,1],
  [3,3,3,3,3,3,0,3,3,3,1,3,3,3,3,3,3,1,3,3,3,0,3,3,3,3,3,3],
  [1,1,1,1,1,1,0,1,1,3,1,3,3,3,3,3,3,1,3,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,3,1,1,1,1,1,1,1,1,3,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,3,3,3,3,3,3,3,3,3,3,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,3,1,1,1,1,1,1,1,1,3,1,1,0,1,1,1,1,1,1],
  [1,1,1,1,1,1,0,1,1,3,1,1,1,1,1,1,1,1,3,1,1,0,1,1,1,1,1,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
  [1,2,0,0,1,1,0,0,0,0,0,0,0,3,3,0,0,0,0,0,0,0,1,1,0,0,2,1],
  [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
  [1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1],
  [1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1],
  [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

const PacMan = ({ onGameEnd, soundEnabled }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [maze, setMaze] = useState([]);
  const [dotCount, setDotCount] = useState(0);
  
  // Pac-Man
  const [pacman, setPacman] = useState({
    x: 14,
    y: 23,
    direction: null,
    nextDirection: null,
    mouthOpen: true,
    moveProgress: 0
  });
  
  // Ghosts
  const [ghosts, setGhosts] = useState([
    { x: 14, y: 11, color: '#ff0000', dx: 1, dy: 0, mode: 'chase' },
    { x: 13, y: 14, color: '#00ffff', dx: -1, dy: 0, mode: 'chase' },
    { x: 14, y: 14, color: '#ffb8ff', dx: 0, dy: 1, mode: 'chase' },
    { x: 15, y: 14, color: '#ffb852', dx: 0, dy: -1, mode: 'chase' }
  ]);
  
  const [powerMode, setPowerMode] = useState(false);
  const [powerTimer, setPowerTimer] = useState(0);
  
  const keysPressed = useRef({});
  const animationTimer = useRef(0);
  const moveCounter = useRef(0);
  
  // Initialize maze
  useEffect(() => {
    const newMaze = MAZE.map(row => [...row]);
    setMaze(newMaze);
    
    // Count dots
    let dots = 0;
    newMaze.forEach(row => {
      row.forEach(cell => {
        if (cell === 0 || cell === 2) dots++;
      });
    });
    setDotCount(dots);
  }, [level]);
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      
      if (gameState === 'playing') {
        switch(e.key) {
          case 'ArrowUp':
            e.preventDefault();
            setPacman(prev => ({ ...prev, nextDirection: { dx: 0, dy: -1 } }));
            break;
          case 'ArrowDown':
            e.preventDefault();
            setPacman(prev => ({ ...prev, nextDirection: { dx: 0, dy: 1 } }));
            break;
          case 'ArrowLeft':
            e.preventDefault();
            setPacman(prev => ({ ...prev, nextDirection: { dx: -1, dy: 0 } }));
            break;
          case 'ArrowRight':
            e.preventDefault();
            setPacman(prev => ({ ...prev, nextDirection: { dx: 1, dy: 0 } }));
            break;
        }
      }
      
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState === 'menu') {
          startGame();
        } else if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        }
      }
      
      if (e.key === 'Enter' && gameState === 'gameOver') {
        resetGame();
      }
    };
    
    const handleKeyUp = (e) => {
      keysPressed.current[e.key] = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameState]);
  
  const startGame = () => {
    setGameState('playing');
  };
  
  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameState('menu');
    setPacman({ x: 14, y: 23, direction: null, nextDirection: null, mouthOpen: true, moveProgress: 0 });
    setGhosts([
      { x: 14, y: 11, color: '#ff0000', dx: 1, dy: 0, mode: 'chase' },
      { x: 13, y: 14, color: '#00ffff', dx: -1, dy: 0, mode: 'chase' },
      { x: 14, y: 14, color: '#ffb8ff', dx: 0, dy: 1, mode: 'chase' },
      { x: 15, y: 14, color: '#ffb852', dx: 0, dy: -1, mode: 'chase' }
    ]);
    setPowerMode(false);
    setPowerTimer(0);
  };
  
  const canMove = (x, y) => {
    if (x < 0 || x >= GRID_WIDTH || y < 0 || y >= GRID_HEIGHT) return false;
    return maze[y] && maze[y][x] !== 1;
  };
  
  // Game loop
  useGameLoop(() => {
    if (gameState !== 'playing') return;
    
    animationTimer.current++;
    moveCounter.current++;
    
    // Update Pac-Man - Slower movement
    if (moveCounter.current % 5 === 0) { // Move every 5 frames for smoother, slower movement
      setPacman(prev => {
        let newX = prev.x;
        let newY = prev.y;
        let newDirection = prev.direction;
        
        // Try to change direction
        if (prev.nextDirection) {
          const testX = prev.x + prev.nextDirection.dx;
          const testY = prev.y + prev.nextDirection.dy;
          
          if (canMove(testX, testY)) {
            newDirection = prev.nextDirection;
          }
        }
        
        // Move in current direction
        if (newDirection) {
          const testX = prev.x + newDirection.dx;
          const testY = prev.y + newDirection.dy;
          
          if (canMove(testX, testY)) {
            newX = testX;
            newY = testY;
            
            // Wrap around tunnels
            if (newY === 14) { // Only wrap on the tunnel row
              if (newX < 0) newX = GRID_WIDTH - 1;
              if (newX >= GRID_WIDTH) newX = 0;
            }
          } else {
            newDirection = null;
          }
        }
        
        // Eat dots
        if (maze[newY] && maze[newY][newX] === 0) {
          setMaze(m => {
            const newMaze = m.map(row => [...row]);
            newMaze[newY][newX] = 3;
            return newMaze;
          });
          setScore(s => s + 10);
          setDotCount(d => {
            const newCount = d - 1;
            if (newCount === 0) {
              // Level complete
              setLevel(l => l + 1);
            }
            return newCount;
          });
        }
        
        // Eat power pellet
        if (maze[newY] && maze[newY][newX] === 2) {
          setMaze(m => {
            const newMaze = m.map(row => [...row]);
            newMaze[newY][newX] = 3;
            return newMaze;
          });
          setScore(s => s + 50);
          setPowerMode(true);
          setPowerTimer(500);
          setDotCount(d => d - 1);
          
          // Make ghosts frightened
          setGhosts(g => g.map(ghost => ({ ...ghost, mode: 'frightened' })));
        }
        
        return {
          ...prev,
          x: newX,
          y: newY,
          direction: newDirection,
          mouthOpen: animationTimer.current % 20 < 10
        };
      });
    }
    
    // Update ghosts - Slower movement
    if (moveCounter.current % 7 === 0) { // Ghosts move slightly slower than Pac-Man
      setGhosts(prev => prev.map((ghost, index) => {
        let newX = ghost.x;
        let newY = ghost.y;
        let newDx = ghost.dx;
        let newDy = ghost.dy;
        
        // Simple AI - change direction at intersections
        const possibleMoves = [];
        if (canMove(ghost.x + 1, ghost.y) && ghost.dx !== -1) possibleMoves.push({ dx: 1, dy: 0 });
        if (canMove(ghost.x - 1, ghost.y) && ghost.dx !== 1) possibleMoves.push({ dx: -1, dy: 0 });
        if (canMove(ghost.x, ghost.y + 1) && ghost.dy !== -1) possibleMoves.push({ dx: 0, dy: 1 });
        if (canMove(ghost.x, ghost.y - 1) && ghost.dy !== 1) possibleMoves.push({ dx: 0, dy: -1 });
        
        if (possibleMoves.length > 0) {
          // Sometimes chase Pac-Man, sometimes random
          if (Math.random() > 0.3 && ghost.mode === 'chase') {
            // Chase Pac-Man
            let bestMove = possibleMoves[0];
            let bestDistance = Infinity;
            
            possibleMoves.forEach(move => {
              const testX = ghost.x + move.dx;
              const testY = ghost.y + move.dy;
              const distance = Math.abs(testX - pacman.x) + Math.abs(testY - pacman.y);
              if (distance < bestDistance) {
                bestDistance = distance;
                bestMove = move;
              }
            });
            
            newDx = bestMove.dx;
            newDy = bestMove.dy;
          } else {
            // Random move
            const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
            newDx = move.dx;
            newDy = move.dy;
          }
        }
        
        // Move ghost
        const testX = ghost.x + newDx;
        const testY = ghost.y + newDy;
        
        if (canMove(testX, testY)) {
          newX = testX;
          newY = testY;
          
          // Wrap around tunnels
          if (newY === 14) { // Only wrap on the tunnel row
            if (newX < 0) newX = GRID_WIDTH - 1;
            if (newX >= GRID_WIDTH) newX = 0;
          }
        } else {
          // Reverse direction if hit wall
          newDx = -ghost.dx;
          newDy = -ghost.dy;
        }
        
        return { ...ghost, x: newX, y: newY, dx: newDx, dy: newDy };
      }));
    }
    
    // Check collisions
    ghosts.forEach(ghost => {
      if (ghost.x === pacman.x && ghost.y === pacman.y) {
        if (powerMode && ghost.mode === 'frightened') {
          // Eat ghost
          setScore(s => s + 200);
          ghost.x = 14;
          ghost.y = 14;
          ghost.mode = 'chase';
        } else if (ghost.mode !== 'frightened') {
          // Lose life
          setLives(l => {
            const newLives = l - 1;
            if (newLives <= 0) {
              setGameState('gameOver');
              if (onGameEnd) onGameEnd(score);
            }
            return newLives;
          });
          
          // Reset positions
          setPacman({ x: 14, y: 23, direction: null, nextDirection: null, mouthOpen: true, moveProgress: 0 });
          setGhosts([
            { x: 14, y: 11, color: '#ff0000', dx: 1, dy: 0, mode: 'chase' },
            { x: 13, y: 14, color: '#00ffff', dx: -1, dy: 0, mode: 'chase' },
            { x: 14, y: 14, color: '#ffb8ff', dx: 0, dy: 1, mode: 'chase' },
            { x: 15, y: 14, color: '#ffb852', dx: 0, dy: -1, mode: 'chase' }
          ]);
        }
      }
    });
    
    // Update power mode
    if (powerMode) {
      setPowerTimer(t => {
        const newTimer = t - 1;
        if (newTimer <= 0) {
          setPowerMode(false);
          setGhosts(g => g.map(ghost => ({ ...ghost, mode: 'chase' })));
        }
        return newTimer;
      });
    }
  }, 16);
  
  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw maze
    maze.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell === 1) {
          // Wall
          ctx.fillStyle = '#0000ff';
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
          
          // Wall highlight
          ctx.fillStyle = '#4040ff';
          ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, 2);
        } else if (cell === 0) {
          // Dot
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, 2, 0, Math.PI * 2);
          ctx.fill();
        } else if (cell === 2) {
          // Power pellet
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(x * CELL_SIZE + CELL_SIZE / 2, y * CELL_SIZE + CELL_SIZE / 2, 6, 0, Math.PI * 2);
          ctx.fill();
        }
      });
    });
    
    // Draw Pac-Man
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    const centerX = pacman.x * CELL_SIZE + CELL_SIZE / 2;
    const centerY = pacman.y * CELL_SIZE + CELL_SIZE / 2;
    
    if (pacman.mouthOpen && pacman.direction) {
      let startAngle = 0.2 * Math.PI;
      let endAngle = 1.8 * Math.PI;
      
      if (pacman.direction.dx === 1) { // Right
        startAngle = 0.2 * Math.PI;
        endAngle = 1.8 * Math.PI;
      } else if (pacman.direction.dx === -1) { // Left
        startAngle = 1.2 * Math.PI;
        endAngle = 0.8 * Math.PI;
      } else if (pacman.direction.dy === -1) { // Up
        startAngle = 1.7 * Math.PI;
        endAngle = 1.3 * Math.PI;
      } else if (pacman.direction.dy === 1) { // Down
        startAngle = 0.7 * Math.PI;
        endAngle = 0.3 * Math.PI;
      }
      
      ctx.arc(centerX, centerY, CELL_SIZE / 2 - 2, startAngle, endAngle);
      ctx.lineTo(centerX, centerY);
    } else {
      ctx.arc(centerX, centerY, CELL_SIZE / 2 - 2, 0, Math.PI * 2);
    }
    ctx.closePath();
    ctx.fill();
    
    // Draw ghosts
    ghosts.forEach(ghost => {
      if (powerMode && ghost.mode === 'frightened') {
        ctx.fillStyle = '#0000ff';
      } else {
        ctx.fillStyle = ghost.color;
      }
      
      const ghostX = ghost.x * CELL_SIZE;
      const ghostY = ghost.y * CELL_SIZE;
      
      // Ghost body
      ctx.beginPath();
      ctx.arc(ghostX + CELL_SIZE / 2, ghostY + CELL_SIZE / 2, CELL_SIZE / 2 - 2, Math.PI, 0, false);
      ctx.lineTo(ghostX + CELL_SIZE - 2, ghostY + CELL_SIZE - 2);
      
      // Wavy bottom
      for (let i = 0; i < 3; i++) {
        const x = ghostX + CELL_SIZE - 2 - (i + 1) * (CELL_SIZE / 3);
        const y = ghostY + CELL_SIZE - 2 - (i % 2) * 3;
        ctx.lineTo(x, y);
      }
      
      ctx.closePath();
      ctx.fill();
      
      // Ghost eyes
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(ghostX + CELL_SIZE / 3, ghostY + CELL_SIZE / 3, 2, 0, Math.PI * 2);
      ctx.arc(ghostX + 2 * CELL_SIZE / 3, ghostY + CELL_SIZE / 3, 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Eye pupils
      ctx.fillStyle = '#000';
      const eyeOffsetX = ghost.mode === 'frightened' ? 0 : (pacman.x - ghost.x) * 0.15;
      const eyeOffsetY = ghost.mode === 'frightened' ? 0 : (pacman.y - ghost.y) * 0.15;
      ctx.beginPath();
      ctx.arc(ghostX + CELL_SIZE / 3 + eyeOffsetX, ghostY + CELL_SIZE / 3 + eyeOffsetY, 1, 0, Math.PI * 2);
      ctx.arc(ghostX + 2 * CELL_SIZE / 3 + eyeOffsetX, ghostY + CELL_SIZE / 3 + eyeOffsetY, 1, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw UI
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 20, CANVAS_HEIGHT - 10);
    ctx.fillText(`LIVES: ${lives}`, 200, CANVAS_HEIGHT - 10);
    ctx.textAlign = 'right';
    ctx.fillText(`LEVEL: ${level}`, CANVAS_WIDTH - 20, CANVAS_HEIGHT - 10);
  }, [maze, pacman, ghosts, score, lives, level, powerMode]);
  
  return (
    <div className="pacman-game">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT + 30}
        className="pacman-canvas"
      />
      
      {gameState === 'menu' && (
        <div className="game-overlay">
          <div className="menu-content">
            <h2 className="pixel-text">PAC-MAN</h2>
            <p>Eat all dots and avoid ghosts!</p>
            <div className="controls-info">
              <p>Arrow Keys - Move</p>
              <p>SPACE - Start/Pause</p>
            </div>
            <button onClick={startGame} className="start-button">
              START GAME
            </button>
          </div>
        </div>
      )}
      
      {gameState === 'paused' && (
        <div className="game-overlay">
          <div className="pause-content">
            <h2 className="pixel-text">PAUSED</h2>
            <p>Press SPACE to continue</p>
          </div>
        </div>
      )}
      
      {gameState === 'gameOver' && (
        <div className="game-overlay">
          <div className="gameover-content">
            <h2 className="pixel-text">GAME OVER</h2>
            <p className="final-score">Final Score: {score}</p>
            <p>Level Reached: {level}</p>
            <button onClick={resetGame} className="restart-button">
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PacMan;