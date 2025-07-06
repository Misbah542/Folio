import React, { useState, useEffect, useRef } from 'react';
import './SpaceInvaders.css';
import useGameLoop from '../hooks/useGameLoop';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PLAYER_WIDTH = 40;
const PLAYER_HEIGHT = 30;
const ALIEN_WIDTH = 30;
const ALIEN_HEIGHT = 20;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;
const PLAYER_SPEED = 5;
const BULLET_SPEED = 7;
const ALIEN_BULLET_SPEED = 3;

const SpaceInvaders = ({ onGameEnd, soundEnabled }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  
  // Player
  const [player, setPlayer] = useState({
    x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2,
    y: CANVAS_HEIGHT - 60
  });
  
  // Aliens
  const [aliens, setAliens] = useState([]);
  const [alienDirection, setAlienDirection] = useState(1);
  const [alienSpeed, setAlienSpeed] = useState(0.5);
  
  // Bullets
  const [playerBullets, setPlayerBullets] = useState([]);
  const [alienBullets, setAlienBullets] = useState([]);
  
  // Shields
  const [shields, setShields] = useState([]);
  
  const keysPressed = useRef({});
  const lastShot = useRef(0);
  const alienShootTimer = useRef(0);
  
  // Initialize aliens
  const initializeAliens = () => {
    const newAliens = [];
    const rows = 5;
    const cols = 11;
    const startX = 50;
    const startY = 50;
    
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        newAliens.push({
          x: startX + col * 50,
          y: startY + row * 40,
          type: row === 0 ? 'special' : row < 2 ? 'medium' : 'basic',
          points: row === 0 ? 30 : row < 2 ? 20 : 10,
          alive: true
        });
      }
    }
    
    setAliens(newAliens);
  };
  
  // Initialize shields
  const initializeShields = () => {
    const newShields = [];
    const shieldCount = 4;
    const spacing = CANVAS_WIDTH / (shieldCount + 1);
    
    for (let i = 0; i < shieldCount; i++) {
      const shieldBlocks = [];
      const x = spacing * (i + 1) - 30;
      const y = CANVAS_HEIGHT - 150;
      
      // Create shield shape
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 6; col++) {
          // Create shield pattern
          if (!((row === 0 && (col === 0 || col === 5)) ||
                (row === 3 && (col === 2 || col === 3)))) {
            shieldBlocks.push({
              x: x + col * 10,
              y: y + row * 10,
              health: 3
            });
          }
        }
      }
      
      newShields.push(shieldBlocks);
    }
    
    setShields(newShields);
  };
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.key] = true;
      
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState === 'playing') {
          const now = Date.now();
          if (now - lastShot.current > 300) {
            shoot();
            lastShot.current = now;
          }
        } else if (gameState === 'menu') {
          startGame();
        }
      }
      
      if (e.key === 'p' && gameState === 'playing') {
        setGameState('paused');
      } else if (e.key === 'p' && gameState === 'paused') {
        setGameState('playing');
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
    initializeAliens();
    initializeShields();
  };
  
  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setAlienSpeed(0.5);
    setGameState('menu');
    setPlayerBullets([]);
    setAlienBullets([]);
    setPlayer({ x: CANVAS_WIDTH / 2 - PLAYER_WIDTH / 2, y: CANVAS_HEIGHT - 60 });
  };
  
  const shoot = () => {
    setPlayerBullets(prev => [...prev, {
      x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
      y: player.y
    }]);
  };
  
  const alienShoot = () => {
    const aliveAliens = aliens.filter(a => a.alive);
    if (aliveAliens.length === 0) return;
    
    const shooter = aliveAliens[Math.floor(Math.random() * aliveAliens.length)];
    setAlienBullets(prev => [...prev, {
      x: shooter.x + ALIEN_WIDTH / 2 - BULLET_WIDTH / 2,
      y: shooter.y + ALIEN_HEIGHT
    }]);
  };
  
  // Game loop
  useGameLoop(() => {
    if (gameState !== 'playing') return;
    
    // Update player
    setPlayer(prev => {
      let newX = prev.x;
      
      if (keysPressed.current['ArrowLeft'] || keysPressed.current['a']) {
        newX = Math.max(0, prev.x - PLAYER_SPEED);
      }
      if (keysPressed.current['ArrowRight'] || keysPressed.current['d']) {
        newX = Math.min(CANVAS_WIDTH - PLAYER_WIDTH, prev.x + PLAYER_SPEED);
      }
      
      return { ...prev, x: newX };
    });
    
    // Update aliens
    setAliens(prev => {
      let shouldDescend = false;
      const newAliens = prev.map(alien => {
        if (!alien.alive) return alien;
        
        const newX = alien.x + alienDirection * alienSpeed;
        
        if (newX <= 0 || newX >= CANVAS_WIDTH - ALIEN_WIDTH) {
          shouldDescend = true;
        }
        
        return { ...alien, x: newX };
      });
      
      if (shouldDescend) {
        setAlienDirection(dir => -dir);
        return newAliens.map(alien => ({
          ...alien,
          y: alien.y + 20
        }));
      }
      
      // Check if aliens reached player
      const lowestAlien = Math.max(...newAliens.filter(a => a.alive).map(a => a.y));
      if (lowestAlien >= player.y - ALIEN_HEIGHT) {
        setGameState('gameOver');
        if (onGameEnd) onGameEnd(score);
      }
      
      return newAliens;
    });
    
    // Update player bullets
    setPlayerBullets(prev => {
      const newBullets = [];
      
      prev.forEach(bullet => {
        const newY = bullet.y - BULLET_SPEED;
        
        if (newY > 0) {
          let hit = false;
          
          // Check alien collisions
          setAliens(aliens => aliens.map(alien => {
            if (alien.alive &&
                bullet.x < alien.x + ALIEN_WIDTH &&
                bullet.x + BULLET_WIDTH > alien.x &&
                newY < alien.y + ALIEN_HEIGHT &&
                newY + BULLET_HEIGHT > alien.y) {
              hit = true;
              setScore(s => s + alien.points);
              return { ...alien, alive: false };
            }
            return alien;
          }));
          
          // Check shield collisions
          setShields(shields => shields.map(shield => 
            shield.map(block => {
              if (block.health > 0 &&
                  bullet.x < block.x + 10 &&
                  bullet.x + BULLET_WIDTH > block.x &&
                  newY < block.y + 10 &&
                  newY + BULLET_HEIGHT > block.y) {
                hit = true;
                return { ...block, health: block.health - 1 };
              }
              return block;
            })
          ));
          
          if (!hit) {
            newBullets.push({ ...bullet, y: newY });
          }
        }
      });
      
      return newBullets;
    });
    
    // Update alien bullets
    setAlienBullets(prev => {
      const newBullets = [];
      
      prev.forEach(bullet => {
        const newY = bullet.y + ALIEN_BULLET_SPEED;
        
        if (newY < CANVAS_HEIGHT) {
          let hit = false;
          
          // Check player collision
          if (bullet.x < player.x + PLAYER_WIDTH &&
              bullet.x + BULLET_WIDTH > player.x &&
              newY < player.y + PLAYER_HEIGHT &&
              newY + BULLET_HEIGHT > player.y) {
            hit = true;
            setLives(l => {
              const newLives = l - 1;
              if (newLives <= 0) {
                setGameState('gameOver');
                if (onGameEnd) onGameEnd(score);
              }
              return newLives;
            });
          }
          
          // Check shield collisions
          setShields(shields => shields.map(shield => 
            shield.map(block => {
              if (block.health > 0 &&
                  bullet.x < block.x + 10 &&
                  bullet.x + BULLET_WIDTH > block.x &&
                  newY < block.y + 10 &&
                  newY + BULLET_HEIGHT > block.y) {
                hit = true;
                return { ...block, health: block.health - 1 };
              }
              return block;
            })
          ));
          
          if (!hit) {
            newBullets.push({ ...bullet, y: newY });
          }
        }
      });
      
      return newBullets;
    });
    
    // Alien shooting
    alienShootTimer.current++;
    if (alienShootTimer.current > 60 + Math.random() * 60) {
      alienShoot();
      alienShootTimer.current = 0;
    }
    
    // Check level complete
    const aliveAliens = aliens.filter(a => a.alive);
    if (aliveAliens.length === 0) {
      setLevel(prev => prev + 1);
      setAlienSpeed(prev => prev * 1.2);
      initializeAliens();
      initializeShields();
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
    
    // Draw stars
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 50; i++) {
      const x = (i * 73) % CANVAS_WIDTH;
      const y = (i * 37) % CANVAS_HEIGHT;
      ctx.fillRect(x, y, 1, 1);
    }
    
    // Draw player
    ctx.fillStyle = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff00';
    
    // Player ship shape
    ctx.beginPath();
    ctx.moveTo(player.x + PLAYER_WIDTH / 2, player.y);
    ctx.lineTo(player.x, player.y + PLAYER_HEIGHT);
    ctx.lineTo(player.x + PLAYER_WIDTH, player.y + PLAYER_HEIGHT);
    ctx.closePath();
    ctx.fill();
    
    // Draw aliens
    aliens.forEach(alien => {
      if (!alien.alive) return;
      
      ctx.fillStyle = alien.type === 'special' ? '#ff00ff' : 
                     alien.type === 'medium' ? '#ffff00' : '#00ffff';
      ctx.shadowColor = ctx.fillStyle;
      
      // Simple alien shape
      ctx.fillRect(alien.x, alien.y, ALIEN_WIDTH, ALIEN_HEIGHT);
      ctx.fillRect(alien.x + 5, alien.y - 5, ALIEN_WIDTH - 10, 5);
      ctx.fillRect(alien.x + 10, alien.y + ALIEN_HEIGHT, 10, 5);
    });
    
    // Draw shields
    ctx.shadowBlur = 5;
    shields.forEach(shield => {
      shield.forEach(block => {
        if (block.health > 0) {
          ctx.fillStyle = `rgba(0, 255, 0, ${block.health / 3})`;
          ctx.shadowColor = '#00ff00';
          ctx.fillRect(block.x, block.y, 10, 10);
        }
      });
    });
    
    // Draw bullets
    ctx.shadowBlur = 5;
    
    // Player bullets
    ctx.fillStyle = '#00ff00';
    ctx.shadowColor = '#00ff00';
    playerBullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
    
    // Alien bullets
    ctx.fillStyle = '#ff0000';
    ctx.shadowColor = '#ff0000';
    alienBullets.forEach(bullet => {
      ctx.fillRect(bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });
    
    ctx.shadowBlur = 0;
    
    // Draw UI
    ctx.fillStyle = '#00ff00';
    ctx.font = '20px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 20, 30);
    ctx.fillText(`LIVES: ${lives}`, 20, 60);
    ctx.textAlign = 'right';
    ctx.fillText(`LEVEL: ${level}`, CANVAS_WIDTH - 20, 30);
  }, [player, aliens, shields, playerBullets, alienBullets, score, lives, level]);
  
  return (
    <div className="space-invaders-game">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="space-invaders-canvas"
      />
      
      {gameState === 'menu' && (
        <div className="game-overlay">
          <div className="menu-content">
            <h2 className="pixel-text">SPACE INVADERS</h2>
            <p>Defend Earth from alien invasion!</p>
            <div className="controls-info">
              <p>←/→ or A/D - Move</p>
              <p>SPACE - Fire</p>
              <p>P - Pause</p>
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
            <p>Press P to continue</p>
          </div>
        </div>
      )}
      
      {gameState === 'gameOver' && (
        <div className="game-overlay">
          <div className="gameover-content">
            <h2 className="pixel-text">GAME OVER</h2>
            <p className="final-score">Score: {score}</p>
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

export default SpaceInvaders;