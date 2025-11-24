'use client';

import { useState } from 'react';
import { WindowInstance } from '@/contexts/WindowManagerContext';
import Clock from './Clock';
import StartMenu, { MenuItem } from './StartMenu';
import styles from './Taskbar.module.css';

interface TaskbarProps {
  windows: WindowInstance[];
  onWindowClick: (id: string) => void;
  onStartClick?: () => void;
  menuItems?: MenuItem[];
}

export default function Taskbar({ 
  windows, 
  onWindowClick, 
  onStartClick,
  menuItems = []
}: TaskbarProps) {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);

  const handleStartClick = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
    onStartClick?.();
  };

  const handleStartMenuClose = () => {
    setIsStartMenuOpen(false);
  };

  const handleWindowButtonClick = (windowId: string) => {
    onWindowClick(windowId);
  };

  return (
    <div className={styles.taskbar}>
      <div className={styles.startButtonContainer}>
        <button 
          className={`${styles.startButton} ${isStartMenuOpen ? styles.startButtonPressed : ''}`}
          onClick={handleStartClick}
        >
          <div className={styles.startLogo}>
            <div className={styles.pane} style={{ background: '#FF6B35' }}></div>
            <div className={styles.pane} style={{ background: '#F7931E' }}></div>
            <div className={styles.pane} style={{ background: '#FDC830' }}></div>
            <div className={styles.pane} style={{ background: '#00D9FF' }}></div>
          </div>
          <span className={styles.startText}>Start</span>
        </button>
        <StartMenu 
          key={isStartMenuOpen ? 'open' : 'closed'}
          isOpen={isStartMenuOpen}
          onClose={handleStartMenuClose}
          menuItems={menuItems}
        />
      </div>
      
      <div className={styles.windowButtons}>
        {windows.map((window) => (
          <button
            key={window.id}
            className={`${styles.windowButton} ${window.isMinimized ? styles.windowButtonMinimized : ''}`}
            onClick={() => handleWindowButtonClick(window.id)}
            title={window.title}
          >
            <span className={styles.windowButtonText}>{window.title}</span>
          </button>
        ))}
      </div>

      <div className={styles.systemTray}>
        <Clock />
      </div>
    </div>
  );
}
