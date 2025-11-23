'use client';

import { useState } from 'react';
import DesktopIcon from './DesktopIcon';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import MinesweeperApp from '@/apps/MinesweeperApp';
import styles from './DesktopIcons.module.css';

interface IconData {
  id: string;
  label: string;
  iconImage: string;
  action: () => void;
}

export default function DesktopIcons() {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const { openWindow } = useWindowManager();

  const icons: IconData[] = [
    {
      id: 'my-computer',
      label: 'My Computer',
      iconImage: '💻',
      action: () => {
        openWindow(
          <div style={{ padding: '20px' }}>
            <h2>My Computer</h2>
            <p>System information and drives would appear here.</p>
          </div>,
          'My Computer'
        );
      },
    },
    {
      id: 'recycle-bin',
      label: 'Recycle Bin',
      iconImage: '🗑️',
      action: () => {
        openWindow(
          <div style={{ padding: '20px' }}>
            <h2>Recycle Bin</h2>
            <p>Deleted files would appear here.</p>
          </div>,
          'Recycle Bin'
        );
      },
    },
    {
      id: 'internet-explorer',
      label: 'Internet Explorer',
      iconImage: '🌐',
      action: () => {
        openWindow(
          <div style={{ padding: '20px' }}>
            <h2>Internet Explorer</h2>
            <p>Mock browser coming soon...</p>
          </div>,
          'Internet Explorer'
        );
      },
    },
    {
      id: 'minesweeper',
      label: 'Minesweeper',
      iconImage: '💣',
      action: () => {
        openWindow(<MinesweeperApp />, 'Minesweeper');
      },
    },
  ];

  const handleIconSelect = (iconId: string) => {
    setSelectedIconId(iconId);
  };

  const handleIconDoubleClick = (icon: IconData) => {
    icon.action();
  };

  return (
    <>
      <div className={styles.iconGrid} onClick={(e) => e.stopPropagation()}>
        {icons.map((icon, index) => (
          <DesktopIcon
            key={icon.id}
            id={icon.id}
            label={icon.label}
            iconImage={icon.iconImage}
            isSelected={selectedIconId === icon.id}
            onSelect={() => handleIconSelect(icon.id)}
            onDoubleClick={() => handleIconDoubleClick(icon)}
            gridPosition={{
              row: index + 1,
              col: 1,
            }}
          />
        ))}
      </div>
    </>
  );
}
