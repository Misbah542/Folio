import React, { useEffect, useRef, useState } from 'react';
import './GameModal.css';
import Snake from '../games/Snake.js';

const GameModal = ({ game, highScore, onClose, onHighScore, soundEnabled }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [gameScore, setGameScore] = useState(0);
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const gameContainerRef = useRef(null);

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Load game after a brief delay
    const loadTimer = setTimeout(() => {
      setIsLoading(false);
      initializeGame();
    }, 1000);

    // Handle escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);

    return () => {
      document.body.style.overflow = 'unset';
      clearTimeout(loadTimer);
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const initializeGame = () => {
    // Initialize the selected game
    // This would normally load the actual game component
    console.log(`Loading ${game.name}...`);
    
    // Track game start
    if (window.firebaseAnalytics && window.firebaseAnalytics.trackEvent) {
      window.firebaseAnalytics.trackEvent('game_start', {
        game_id: game.id,
        game_name: game.name
      });
    }
  };

  const handleGameEnd = (score) => {
    setGameScore(score);
    const newHighScore = onHighScore(score);
    setIsNewHighScore(newHighScore);
    
    // Track game end
    if (window.firebaseAnalytics && window.firebaseAnalytics.trackEvent) {
      window.firebaseAnalytics.trackEvent('game_end', {
        game_id: game.id,
        game_name: game.name,
        score: score,
        is_high_score: newHighScore
      });
    }
  };

  const handleRestart = () => {
    setGameScore(0);
    setIsNewHighScore(false);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      initializeGame();
    }, 500);
  };

  return (
    <div className="game-modal-overlay" onClick={onClose}>
      <div className="game-modal" onClick={(e) => e.stopPropagation()}>
        <div className="game-modal-header">
          <h2 className="game-modal-title pixel-text">{game.name}</h2>
          <div className="game-modal-controls">
            <button 
              className="control-btn"
              onClick={handleRestart}
              title="Restart Game"
            >
              🔄
            </button>
            <button 
              className="control-btn"
              onClick={() => {/* Toggle fullscreen */}}
              title="Fullscreen"
            >
              ⛶
            </button>
            <button 
              className="control-btn close-btn"
              onClick={onClose}
              title="Close Game"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="game-modal-info">
          <div className="info-item">
            <span className="info-label">Score:</span>
            <span className="info-value">{gameScore.toLocaleString()}</span>
          </div>
          <div className="info-item">
            <span className="info-label">High Score:</span>
            <span className="info-value high-score-value">
              {Math.max(highScore, gameScore).toLocaleString()}
            </span>
          </div>
          <div className="info-item">
            <span className="info-label">Sound:</span>
            <span className="info-value">{soundEnabled ? '🔊' : '🔇'}</span>
          </div>
        </div>

        <div className="game-container" ref={gameContainerRef}>
          {isLoading ? (
            <div className="game-loading">
              <div className="loading-icon">{game.icon}</div>
              <p className="loading-text pixel-text">Loading {game.name}...</p>
              <div className="loading-bar">
                <div className="loading-progress"></div>
              </div>
            </div>
          ) : (
            <div className="game-placeholder">
              {/* This is where the actual game component would be rendered */}
              <div className="placeholder-content">
              {game.id === 'snake' && (
  <Snake onGameEnd={handleGameEnd} soundEnabled={soundEnabled} />
)}
                <p className="controls-hint">
                  Use {game.controls || 'arrow keys'} to play
                </p>
              </div>
            </div>
          )}

          {isNewHighScore && (
            <div className="new-high-score-overlay">
              <div className="high-score-content">
                <h3 className="pixel-text">NEW HIGH SCORE!</h3>
                <p className="score-display">{gameScore.toLocaleString()}</p>
                <button className="play-again-btn" onClick={handleRestart}>
                  Play Again
                </button>
              </div>
            </div>
          )}
        </div>


        
        {isLoading && ( <div className="game-instructions">
          <h4>How to Play:</h4>
          <p>{game.instructions}</p>
          <div className="controls">
            <span className="control-key">↑↓←→</span>
            <span className="control-desc">Move</span>
            {game.additionalControls && (
              <>
                <span className="control-key">{game.additionalControls.key}</span>
                <span className="control-desc">{game.additionalControls.desc}</span>
              </>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default GameModal;