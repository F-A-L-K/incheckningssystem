import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export const useInactivityTimer = (timeout: number = 15 * 60 * 1000) => { // 15 minutes default
  const navigate = useNavigate();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    timerRef.current = setTimeout(() => {
      navigate('/');
    }, timeout);
  };

  useEffect(() => {
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
    
    const resetTimerHandler = () => resetTimer();
    
    // Start the timer
    resetTimer();
    
    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimerHandler, true);
    });

    return () => {
      // Cleanup
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach(event => {
        document.removeEventListener(event, resetTimerHandler, true);
      });
    };
  }, [timeout, navigate]);

  return resetTimer;
};