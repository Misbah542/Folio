import React, { useState, useEffect, useRef, useCallback } from 'react';
import './Tetris.css';
import useGameLoop from '../hooks/useGameLoop';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const CELL_SIZE = 25; // Reduced from 30 to 25
const INITIAL_SPEED = 800;

// Tetris piece definitions
const PIECES = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ],
    color: '#00ffff'
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: '#ffff00'
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: '#800080'
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: '#00ff00'
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: '#ff0000'
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: '#0000ff'
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: '#ffa500'
  }
};

const PIECE_TYPES = Object.keys(PIECES);

const Tetris = ({ onGameEnd, soundEnabled }) => {
  const canvasRef = useRef(null);
  const nextPieceCanvasRef = useRef(null);
  
  const [board, setBoard] = useState(() => 
    Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0))
  );
  
  const [currentPiece, setCurrentPiece] = useState(null);
  const [nextPiece, setNextPiece] = useState(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [dropTime, setDropTime] = useState(0);

  // Generate random piece
  const generatePiece = useCallback(() => {
    const type = PIECE_TYPES[Math.floor(Math.random() * PIECE_TYPES.length)];
    return {
      type,
      shape: PIECES[type].shape,
      color: PIECES[type].color,
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(PIECES[type].shape[0].length / 2),
      y: 0
    };
  }, []);

  // Initialize game
  useEffect(() => {
    if (!currentPiece) {
      setCurrentPiece(generatePiece());
    }
    if (!nextPiece) {
      setNextPiece(generatePiece());
    }
  }, [currentPiece, nextPiece, generatePiece]);

  // Rotate piece
  const rotatePiece = (piece) => {
    const rotated = piece.shape[0].map((_, index) =>
      piece.shape.map(row => row[index]).reverse()
    );
    return { ...piece, shape: rotated };
  };

  // Check collision
  const checkCollision = (piece, board, { x: dx = 0, y: dy = 0 } = {}) => {
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const newX = piece.x + x + dx;
          const newY = piece.y + y + dy;
          
          if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
            return true;
          }
          if (newY >= 0 && board[newY][newX] !== 0) {
            return true;
          }
        }
      }
    }
    return false;
  };

  // Merge piece to board
  const mergePiece = (piece, board) => {
    const newBoard = board.map(row => [...row]);
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] !== 0) {
          const boardY = piece.y + y;
          const boardX = piece.x + x;
          if (boardY >= 0) {
            newBoard[boardY][boardX] = piece.color;
          }
        }
      }
    }
    
    return newBoard;
  };

  // Clear completed lines
  const clearLines = (board) => {
    const newBoard = board.filter(row => row.some(cell => cell === 0));
    const linesCleared = BOARD_HEIGHT - newBoard.length;
    
    while (newBoard.length < BOARD_HEIGHT) {
      newBoard.unshift(Array(BOARD_WIDTH).fill(0));
    }
    
    return { board: newBoard, linesCleared };
  };

  // Move piece
  const movePiece = (dx, dy) => {
    if (!currentPiece || gameOver || isPaused) return false;
    
    if (!checkCollision(currentPiece, board, { x: dx, y: dy })) {
      setCurrentPiece(prev => ({
        ...prev,
        x: prev.x + dx,
        y: prev.y + dy
      }));
      return true;
    }
    return false;
  };

  // Drop piece
  const dropPiece = () => {
    if (!currentPiece || gameOver || isPaused) return;
    
    if (!movePiece(0, 1)) {
      // Piece landed
      if (currentPiece.y <= 0) {
        // Game over
        setGameOver(true);
        if (onGameEnd) {
          onGameEnd(score);
        }
        return;
      }
      
      // Merge piece to board
      const newBoard = mergePiece(currentPiece, board);
      
      // Clear lines
      const { board: clearedBoard, linesCleared } = clearLines(newBoard);
      
      setBoard(clearedBoard);
      setCurrentPiece(nextPiece);
      setNextPiece(generatePiece());
      
      if (linesCleared > 0) {
        const points = [0, 40, 100, 300, 1200][linesCleared] * level;
        setScore(prev => prev + points);
        setLines(prev => prev + linesCleared);
        
        // Increase level every 10 lines
        const newLevel = Math.floor((lines + linesCleared) / 10) + 1;
        if (newLevel > level) {
          setLevel(newLevel);
          setSpeed(prev => Math.max(50, prev - 50));
        }
      }
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (gameOver) return;
      
      const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      
      if (keys.includes(e.key)) {
        e.preventDefault();
      }
      
      switch (e.key) {
        case 'ArrowLeft':
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          dropPiece();
          break;
        case 'ArrowUp':
          if (currentPiece) {
            const rotated = rotatePiece(currentPiece);
            if (!checkCollision(rotated, board)) {
              setCurrentPiece(rotated);
            }
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
  }, [currentPiece, board, gameOver, isPaused]);

  // Game loop
  useGameLoop(() => {
    if (gameOver || isPaused) return;
    
    const now = Date.now();
    if (now - dropTime > speed) {
      dropPiece();
      setDropTime(now);
    }
  }, 16); // 60 FPS

  // Draw game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const canvasWidth = BOARD_WIDTH * CELL_SIZE;
    const canvasHeight = BOARD_HEIGHT * CELL_SIZE;
    
    // Set canvas size
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    
    // Clear canvas
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);

    // Draw board
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      for (let x = 0; x < BOARD_WIDTH; x++) {
        if (board[y][x] !== 0) {
          ctx.fillStyle = board[y][x];
          ctx.fillRect(
            x * CELL_SIZE + 1,
            y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            CELL_SIZE - 2
          );
          
          // Add shine effect
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(
            x * CELL_SIZE + 1,
            y * CELL_SIZE + 1,
            CELL_SIZE - 2,
            3
          );
        }
      }
    }

    // Draw current piece
    if (currentPiece) {
      ctx.fillStyle = currentPiece.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = currentPiece.color;
      
      for (let y = 0; y < currentPiece.shape.length; y++) {
        for (let x = 0; x < currentPiece.shape[y].length; x++) {
          if (currentPiece.shape[y][x] !== 0) {
            const drawX = (currentPiece.x + x) * CELL_SIZE + 1;
            const drawY = (currentPiece.y + y) * CELL_SIZE + 1;
            
            if (drawY >= 0) {
              ctx.fillRect(drawX, drawY, CELL_SIZE - 2, CELL_SIZE - 2);
              
              // Add shine effect
              ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
              ctx.fillRect(drawX, drawY, CELL_SIZE - 2, 3);
              ctx.fillStyle = currentPiece.color;
            }
          }
        }
      }
      
      ctx.shadowBlur = 0;
    }

    // Draw grid
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    for (let x = 0; x <= BOARD_WIDTH; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, canvasHeight);
      ctx.stroke();
    }
    for (let y = 0; y <= BOARD_HEIGHT; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(canvasWidth, y * CELL_SIZE);
      ctx.stroke();
    }
  }, [board, currentPiece]);

  // Draw next piece
  useEffect(() => {
    const canvas = nextPieceCanvasRef.current;
    if (!canvas || !nextPiece) return;

    const ctx = canvas.getContext('2d');
    canvas.width = 100;
    canvas.height = 70;
    
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const cellSize = 12;
    const offsetX = (canvas.width - nextPiece.shape[0].length * cellSize) / 2;
    const offsetY = (canvas.height - nextPiece.shape.length * cellSize) / 2;

    ctx.fillStyle = nextPiece.color;
    ctx.shadowBlur = 6;
    ctx.shadowColor = nextPiece.color;

    for (let y = 0; y < nextPiece.shape.length; y++) {
      for (let x = 0; x < nextPiece.shape[y].length; x++) {
        if (nextPiece.shape[y][x] !== 0) {
          const drawX = offsetX + x * cellSize;
          const drawY = offsetY + y * cellSize;
          
          ctx.fillRect(drawX, drawY, cellSize - 1, cellSize - 1);
          
          // Add shine effect
          ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.fillRect(drawX, drawY, cellSize - 1, 2);
          ctx.fillStyle = nextPiece.color;
        }
      }
    }

    ctx.shadowBlur = 0;
  }, [nextPiece]);

  const restart = () => {
    setBoard(Array(BOARD_HEIGHT).fill().map(() => Array(BOARD_WIDTH).fill(0)));
    setCurrentPiece(null);
    setNextPiece(null);
    setScore(0);
    setLines(0);
    setLevel(1);
    setGameOver(false);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
    setDropTime(0);
  };

  return (
    <div className="tetris-game">
      <div className="tetris-container">
        <div className="game-board-container">
          <canvas
            ref={canvasRef}
            className="tetris-board"
            style={{
              width: `${BOARD_WIDTH * CELL_SIZE}px`,
              height: `${BOARD_HEIGHT * CELL_SIZE}px`
            }}
          />
          
          <div className="level-indicator">
            Level {level}
          </div>
          
          {!gameOver && !isPaused && (
            <div className="game-status">PLAYING</div>
          )}
          
          {isPaused && !gameOver && (
            <div className="game-status paused">PAUSED</div>
          )}
        </div>
        
        <div className="game-info">
          <div className="info-panel">
            <h3>Score</h3>
            <div className="score-info">
              <div className="score-item">
                <span>Points:</span>
                <span className="score-value">{score}</span>
              </div>
              <div className="score-item">
                <span>Lines:</span>
                <span className="score-value">{lines}</span>
              </div>
              <div className="score-item">
                <span>Level:</span>
                <span className="score-value">{level}</span>
              </div>
            </div>
          </div>
          
          <div className="info-panel">
            <h3>Next Piece</h3>
            <canvas
              ref={nextPieceCanvasRef}
              className="next-piece-canvas"
            />
          </div>
          
          <div className="info-panel">
            <h4>Controls</h4>
            <div className="controls-grid">
              <div className="control-item">
                <span>Move:</span>
                <span className="control-key">←→</span>
              </div>
              <div className="control-item">
                <span>Rotate:</span>
                <span className="control-key">↑</span>
              </div>
              <div className="control-item">
                <span>Drop:</span>
                <span className="control-key">↓</span>
              </div>
              <div className="control-item">
                <span>Pause:</span>
                <span className="control-key">Space</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {gameOver && (
        <div className="game-over-overlay">
          <div className="game-over-content">
            <h3 className="pixel-text">GAME OVER</h3>
            <p>Final Score: {score}</p>
            <p>Lines Cleared: {lines}</p>
            <p>Level Reached: {level}</p>
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

export default Tetris;