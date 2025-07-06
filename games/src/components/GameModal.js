import React, { useState, useEffect, useRef } from 'react';
import './GameModal.css';

const GameModal = ({ game, onClose, onUpdateHighScore, currentHighScore }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScore, setCurrentScore] = useState(0);
  const [gameState, setGameState] = useState('ready'); // ready, playing, paused, gameOver
  const [isFullscreen, setIsFullscreen] = useState(false);
  const modalRef = useRef(null);
  const gameContainerRef = useRef(null);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && !isFullscreen) {
        onClose();
      }
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('keydown', handleEscape);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [onClose, isFullscreen]);

  useEffect(() => {
    // Initialize game when modal opens
    if (game) {
      initializeGame();
    }
    
    return () => {
      // Cleanup when modal closes
      cleanupGame();
    };
  }, [game]);

  const initializeGame = () => {
    setGameState('ready');
    setCurrentScore(0);
    setIsPlaying(false);
    
    // Load the specific game component
    loadGameComponent();
  };

  const loadGameComponent = () => {
    // This would dynamically load the game component
    // For now, we'll create a placeholder game interface
    if (gameContainerRef.current) {
      gameContainerRef.current.innerHTML = `
        <div class="game-placeholder">
          <div class="game-screen">
            <div class="game-title">${game.name}</div>
            <div class="game-instructions">
              <h3>HOW TO PLAY:</h3>
              <p>${game.instructions || 'Use arrow keys or WASD to move. Press SPACE to start.'}</p>
              <div class="controls-info">
                <strong>Controls:</strong> ${game.controls}
              </div>
            </div>
            <div class="game-stats">
              <div class="stat">
                <span class="label">CURRENT SCORE:</span>
                <span class="value" id="current-score">0</span>
              </div>
              <div class="stat">
                <span class="label">HIGH SCORE:</span>
                <span class="value" id="high-score">${currentHighScore}</span>
              </div>
            </div>
            <button class="start-button" onclick="startGame()">
              ${gameState === 'ready' ? 'START GAME' : 'RESUME'}
            </button>
          </div>
        </div>
      `;
    }
  };

  const startGame = () => {
    setIsPlaying(true);
    setGameState('playing');
    
    // Track game start
    if (window.firebaseAnalytics) {
      window.firebaseAnalytics.trackEvent('game_started', {
        game_name: game.name,
        game_id: game.id
      });
    }
    
    // Here you would start the actual game logic
    simulateGameplay();
  };

  const pauseGame = () => {
    setIsPlaying(false);
    setGameState('paused');
  };

  const resumeGame = () => {
    setIsPlaying(true);
    setGameState('playing');
  };

  const endGame = (finalScore) => {
    setIsPlaying(false);
    setGameState('gameOver');
    
    // Update high score if necessary
    if (finalScore > currentHighScore) {
      onUpdateHighScore(game.id, finalScore);
    }
    
    // Track game end
    if (window.firebaseAnalytics) {
      window.firebaseAnalytics.trackEvent('game_ended', {
        game_name: game.name,
        game_id: game.id,
        final_score: finalScore,
        is_high_score: finalScore > currentHighScore
      });
    }
  };

  const simulateGameplay = () => {
    // This is a placeholder for actual game logic
    // In a real implementation, this would be replaced with the actual game
    let score = 0;
    const gameLoop = setInterval(() => {
      if (gameState === 'playing') {
        score += Math.floor(Math.random() * 10) + 1;
        setCurrentScore(score);
        
        // Update score display
        const scoreElement = document.getElementById('current-score');
        if (scoreElement) {
          scoreElement.textContent = score;
        }
        
        // Simulate game over after random time
        if (Math.random() < 0.01) { // 1% chance each tick
          endGame(score);
          clearInterval(gameLoop);
        }
      }
    }, 100);
    
    // Store interval for cleanup
    window.currentGameLoop = gameLoop;
  };

  const cleanupGame = () => {
    if (window.currentGameLoop) {
      clearInterval(window.currentGameLoop);
      window.currentGameLoop = null;
    }
  };

  const toggleFullscreen = async () => {
    if (!isFullscreen) {
      try {
        await modalRef.current.requestFullscreen();
      } catch (err) {
        console.error('Error attempting to enable fullscreen:', err);
      }
    } else {
      try {
        await document.exitFullscreen();
      } catch (err) {
        console.error('Error attempting to exit fullscreen:', err);
      }
    }
  };

  const handleModalClick = (e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  };

  // Make functions available globally for the placeholder game
  window.startGame = startGame;
  window.pauseGame = pauseGame;
  window.resumeGame = resumeGame;

  return (
    <div
      ref={modalRef}
      className={`game-modal ${isFullscreen ? 'fullscreen' : ''}`}
      onClick={handleModalClick}
    >
      <div className="modal-content">
        <div className="modal-header">
          <div className="game-info">
            <h2 className="modal-title">{game.name}</h2>
            <div className="game-status">
              <span className={`status-indicator ${gameState}`}>
                {gameState.toUpperCase()}
              </span>
            </div>
          </div>
          
          <div className="modal-controls">
            <button
              className="control-button"
              onClick={toggleFullscreen}
              title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
            >
              {isFullscreen ? '⊡' : '⊞'}
            </button>
            
            {isPlaying && (
              <button
                className="control-button"
                onClick={pauseGame}
                title="Pause Game"
              >
                ⏸
              </button>
            )}
            
            {!isPlaying && gameState === 'paused' && (
              <button
                className="control-button"
                onClick={resumeGame}
                title="Resume Game"
              >
                ▶
              </button>
            )}
            
            <button
              className="control-button close-button"
              onClick={onClose}
              title="Close Game"
            >
              ✕
            </button>
          </div>
        </div>
        
        <div className="modal-body">
          <div
            ref={gameContainerRef}
            className="game-container"
            id="game-container"
          >
            {/* Game will be loaded here */}
          </div>
        </div>
        
        <div className="modal-footer">
          <div className="footer-stats">
            <div className="stat-group">
              <span className="stat-label">DIFFICULTY:</span>
              <div className="difficulty-display">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`difficulty-dot ${i < game.difficulty ? 'active' : ''}`}
                  />
                ))}
              </div>
            </div>
            
            <div className="stat-group">
              <span className="stat-label">CONTROLS:</span>
              <span className="stat-value">{game.controls}</span>
            </div>
          </div>
          
          <div className="footer-actions">
            <button
              className="action-button reset-button"
              onClick={() => {
                cleanupGame();
                initializeGame();
              }}
            >
              RESET
            </button>
            
            <button
              className="action-button close-button"
              onClick={onClose}
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameModal;