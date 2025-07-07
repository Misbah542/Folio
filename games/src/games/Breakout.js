import React, { useState, useEffect, useRef } from 'react';
import './Breakout.css';
import useGameLoop from '../hooks/useGameLoop';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 15;
const BALL_SIZE = 10;
const BRICK_WIDTH = 75;
const BRICK_HEIGHT = 20;
const BRICK_PADDING = 10;
const BRICK_OFFSET_TOP = 60;
const BRICK_OFFSET_LEFT = 30;
const BRICK_ROWS = 5;
const BRICK_COLS = 9;

const Breakout = ({ onGameEnd, soundEnabled }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  
  // Paddle
  const [paddle, setPaddle] = useState({
    x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2
  });
  
  // Ball
  const [ball, setBall] = useState({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT - 30,
    dx: 4,
    dy: -4
  });
  
  // Bricks
  const [bricks, setBricks] = useState([]);
  
  const mouseX = useRef(CANVAS_WIDTH / 2);
  const canvasRect = useRef(null);
  
  // Initialize bricks
  const initializeBricks = () => {
    const newBricks = [];
    const colors = ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff'];
    
    for (let r = 0; r < BRICK_ROWS; r++) {
      for (let c = 0; c < BRICK_COLS; c++) {
        newBricks.push({
          x: c * (BRICK_WIDTH + BRICK_PADDING) + BRICK_OFFSET_LEFT,
          y: r * (BRICK_HEIGHT + BRICK_PADDING) + BRICK_OFFSET_TOP,
          status: 1,
          color: colors[r],
          points: (BRICK_ROWS - r) * 10
        });
      }
    }
    
    setBricks(newBricks);
  };
  
  // Handle mouse movement
  useEffect(() => {
    const handleMouseMove = (e) => {
      const canvas = canvasRef.current;
      if (canvas && gameState === 'playing') {
        const rect = canvas.getBoundingClientRect();
        const scaleX = CANVAS_WIDTH / rect.width;
        mouseX.current = (e.clientX - rect.left) * scaleX;
      }
    };
    
    const handleKeyDown = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        if (gameState === 'menu') {
          startGame();
        } else if (gameState === 'paused') {
          setGameState('playing');
        } else if (gameState === 'playing') {
          setGameState('paused');
        }
      }
      
      if (e.key === 'Enter' && gameState === 'gameOver') {
        resetGame();
      }
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [gameState]);
  
  const startGame = () => {
    setGameState('playing');
    initializeBricks();
    resetBall();
  };
  
  const resetGame = () => {
    setScore(0);
    setLives(3);
    setLevel(1);
    setGameState('menu');
    setPaddle({ x: CANVAS_WIDTH / 2 - PADDLE_WIDTH / 2 });
    resetBall();
  };
  
  const resetBall = () => {
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 30,
      dx: 4 * (Math.random() > 0.5 ? 1 : -1),
      dy: -4
    });
  };
  
  const nextLevel = () => {
    setLevel(prev => prev + 1);
    initializeBricks();
    resetBall();
    setBall(prev => ({
      ...prev,
      dx: prev.dx * 1.1,
      dy: prev.dy * 1.1
    }));
  };
  
  // Game loop
  useGameLoop(() => {
    if (gameState !== 'playing') return;
    
    // Update paddle
    setPaddle(prev => {
      const targetX = mouseX.current - PADDLE_WIDTH / 2;
      const newX = Math.max(0, Math.min(CANVAS_WIDTH - PADDLE_WIDTH, targetX));
      return { x: newX };
    });
    
    // Update ball
    setBall(prev => {
      let newX = prev.x + prev.dx;
      let newY = prev.y + prev.dy;
      let newDx = prev.dx;
      let newDy = prev.dy;
      
      // Wall collisions
      if (newX - BALL_SIZE / 2 <= 0 || newX + BALL_SIZE / 2 >= CANVAS_WIDTH) {
        newDx = -newDx;
        newX = newX - BALL_SIZE / 2 <= 0 ? BALL_SIZE / 2 : CANVAS_WIDTH - BALL_SIZE / 2;
      }
      
      if (newY - BALL_SIZE / 2 <= 0) {
        newDy = -newDy;
        newY = BALL_SIZE / 2;
      }
      
      // Paddle collision
      if (newY + BALL_SIZE / 2 > CANVAS_HEIGHT - PADDLE_HEIGHT - 20 &&
          newY - BALL_SIZE / 2 < CANVAS_HEIGHT - 20 &&
          newX > paddle.x &&
          newX < paddle.x + PADDLE_WIDTH) {
        newDy = -Math.abs(newDy);
        
        // Add spin based on hit position
        const hitPos = (newX - paddle.x) / PADDLE_WIDTH;
        newDx = 8 * (hitPos - 0.5);
        
        // Increase speed slightly
        const speed = Math.sqrt(newDx * newDx + newDy * newDy);
        const maxSpeed = 12;
        if (speed < maxSpeed) {
          const speedMultiplier = Math.min(1.05, maxSpeed / speed);
          newDx *= speedMultiplier;
          newDy *= speedMultiplier;
        }
        
        newY = CANVAS_HEIGHT - PADDLE_HEIGHT - 20 - BALL_SIZE / 2;
      }
      
      // Bottom collision (lose life)
      if (newY > CANVAS_HEIGHT) {
        setLives(l => {
          const newLives = l - 1;
          if (newLives <= 0) {
            setGameState('gameOver');
            if (onGameEnd) onGameEnd(score);
          }
          return newLives;
        });
        resetBall();
        return prev;
      }
      
      // Brick collisions
      setBricks(currentBricks => {
        let hit = false;
        const newBricks = currentBricks.map(brick => {
          if (brick.status === 0 || hit) return brick;
          
          if (newX > brick.x &&
              newX < brick.x + BRICK_WIDTH &&
              newY > brick.y &&
              newY < brick.y + BRICK_HEIGHT) {
            hit = true;
            setScore(s => s + brick.points);
            
            // Determine which side was hit
            const ballCenterX = newX;
            const ballCenterY = newY;
            const brickCenterX = brick.x + BRICK_WIDTH / 2;
            const brickCenterY = brick.y + BRICK_HEIGHT / 2;
            
            const dx = ballCenterX - brickCenterX;
            const dy = ballCenterY - brickCenterY;
            
            if (Math.abs(dx) / BRICK_WIDTH > Math.abs(dy) / BRICK_HEIGHT) {
              newDx = -newDx;
            } else {
              newDy = -newDy;
            }
            
            return { ...brick, status: 0 };
          }
          return brick;
        });
        
        // Check if all bricks are destroyed
        const remainingBricks = newBricks.filter(b => b.status === 1);
        if (remainingBricks.length === 0) {
          nextLevel();
        }
        
        return newBricks;
      });
      
      return { x: newX, y: newY, dx: newDx, dy: newDy };
    });
  }, 16);
  
  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw bricks
    bricks.forEach(brick => {
      if (brick.status === 1) {
        ctx.fillStyle = brick.color;
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
        
        // Add brick shine effect
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(brick.x, brick.y, BRICK_WIDTH, 4);
        
        // Brick border
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.strokeRect(brick.x, brick.y, BRICK_WIDTH, BRICK_HEIGHT);
      }
    });
    
    // Draw paddle
    ctx.fillStyle = '#00ff00';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#00ff00';
    ctx.fillRect(paddle.x, CANVAS_HEIGHT - PADDLE_HEIGHT - 20, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Add paddle shine
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fillRect(paddle.x, CANVAS_HEIGHT - PADDLE_HEIGHT - 20, PADDLE_WIDTH, 4);
    
    // Draw ball
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#fff';
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Add ball trail effect
    ctx.shadowBlur = 20;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(ball.x - ball.dx, ball.y - ball.dy, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    
    ctx.shadowBlur = 0;
    
    // Draw UI
    ctx.fillStyle = '#00ff00';
    ctx.font = '20px "Press Start 2P", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 20, 30);
    ctx.fillText(`LIVES: ${lives}`, 20, 55);
    ctx.textAlign = 'right';
    ctx.fillText(`LEVEL: ${level}`, CANVAS_WIDTH - 20, 30);
  }, [paddle, ball, bricks, score, lives, level]);
  
  return (
    <div className="breakout-game">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="breakout-canvas"
      />
      
      {gameState === 'menu' && (
        <div className="game-overlay">
          <div className="menu-content">
            <h2 className="pixel-text">BREAKOUT</h2>
            <p>Break all the bricks!</p>
            <div className="controls-info">
              <p>Mouse - Move Paddle</p>
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

export default Breakout;