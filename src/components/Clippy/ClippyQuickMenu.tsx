'use client';

import { useState, useEffect } from 'react';
import styles from './ClippyQuickMenu.module.css';

interface ClippyQuickMenuProps {
  appName: string;
  onHelp: () => void;
  onShutdown: () => void;
}

const NO_RESPONSES = [
  "Are you sure? I'm really good at helping!",
  "Come on, just give me a chance!",
  "I've been practicing my help skills all day...",
  "Fine. But you're missing out on some GREAT tips!",
  "This is your last chance before I get upset...",
  "That's it! I'm shutting down this computer!"
];

export default function ClippyQuickMenu({ appName, onHelp, onShutdown }: ClippyQuickMenuProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [message, setMessage] = useState(`Need help with ${appName}?`);

  useEffect(() => {
    // Fade in after a short delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleYes = () => {
    setIsDismissed(true);
    onHelp();
  };

  const handleNo = () => {
    if (noCount < 5) {
      setMessage(NO_RESPONSES[noCount]);
      setNoCount(noCount + 1);
    } else {
      // 6th no - trigger shutdown
      setIsDismissed(true);
      onShutdown();
    }
  };

  if (isDismissed) return null;

  return (
    <div className={`${styles.container} ${isVisible ? styles.visible : ''}`}>
      <div className={`${styles.clippy} ${noCount >= 4 ? styles.angry : ''}`}>📎</div>
      <div className={styles.bubble}>
        <div className={styles.message}>
          {message}
        </div>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={handleYes}>
            Yes
          </button>
          <button className={styles.button} onClick={handleNo}>
            No
          </button>
        </div>
      </div>
    </div>
  );
}
