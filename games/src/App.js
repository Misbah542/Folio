import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import GameGrid from './components/GameGrid';
import GameModal from './components/GameModal';
import './App.css';

function App() {
  const [selectedGame, setSelectedGame] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [highScores, setHighScores] = useState({});

  // Load high scores from localStorage on component mount
  useEffect(() => {
    const savedScores = localStorage.getItem('retro-games-scores');
    if (savedScores) {
      setHighScores(JSON.parse(savedScores));
    }
  }, []);

  // Save high scores to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('retro-games-scores', JSON.stringify(highScores));
  }, [highScores]);

  const handleGameSelect = (game) => {
    setSelectedGame(game);
    setIsModalOpen(true);
    
    // Track game selection
    if (window.firebaseAnalytics) {
      window.firebaseAnalytics.trackEvent('game_selected', {
        game_name: game.name,
        game_id: game.id
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const updateHighScore = (gameId, score) => {
    setHighScores(prev => ({
      ...prev,
      [gameId]: Math.max(prev[gameId] || 0, score)
    }));
    
    // Track high score
    if (window.firebaseAnalytics) {
      window.firebaseAnalytics.trackEvent('high_score_achieved', {
        game_id: gameId,
        score: score,
        is_new_record: score > (highScores[gameId] || 0)
      });
    }
  };

  const resetAllScores = () => {
    setHighScores({});
    localStorage.removeItem('retro-games-scores');
    
    // Track score reset
    if (window.firebaseAnalytics) {
      window.firebaseAnalytics.trackEvent('scores_reset');
    }
  };

  return (
    <div className="App">
      <Header onResetScores={resetAllScores} />
      
      <main className="main-content">
        <GameGrid 
          onGameSelect={handleGameSelect} 
          highScores={highScores}
        />
      </main>
      
      {isModalOpen && selectedGame && (
        <GameModal
          game={selectedGame}
          onClose={handleCloseModal}
          onUpdateHighScore={updateHighScore}
          currentHighScore={highScores[selectedGame.id] || 0}
        />
      )}
      
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 Misbah ul Haque. All rights reserved.</p>
          <div className="footer-links">
            <a href="https://misbahwebsite.com" target="_blank" rel="noopener noreferrer">
              Terminal
            </a>
            <a href="https://portfolio.misbahwebsite.com" target="_blank" rel="noopener noreferrer">
              Portfolio
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;