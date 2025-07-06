import React from 'react';
import './GameGrid.css';

const GameGrid = ({ games, highScores, onGameSelect }) => {
  return (
    <section className="game-grid-section">
      <h2 className="section-title pixel-text">Choose Your Game</h2>
      <div className="game-grid">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="game-card"
            onClick={() => onGameSelect(game)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                onGameSelect(game);
              }
            }}
          >
            <div className="game-card-inner">
              <div className="game-icon">{game.icon}</div>
              <h3 className="game-name pixel-text">{game.name}</h3>
              <p className="game-description">{game.description}</p>
              
              <div className="game-meta">
                <div className="difficulty">
                  <span className="label">Difficulty:</span>
                  <div className="difficulty-bars">
                    {[...Array(5)].map((_, i) => (
                      <span 
                        key={i} 
                        className={`bar ${i < game.difficulty ? 'active' : ''}`}
                      />
                    ))}
                  </div>
                </div>
                
                {highScores[game.id] && (
                  <div className="high-score">
                    <span className="label">High Score:</span>
                    <span className="score-value">{highScores[game.id].toLocaleString()}</span>
                  </div>
                )}
              </div>
              
              <div className="play-button">
                <span className="play-text">PLAY NOW</span>
                <span className="play-icon">▶</span>
              </div>
            </div>
            
            <div className="game-card-glow"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameGrid;