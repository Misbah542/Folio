import React, { useState, useEffect } from 'react';
import './App.css';
import Header from './components/Header';
import GameGrid from './components/GameGrid';
import GameModal from './components/GameModal';
import { games } from './games/gamesList';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [highScores, setHighScores] = useState({});
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Load high scores on mount
  useEffect(() => {
    const savedScores = {};
    games.forEach(game => {
      const score = localStorage.getItem(`highScore_${game.id}`);
      if (score) {
        savedScores[game.id] = parseInt(score, 10);
      }
    });
    setHighScores(savedScores);
  }, []);

  // Save high score
  const saveHighScore = (gameId, score) => {
    const currentHigh = highScores[gameId] || 0;
    if (score > currentHigh) {
      const newScores = { ...highScores, [gameId]: score };
      setHighScores(newScores);
      localStorage.setItem(`highScore_${gameId}`, score.toString());
      return true;
    }
    return false;
  };

  // Handle game selection
  const handleGameSelect = (game) => {
    setSelectedGame(game);
    // Track game selection
    if (window.firebaseAnalytics && window.firebaseAnalytics.trackEvent) {
      window.firebaseAnalytics.trackEvent('game_selected', {
        game_id: game.id,
        game_name: game.name
      });
    }
  };

  // Handle game close
  const handleGameClose = () => {
    setSelectedGame(null);
  };

  // Toggle sound
  const toggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  return (
    <div className="app">
      <div className="stars-background"></div>
      <div className="scanlines"></div>
      
      <Header 
        soundEnabled={soundEnabled}
        onToggleSound={toggleSound}
      />
      
      <main className="main-content">
        <div className="container">
          <section className="hero-section">
            <h1 className="hero-title pixel-text">
              <span className="glitch" data-text="RETRO ARCADE">RETRO ARCADE</span>
            </h1>
            <p className="hero-subtitle">Classic Games, Modern Browser</p>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-value">{games.length}</span>
                <span className="stat-label">Games</span>
              </div>
              <div className="stat">
                <span className="stat-value">{Object.keys(highScores).length}</span>
                <span className="stat-label">Records</span>
              </div>
              <div className="stat">
                <span className="stat-value">∞</span>
                <span className="stat-label">Fun</span>
              </div>
            </div>
          </section>

          <GameGrid 
            games={games}
            highScores={highScores}
            onGameSelect={handleGameSelect}
          />
        </div>
      </main>

      {selectedGame && (
        <GameModal
          game={selectedGame}
          highScore={highScores[selectedGame.id] || 0}
          onClose={handleGameClose}
          onHighScore={(score) => saveHighScore(selectedGame.id, score)}
          soundEnabled={soundEnabled}
        />
      )}

      <footer className="footer">
        <div className="footer-content">
          <p>Built with <span className="heart">♥</span> by Misbah</p>
          <div className="footer-links">
            <a href="https://buildwithmisbah.cc">Terminal</a>
            <span className="separator">|</span>
            <a href="https://portfolio.buildwithmisbah.cc">Portfolio</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;