import { useEffect, useRef } from 'react';

/**
 * Custom hook for game loops
 * @param {Function} callback - Function to call on each frame
 * @param {number} delay - Delay in milliseconds between frames (null to use requestAnimationFrame)
 */
const useGameLoop = (callback, delay = null) => {
  const savedCallback = useRef();
  const intervalId = useRef();
  const animationId = useRef();

  // Remember the latest callback
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the game loop
  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      // Use setInterval for fixed time steps
      intervalId.current = setInterval(tick, delay);
      return () => clearInterval(intervalId.current);
    } else {
      // Use requestAnimationFrame for smooth animation
      function frame() {
        tick();
        animationId.current = requestAnimationFrame(frame);
      }
      animationId.current = requestAnimationFrame(frame);
      return () => cancelAnimationFrame(animationId.current);
    }
  }, [delay]);
};

export default useGameLoop;