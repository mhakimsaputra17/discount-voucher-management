import { useEffect, useState } from 'react';

/**
 * Provides a smooth linear progress value when `isActive` is true.
 * Progress advances gradually toward 85% while active, then completes and resets once inactive.
 */
export const useSmoothProgress = (isActive: boolean) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let intervalId: number | undefined;
    let resetTimeoutId: number | undefined;

    if (isActive) {
      setProgress(prev => (prev === 0 ? 4 : prev));

      intervalId = window.setInterval(() => {
        setProgress(prev => {
          if (prev >= 82) {
            return prev;
          }

          const increment = 3 + Math.random() * 6;
          return Math.min(prev + increment, 82);
        });
      }, 600);
    } else {
      setProgress(prev => {
        if (prev === 0) {
          return 0;
        }
        return 100;
      });

      resetTimeoutId = window.setTimeout(() => {
        setProgress(0);
      }, 900);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
      if (resetTimeoutId) {
        window.clearTimeout(resetTimeoutId);
      }
    };
  }, [isActive]);

  return progress;
};
