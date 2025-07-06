import React, { useState, useEffect, useRef } from 'react';
import './Snake.css';
import useGameLoop from '../hooks/useGameLoop';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SPEED = 150;

const Snake = ({ onGameEnd, soundEnabled }) => {
  const canvasRef = useRef(null);
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [direction, setDirection] = useState({ x: 1, y: 0 });
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
          if (direction.y === 0) {
            setDirection({ x: 0, y: -1 });
          }
          break;
        case 'ArrowDown':
          if (direction.y === 0) {
            setDirection({ x: 0, y: 1 });
          }
          break;
        case 'ArrowLeft':
          if (direction.x === 0) {
            setDirection({ x: -1, y: 0 });
          }
          break;
        case 'ArrowRight':
          if (direction.x === 0) {
            setDirection({ x: 1, y: 0 });
          }
          break;
        case ' ':
          setIsPaused(prev => !prev);
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [direction, gameOver]);

  // Generate random food position
  const generateFood = () => {
    let newFood;
    do {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE)
      };
    } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
    
    return newFood;
  };

  // Game loop
  useGameLoop(() => {
    if (gameOver || isPaused) return;

    setSnake(currentSnake => {
      const newSnake = [...currentSnake];
      const head = { ...newSnake[0] };
      
      // Move head
      head.x += direction.x;
      head.y += direction.y;

      // Check wall collision
      if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
        handleGameOver();
        return currentSnake;
      }

      // Check self collision
      if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
        handleGameOver();
        return currentSnake;
      }

      newSnake.unshift(head);

      // Check food collision
      if (head.x === food.x && head.y === food.y) {
        setScore(prev => prev + 10);
        setFood(generateFood());
        
        // Increase speed every 50 points
        if ((score + 10) % 50 === 0) {
          setSpeed(prev => Math.max(50, prev - 10));
        }
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, speed);

  const handleGameOver = () => {
    setGameOver(true);
    if (onGameEnd) {
      onGameEnd(score);
    }
  };

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = '#111';
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw snake
    snake.forEach((segment, index) => {
      if (index === 0) {
        // Head
        ctx.fillStyle = '#00ff00';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00ff00';
      } else {
        // Body
        ctx.fillStyle = '#00cc00';
        ctx.shadowBlur = 5;
        ctx.shadowColor = '#00cc00';
      }
      
      ctx.fillRect(
        segment.x * CELL_SIZE + 2,
        segment.y * CELL_SIZE + 2,
        CELL_SIZE - 4,
        CELL_SIZE - 4
      );
      
      ctx.shadowBlur = 0;
    });

    // Draw food
    ctx.fillStyle = '#ff0000';
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff0000';
    ctx.beginPath();
    ctx.arc(
      food.x * CELL_SIZE + CELL_SIZE / 2,
      food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;
  }, [snake, food]);

  const restart = () => {
    setSnake([{ x: 10, y: 10 }]);
    setDirection({ x: 1, y: 0 });
    setFood({ x: 15, y: 15 });
    setScore(0);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  return (
    <div className="snake-game">
      <div className="game-header">
        <div className="score-display">Score: {score}</div>
        <div className="game-status">
          {gameOver ? 'GAME OVER' : isPaused ? 'PAUSED' : 'PLAYING'}
        </div>
      </div>
      
      <canvas
        ref={canvasRef}
        width={GRID_SIZE * CELL_SIZE}
        height={GRID_SIZE * CELL_SIZE}
        className="snake-canvas"
      />
      
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h3 className="pixel-text">GAME OVER</h3>
            <p>Final Score: {score}</p>
            <button onClick={restart} className="restart-button">
              Play Again
            </button>
          </div>
        </div>
      )}
      
      {isPaused && !gameOver && (
        <div className="pause-overlay">
          <p className="pixel-text">PAUSED</p>
          <p>Press SPACE to continue</p>
        </div>
      )}
    </div>
  );
};

export default Snake;