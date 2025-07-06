import React, { useState, useEffect } from 'react';
import './Header.css';

const Header = ({ soundEnabled, onToggleSound }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="header-left">
          <a href="/" className="logo">
            <span className="logo-icon">🎮</span>
            <span className="logo-text pixel-text">RETRO GAMES</span>
          </a>
        </div>

        <nav className="header-nav">
          <a href="https://misbah-terminal.onrender.com/" className="nav-link">
            <span className="nav-icon">💻</span>
            <span className="nav-text">Terminal</span>
          </a>
          <a href="https://misbah-portfolio.onrender.com" className="nav-link">
            <span className="nav-icon">💼</span>
            <span className="nav-text">Portfolio</span>
          </a>
          <button 
            className={`sound-toggle ${soundEnabled ? 'on' : 'off'}`}
            onClick={onToggleSound}
            aria-label="Toggle sound"
          >
            <span className="sound-icon">{soundEnabled ? '🔊' : '🔇'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;