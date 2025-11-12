import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface UseFullscreenWarningOptions {
  maxAttempts?: number;
  onFinalAttempt?: () => void;
}

export const useFullscreenWarning = (options: UseFullscreenWarningOptions = {}) => {
  const { maxAttempts = 2, onFinalAttempt } = options;
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState(0);
  const [showWarning, setShowWarning] = useState(false);
  const [showViolation, setShowViolation] = useState(false);
  const [attemptsRemaining, setAttemptsRemaining] = useState(maxAttempts);
  const wasFullscreenRef = useRef(false);

  useEffect(() => {
    // Track initial fullscreen state
    const checkFullscreen = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      wasFullscreenRef.current = isFullscreen;
    };

    checkFullscreen();

    const handleFullscreenChange = () => {
      const isFullscreen = !!(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );

      // Only trigger if we were in fullscreen and now we're not
      if (wasFullscreenRef.current && !isFullscreen) {
        const remaining = maxAttempts - attempts;
        
        if (remaining > 0) {
          // Show warning and increment attempts
          setAttempts(prev => {
            const newAttempts = prev + 1;
            setAttemptsRemaining(maxAttempts - newAttempts);
            setShowWarning(true);
            return newAttempts;
          });
          
          // Request fullscreen again after a short delay (but don't force it - let user click button)
          // The modal button will handle the fullscreen request
        } else {
          // Final attempt (3rd time) - show violation modal first
          if (onFinalAttempt) {
            onFinalAttempt();
          }
          setShowViolation(true);
        }
      }

      wasFullscreenRef.current = isFullscreen;
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);
    document.addEventListener('MSFullscreenChange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
      document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
    };
  }, [attempts, maxAttempts, navigate, onFinalAttempt]);

  const closeWarning = useCallback(() => {
    setShowWarning(false);
  }, []);

  const handleRedirect = useCallback(() => {
    navigate('/test/completed', { replace: true });
  }, [navigate]);

  return {
    attempts,
    attemptsRemaining,
    showWarning,
    showViolation,
    closeWarning,
    handleRedirect,
  };
};

