'use client';

import { useState } from 'react';
import DesktopIcon from './DesktopIcon';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import MinesweeperApp from '@/apps/MinesweeperApp';
import MockBrowser from '@/apps/MockBrowser';
import NotepadApp from '@/apps/NotepadApp';
import DoomApp from '@/apps/DoomApp';
import MyComputer from '@/apps/MyComputer';
import Kiro from '@/apps/Kiro';
import Paint from '@/apps/Paint';
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

  const handleLaunchApp = (appId: string) => {
    const icon = icons.find((i) => i.id === appId);
    if (icon) {
      icon.action();
    }
  };

  const icons: IconData[] = [
    {
      id: 'my-computer',
      label: 'My Computer',
      iconImage: '💻',
      action: () => {
        openWindow(
          <MyComputer onLaunchApp={handleLaunchApp} />,
          'My Computer'
        );
      },
    },
    {
      id: 'my-documents',
      label: 'My Documents',
      iconImage: '📄',
      action: () => {
        openWindow(
          <MyComputer onLaunchApp={handleLaunchApp} initialPath="C:\\My Documents" />,
          'My Documents'
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
      id: 'notepad',
      label: 'Notepad',
      iconImage: '📝',
      action: () => {
        openWindow(<NotepadApp />, 'Notepad');
      },
    },
    {
      id: 'internet-explorer',
      label: 'Internet Explorer',
      iconImage: '🌐',
      action: () => {
        openWindow(<MockBrowser />, 'Internet Explorer');
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
    {
      id: 'doom',
      label: 'DOOM',
      iconImage: '👹',
      action: () => {
        openWindow(<DoomApp onClose={() => {}} />, 'DOOM');
      },
    },
    {
      id: 'kiro',
      label: 'Kiro',
      iconImage: '💻',
      action: () => {
        openWindow(<Kiro />, 'Kiro');
      },
    },
    {
      id: 'paint',
      label: 'Paint',
      iconImage: '🎨',
      action: () => {
        openWindow(<Paint onClose={() => {}} />, 'Paint');
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
