import React, { useState, useEffect } from 'react';
import { gamesList } from '../games/gamesList';
import './GameGrid.css';

const GameGrid = ({ onGameSelect, highScores }) => {
  const [hoveredGame, setHoveredGame] = useState(null);
  const [loadedImages, setLoadedImages] = useState({});

  useEffect(() => {
    // Preload game images
    gamesList.forEach(game => {
      const img = new Image();
      img.onload = () => {
        setLoadedImages(prev => ({ ...prev, [game.id]: true }));
      };
      img.src = game.image;
    });
  }, []);

  const handleGameClick = (game) => {
    onGameSelect(game);
    
    // Add click effect
    const gameCard = document.getElementById(`game-${game.id}`);
    if (gameCard) {
      gameCard.classList.add('clicked');
      setTimeout(() => gameCard.classList.remove('clicked'), 200);
    }
  };

  const handleGameHover = (gameId) => {
    setHoveredGame(gameId);
    
    // Track hover for analytics
    if (window.firebaseAnalytics) {
      window.firebaseAnalytics.trackEvent('game_hover', {
        game_id: gameId
      });
    }
  };

  const formatScore = (score) => {
    if (score >= 1000000) {
      return `${(score / 1000000).toFixed(1)}M`;
    } else if (score >= 1000) {
      return `${(score / 1000).toFixed(1)}K`;
    }
    return score.toString();
  };

  return (
    <div className="game-grid-container">
      <div className="grid-header">
        <h2 className="grid-title">SELECT GAME</h2>
        <div className="grid-stats">
          <span className="stat-item">
            <span className="stat-label">GAMES:</span>
            <span className="stat-value">{gamesList.length}</span>
          </span>
          <span className="stat-item">
            <span className="stat-label">SCORES:</span>
            <span className="stat-value">{Object.keys(highScores).length}</span>
          </span>
        </div>
      </div>

      <div className="games-grid">
        {gamesList.map((game) => (
          <div
            key={game.id}
            id={`game-${game.id}`}
            className={`game-card ${hoveredGame === game.id ? 'hovered' : ''}`}
            onClick={() => handleGameClick(game)}
            onMouseEnter={() => handleGameHover(game.id)}
            onMouseLeave={() => setHoveredGame(null)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                handleGameClick(game);
              }
            }}
            aria-label={`Play ${game.name}`}
          >
            <div className="game-image-container">
              <img
                src={game.image}
                alt={game.name}
                className={`game-image ${loadedImages[game.id] ? 'loaded' : ''}`}
                loading="lazy"
              />
              <div className="image-overlay">
                <div className="play-button">
                  <span>PLAY</span>
                </div>
              </div>
            </div>
            
            <div className="game-info">
              <h3 className="game-title">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              
              <div className="game-stats">
                <div className="stat">
                  <span className="stat-label">DIFFICULTY:</span>
                  <div className="difficulty-bar">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`difficulty-dot ${i < game.difficulty ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="stat">
                  <span className="stat-label">HIGH SCORE:</span>
                  <span className="stat-value high-score">
                    {highScores[game.id] ? formatScore(highScores[game.id]) : '0'}
                  </span>
                </div>
              </div>
              
              <div className="game-controls">
                <span className="controls-text">CONTROLS: {game.controls}</span>
              </div>
            </div>
            
            <div className="card-border"></div>
            <div className="card-glow"></div>
          </div>
        ))}
      </div>
      
      <div className="grid-footer">
        <div className="footer-tip">
          <span className="tip-icon">💡</span>
          <span>Click any game to start playing! High scores are saved locally.</span>
        </div>
      </div>
    </div>
  );
};

export default GameGrid;