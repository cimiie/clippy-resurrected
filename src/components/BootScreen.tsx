'use client';

import { useEffect, useState } from 'react';
import styles from './BootScreen.module.css';

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    // Animate loading dots
    const dotInterval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '' : prev + '.');
    }, 500);

    // Complete boot after 5 seconds
    const bootTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearInterval(dotInterval);
      clearTimeout(bootTimer);
    };
  }, [onComplete]);

  return (
    <div className={styles.bootScreen}>
      <div className={styles.content}>
        <div className={styles.logo}>
          <div className={styles.kiroLogo}>
            <div className={styles.pane} style={{ background: '#FF6B35' }}></div>
            <div className={styles.pane} style={{ background: '#F7931E' }}></div>
            <div className={styles.pane} style={{ background: '#FDC830' }}></div>
            <div className={styles.pane} style={{ background: '#00D9FF' }}></div>
          </div>
        </div>
        <div className={styles.title}>Kiro 97</div>
        <div className={styles.loading}>
          Starting Kiro{dots}
        </div>
      </div>
    </div>
  );
}
