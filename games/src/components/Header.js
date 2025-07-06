import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ onResetScores }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleResetScores = () => {
    if (showResetConfirm) {
      onResetScores();
      setShowResetConfirm(false);
    } else {
      setShowResetConfirm(true);
      setTimeout(() => setShowResetConfirm(false), 3000);
    }
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-left">
          <h1 className="title">
            <span className="title-main">RETRO</span>
            <span className="title-sub">GAMES</span>
          </h1>
          <p className="subtitle">Classic Pixel Adventures</p>
        </div>
        
        <div className="header-center">
          <div className="arcade-display">
            <div className="display-line">
              <span className="label">TIME:</span>
              <span className="value">{formatTime(currentTime)}</span>
            </div>
            <div className="display-line">
              <span className="label">SYSTEM:</span>
              <span className="value">ONLINE</span>
            </div>
          </div>
        </div>
        
        <div className="header-right">
          <nav className="nav-menu">
            <a 
              href="https://misbahwebsite.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link"
            >
              TERMINAL
            </a>
            <a 
              href="https://portfolio.misbahwebsite.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="nav-link"
            >
              PORTFOLIO
            </a>
          </nav>
          
          <button 
            className={`reset-button ${showResetConfirm ? 'confirm' : ''}`}
            onClick={handleResetScores}
            title={showResetConfirm ? "Click again to confirm" : "Reset all high scores"}
          >
            {showResetConfirm ? 'CONFIRM?' : 'RESET'}
          </button>
        </div>
      </div>
      
      <div className="header-decoration">
        <div className="scan-line"></div>
        <div className="pixel-border"></div>
      </div>
    </header>
  );
};

export default Header;