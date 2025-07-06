import { useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for game loop management
 * Provides a consistent game loop with requestAnimationFrame
 * 
 * @param {Function} callback - Function to call on each frame
 * @param {boolean} isRunning - Whether the game loop should be running
 * @param {number} targetFPS - Target frames per second (default: 60)
 */
const useGameLoop = (callback, isRunning = true, targetFPS = 60) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const frameInterval = 1000 / targetFPS;

  const animate = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      
      // Only call callback if enough time has passed for target FPS
      if (deltaTime >= frameInterval) {
        callback(deltaTime);
        previousTimeRef.current = time;
      }
    } else {
      previousTimeRef.current = time;
    }
    
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
  }, [callback, isRunning, frameInterval]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [animate, isRunning]);

  // Reset timer when starting/stopping
  useEffect(() => {
    previousTimeRef.current = undefined;
  }, [isRunning]);

  return {
    start: () => {
      if (!isRunning) {
        previousTimeRef.current = undefined;
        requestRef.current = requestAnimationFrame(animate);
      }
    },
    stop: () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
  };
};

/**
 * Alternative game loop hook with fixed time step
 * Better for games that need consistent physics/logic updates
 * 
 * @param {Function} updateCallback - Function to call for game updates
 * @param {Function} renderCallback - Function to call for rendering
 * @param {boolean} isRunning - Whether the game loop should be running
 * @param {number} targetUPS - Target updates per second (default: 60)
 */
export const useFixedGameLoop = (updateCallback, renderCallback, isRunning = true, targetUPS = 60) => {
  const requestRef = useRef();
  const previousTimeRef = useRef();
  const lagRef = useRef(0);
  const updateInterval = 1000 / targetUPS;

  const gameLoop = useCallback((time) => {
    if (previousTimeRef.current !== undefined) {
      const deltaTime = time - previousTimeRef.current;
      lagRef.current += deltaTime;

      // Update game logic in fixed steps
      while (lagRef.current >= updateInterval) {
        updateCallback(updateInterval);
        lagRef.current -= updateInterval;
      }

      // Render with interpolation factor
      const interpolation = lagRef.current / updateInterval;
      renderCallback(interpolation);
    }
    
    previousTimeRef.current = time;
    
    if (isRunning) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [updateCallback, renderCallback, isRunning, updateInterval]);

  useEffect(() => {
    if (isRunning) {
      requestRef.current = requestAnimationFrame(gameLoop);
    } else {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
    
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [gameLoop, isRunning]);

  // Reset timer when starting/stopping
  useEffect(() => {
    previousTimeRef.current = undefined;
    lagRef.current = 0;
  }, [isRunning]);

  return {
    start: () => {
      if (!isRunning) {
        previousTimeRef.current = undefined;
        lagRef.current = 0;
        requestRef.current = requestAnimationFrame(gameLoop);
      }
    },
    stop: () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    }
  };
};

/**
 * Simple interval-based game loop (less smooth but more predictable)
 * 
 * @param {Function} callback - Function to call on each tick
 * @param {boolean} isRunning - Whether the game loop should be running
 * @param {number} interval - Interval in milliseconds (default: 16ms ≈ 60fps)
 */
export const useIntervalGameLoop = (callback, isRunning = true, interval = 16) => {
  const intervalRef = useRef();

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(callback, interval);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [callback, isRunning, interval]);

  return {
    start: () => {
      if (!isRunning && !intervalRef.current) {
        intervalRef.current = setInterval(callback, interval);
      }
    },
    stop: () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  };
};

export default useGameLoop;