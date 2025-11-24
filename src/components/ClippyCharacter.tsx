'use client';

import { useEffect } from 'react';
import { ClippyAnimation } from '@/types/clippy';
import styles from './ClippyAssistant.module.css';

interface ClippyCharacterProps {
  animation: ClippyAnimation;
  isTyping: boolean;
  onClick: () => void;
}

export default function ClippyCharacter({
  animation,
  isTyping,
  onClick,
}: ClippyCharacterProps) {
  useEffect(() => {
    if (!isTyping && animation === 'idle') {
      const interval = setInterval(() => {
        // Trigger idle animation periodically
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isTyping, animation]);

  return (
    <div 
      className={`${styles.clippy} ${styles[animation]}`}
      onClick={onClick}
      title="Click me for help!"
    >
      <div className={styles.clippyBody}>
        📎
      </div>
    </div>
  );
}
