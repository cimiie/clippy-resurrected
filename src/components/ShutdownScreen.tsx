'use client';

import { useEffect, useState } from 'react';
import styles from './ShutdownScreen.module.css';

interface ShutdownScreenProps {
  onComplete: () => void;
}

export default function ShutdownScreen({ onComplete }: ShutdownScreenProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <div className={styles.kiro97}>Kiro 97</div>
        </div>
        <div className={styles.message}>
          It&apos;s now safe to turn off your computer.
        </div>
        <div className={styles.progressContainer}>
          <div className={styles.progressBar}>
            <div 
              className={styles.progressFill} 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        <div className={styles.shutdownText}>
          Shutting down...
        </div>
      </div>
    </div>
  );
}
