import { useState, useEffect } from 'react';

/**
 * Custom hook for keyboard input handling
 * Returns an object with pressed keys as boolean values
 */
const useKeyboard = () => {
  const [keys, setKeys] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      setKeys(prevKeys => ({
        ...prevKeys,
        [e.key]: true,
        [e.key.toLowerCase()]: true
      }));
    };

    const handleKeyUp = (e) => {
      setKeys(prevKeys => ({
        ...prevKeys,
        [e.key]: false,
        [e.key.toLowerCase()]: false
      }));
    };

    // Add event listeners
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Cleanup
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return keys;
};

export default useKeyboard;