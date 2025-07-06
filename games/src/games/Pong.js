import React, { useState, useEffect, useRef } from 'react';
import './Pong.css';
import useGameLoop from '../hooks/useGameLoop';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 80;
const BALL_SIZE = 10;
const PADDLE_SPEED = 6;
const INITIAL_BALL_SPEED = 5;
const MAX_BALL_SPEED = 12;
const WINNING_SCORE = 10;

const Pong = ({ onGameEnd, soundEnabled }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('menu'); // menu, playing, paused, gameOver
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [winner, setWinner] = useState(null);
  
  // Game objects
  const [player, setPlayer] = useState({
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    dy: 0
  });
  
  const [ai, setAi] = useState({
    y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2,
    dy: 0
  });
  
  const [ball, setBall] = useState({
    x: CANVAS_WIDTH / 2,
    y: CANVAS_HEIGHT / 2,
    dx: INITIAL_BALL_SPEED,
    dy: (Math.random() - 0.5) * INITIAL_BALL_SPEED
  });
  
  const keysPressed = useRef({});
  
  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault();
      }
      keysPressed.current[e.key] = true;
      
      if (e.key === ' ') {
        if (gameState === 'playing') {
          setGameState('paused');
        } else if (gameState === 'paused') {
          setGameState('playing');
        } else if (gameState === 'menu') {
          startGame();
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
    resetBall();
  };
  
  const resetGame = () => {
    setPlayerScore(0);
    setAiScore(0);
    setWinner(null);
    setGameState('menu');
    resetBall();
    setPlayer({ y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2, dy: 0 });
    setAi({ y: CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2, dy: 0 });
  };
  
  const resetBall = () => {
    setBall({
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT / 2,
      dx: (Math.random() > 0.5 ? 1 : -1) * INITIAL_BALL_SPEED,
      dy: (Math.random() - 0.5) * INITIAL_BALL_SPEED
    });
  };
  
  // Game loop
  useGameLoop(() => {
    if (gameState !== 'playing') return;
    
    // Update player paddle
    setPlayer(prev => {
      let newY = prev.y;
      
      if (keysPressed.current['ArrowUp'] || keysPressed.current['w']) {
        newY = Math.max(0, prev.y - PADDLE_SPEED);
      }
      if (keysPressed.current['ArrowDown'] || keysPressed.current['s']) {
        newY = Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, prev.y + PADDLE_SPEED);
      }
      
      return { ...prev, y: newY };
    });
    
    // Update AI paddle
    setAi(prev => {
      const aiCenter = prev.y + PADDLE_HEIGHT / 2;
      const ballY = ball.y;
      const diff = ballY - aiCenter;
      const maxSpeed = PADDLE_SPEED * 0.8; // AI is slightly slower
      
      let newY = prev.y;
      if (Math.abs(diff) > 5) {
        const speed = Math.min(maxSpeed, Math.abs(diff) * 0.1);
        newY = prev.y + (diff > 0 ? speed : -speed);
        newY = Math.max(0, Math.min(CANVAS_HEIGHT - PADDLE_HEIGHT, newY));
      }
      
      return { ...prev, y: newY };
    });
    
    // Update ball
    setBall(prev => {
      let newX = prev.x + prev.dx;
      let newY = prev.y + prev.dy;
      let newDx = prev.dx;
      let newDy = prev.dy;
      
      // Top and bottom wall collision
      if (newY <= BALL_SIZE / 2 || newY >= CANVAS_HEIGHT - BALL_SIZE / 2) {
        newDy = -newDy;
        newY = newY <= BALL_SIZE / 2 ? BALL_SIZE / 2 : CANVAS_HEIGHT - BALL_SIZE / 2;
      }
      
      // Player paddle collision
      if (newX - BALL_SIZE / 2 <= 30 + PADDLE_WIDTH &&
          newX + BALL_SIZE / 2 >= 30 &&
          newY >= player.y &&
          newY <= player.y + PADDLE_HEIGHT) {
        newDx = Math.abs(newDx);
        
        // Add spin based on where ball hits paddle
        const hitPos = (newY - player.y) / PADDLE_HEIGHT;
        newDy = (hitPos - 0.5) * 10;
        
        // Increase speed slightly
        newDx = Math.min(newDx * 1.05, MAX_BALL_SPEED);
        
        newX = 30 + PADDLE_WIDTH + BALL_SIZE / 2;
      }
      
      // AI paddle collision
      if (newX + BALL_SIZE / 2 >= CANVAS_WIDTH - 30 - PADDLE_WIDTH &&
          newX - BALL_SIZE / 2 <= CANVAS_WIDTH - 30 &&
          newY >= ai.y &&
          newY <= ai.y + PADDLE_HEIGHT) {
        newDx = -Math.abs(newDx);
        
        // Add spin
        const hitPos = (newY - ai.y) / PADDLE_HEIGHT;
        newDy = (hitPos - 0.5) * 10;
        
        // Increase speed
        newDx = Math.max(newDx * 1.05, -MAX_BALL_SPEED);
        
        newX = CANVAS_WIDTH - 30 - PADDLE_WIDTH - BALL_SIZE / 2;
      }
      
      // Score
      if (newX < 0) {
        setAiScore(prev => {
          const newScore = prev + 1;
          if (newScore >= WINNING_SCORE) {
            setGameState('gameOver');
            setWinner('AI');
            if (onGameEnd) onGameEnd(playerScore);
          }
          return newScore;
        });
        resetBall();
        return ball;
      }
      
      if (newX > CANVAS_WIDTH) {
        setPlayerScore(prev => {
          const newScore = prev + 1;
          if (newScore >= WINNING_SCORE) {
            setGameState('gameOver');
            setWinner('Player');
            if (onGameEnd) onGameEnd(playerScore);
          }
          return newScore;
        });
        resetBall();
        return ball;
      }
      
      return { x: newX, y: newY, dx: newDx, dy: newDy };
    });
  }, 16); // 60 FPS
  
  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Draw center line
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    ctx.beginPath();
    ctx.moveTo(CANVAS_WIDTH / 2, 0);
    ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
    ctx.stroke();
    ctx.setLineDash([]);
    
    // Draw paddles
    ctx.fillStyle = '#00ff00';
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#00ff00';
    
    // Player paddle
    ctx.fillRect(30, player.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // AI paddle
    ctx.fillRect(CANVAS_WIDTH - 30 - PADDLE_WIDTH, ai.y, PADDLE_WIDTH, PADDLE_HEIGHT);
    
    // Draw ball
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, BALL_SIZE / 2, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.shadowBlur = 0;
    
    // Draw scores
    ctx.font = '48px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#00ff00';
    
    ctx.fillText(playerScore, CANVAS_WIDTH / 4, 60);
    ctx.fillText(aiScore, CANVAS_WIDTH * 3 / 4, 60);
    
    // Draw player labels
    ctx.font = '14px "Press Start 2P", monospace';
    ctx.fillText('PLAYER', CANVAS_WIDTH / 4, 90);
    ctx.fillText('AI', CANVAS_WIDTH * 3 / 4, 90);
  }, [player, ai, ball, playerScore, aiScore]);
  
  return (
    <div className="pong-game">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="pong-canvas"
      />
      
      {gameState === 'menu' && (
        <div className="game-overlay">
          <div className="menu-content">
            <h2 className="pixel-text">PONG</h2>
            <p>First to {WINNING_SCORE} wins!</p>
            <div className="controls-info">
              <p>↑/↓ or W/S - Move Paddle</p>
              <p>SPACE - Start/Pause</p>
            </div>
            <button onClick={startGame} className="start-button">
              PRESS SPACE TO START
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
            <h2 className="pixel-text">{winner} WINS!</h2>
            <p className="final-score">
              {playerScore} - {aiScore}
            </p>
            <button onClick={resetGame} className="restart-button">
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pong;