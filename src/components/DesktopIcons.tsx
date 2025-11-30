'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import DesktopIcon from './DesktopIcon';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useClippyHelper } from '@/contexts/ClippyHelperContext';
import { useInstalledApps } from '@/contexts/InstalledAppsContext';
import styles from './DesktopIcons.module.css';

// Dynamic imports to avoid SSR issues
const MinesweeperApp = dynamic(() => import('@/apps/MinesweeperApp'), { ssr: false });
const MockBrowser = dynamic(() => import('@/apps/MockBrowser'), { ssr: false });
const NotepadApp = dynamic(() => import('@/apps/NotepadApp'), { ssr: false });
const DoomApp = dynamic(() => import('@/apps/DoomApp'), { ssr: false });
const MyComputer = dynamic(() => import('@/apps/MyComputer'), { ssr: false });
const Kiro = dynamic(() => import('@/apps/Kiro'), { ssr: false });
const Paint = dynamic(() => import('@/apps/Paint'), { ssr: false });
const CalculatorApp = dynamic(() => import('@/apps/CalculatorApp'), { ssr: false });

const CharacterMapApp = dynamic(() => import('@/apps/CharacterMapApp'), { ssr: false });
const SoundRecorderApp = dynamic(() => import('@/apps/SoundRecorderApp'), { ssr: false });
const DiskDefragmenterApp = dynamic(() => import('@/apps/DiskDefragmenterApp'), { ssr: false });
const SystemMonitorApp = dynamic(() => import('@/apps/SystemMonitorApp'), { ssr: false });
const ControlPanelApp = dynamic(() => import('@/apps/ControlPanelApp'), { ssr: false });

interface IconData {
  id: string;
  label: string;
  iconImage: string;
  action: () => void;
}

export default function DesktopIcons() {
  const [selectedIconId, setSelectedIconId] = useState<string | null>(null);
  const { openWindow } = useWindowManager();
  const { wrapAppWithHelper } = useClippyHelper();
  const { isAppInstalled } = useInstalledApps();

  const handleLaunchApp = (appId: string) => {
    // Handle apps that might be launched from My Computer
    const appMap: Record<string, () => void> = {
      'calc': () => openWindow(<CalculatorApp />, 'Calc'),
      'draw': () => openWindow(<Paint />, 'Draw'),
      'wordwrite': () => openWindow(wrapAppWithHelper(<NotepadApp />, 'WordWrite'), 'WordWrite'),
      'web-finder': () => openWindow(wrapAppWithHelper(<MockBrowser />, 'Web Finder'), 'Web Finder'),
      'bomb-sweeper': () => openWindow(wrapAppWithHelper(<MinesweeperApp />, 'Bomb Sweeper'), 'Bomb Sweeper'),
      'gloom': () => openWindow(wrapAppWithHelper(<DoomApp onClose={() => {}} />, 'Gloom'), 'Gloom'),
      'kiro-ide': () => openWindow(<Kiro />, 'Kiro IDE'),
      'symbol-viewer': () => openWindow(<CharacterMapApp />, 'Symbol Viewer'),
      'audio-capture': () => openWindow(<SoundRecorderApp />, 'Audio Capture'),
      'disk-optimizer': () => openWindow(<DiskDefragmenterApp />, 'Disk Optimizer'),
      'task-watcher': () => openWindow(<SystemMonitorApp />, 'Task Watcher'),
      'system-settings': () => openWindow(<ControlPanelApp />, 'System Settings'),
    };
    
    const action = appMap[appId];
    if (action) {
      action();
    } else {
      // Fallback to icon action
      const icon = allIcons.find((i) => i.id === appId);
      if (icon) {
        icon.action();
      }
    }
  };

  const allIcons: (IconData & { appId?: string })[] = [
    {
      id: 'this-pc',
      label: 'This PC',
      iconImage: '💻',
      action: () => {
        openWindow(
          <MyComputer onLaunchApp={handleLaunchApp} />,
          'This PC'
        );
      },
    },
    {
      id: 'documents',
      label: 'Documents',
      iconImage: '📄',
      action: () => {
        openWindow(
          <MyComputer onLaunchApp={handleLaunchApp} initialPath="C:\\My Documents" />,
          'Documents'
        );
      },
    },
    {
      id: 'trash',
      label: 'Trash',
      iconImage: '🗑️',
      action: () => {
        openWindow(
          <div style={{ padding: '20px' }}>
            <h2>Trash</h2>
            <p>Deleted files would appear here.</p>
          </div>,
          'Trash'
        );
      },
    },
    {
      id: 'wordwrite',
      appId: 'notepad',
      label: 'WordWrite',
      iconImage: '📝',
      action: () => {
        if (!isAppInstalled('notepad')) {
          alert('WordWrite has been uninstalled. Please reinstall it from Add/Remove Programs.');
          return;
        }
        openWindow(wrapAppWithHelper(<NotepadApp />, 'WordWrite'), 'WordWrite');
      },
    },
    {
      id: 'web-finder',
      appId: 'browser',
      label: 'Web Finder',
      iconImage: '🌐',
      action: () => {
        if (!isAppInstalled('browser')) {
          alert('Web Finder has been uninstalled. Please reinstall it from Add/Remove Programs.');
          return;
        }
        openWindow(wrapAppWithHelper(<MockBrowser />, 'Web Finder'), 'Web Finder');
      },
    },
    {
      id: 'bomb-sweeper',
      appId: 'minesweeper',
      label: 'Bomb Sweeper',
      iconImage: '💣',
      action: () => {
        if (!isAppInstalled('minesweeper')) {
          alert('Bomb Sweeper has been uninstalled. Please reinstall it from Add/Remove Programs.');
          return;
        }
        openWindow(wrapAppWithHelper(<MinesweeperApp />, 'Bomb Sweeper'), 'Bomb Sweeper');
      },
    },
    {
      id: 'gloom',
      appId: 'doom',
      label: 'Gloom',
      iconImage: '👹',
      action: () => {
        if (!isAppInstalled('doom')) {
          alert('Gloom has been uninstalled. Please reinstall it from Add/Remove Programs.');
          return;
        }
        openWindow(wrapAppWithHelper(<DoomApp onClose={() => {}} />, 'Gloom'), 'Gloom');
      },
    },
    {
      id: 'kiro-ide',
      appId: 'kiro',
      label: 'Kiro IDE',
      iconImage: '💻',
      action: () => {
        if (!isAppInstalled('kiro')) {
          alert('Kiro IDE has been uninstalled. Please reinstall it from Add/Remove Programs.');
          return;
        }
        openWindow(<Kiro />, 'Kiro IDE');
      },
    },
    {
      id: 'draw',
      appId: 'paint',
      label: 'Draw',
      iconImage: '🎨',
      action: () => {
        if (!isAppInstalled('paint')) {
          alert('Draw has been uninstalled. Please reinstall it from Add/Remove Programs.');
          return;
        }
        openWindow(<Paint />, 'Draw');
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
        {allIcons.map((icon, index) => {
          // Hide icon if app is uninstalled, but keep position
          const isVisible = !icon.appId || isAppInstalled(icon.appId as 'notepad' | 'browser' | 'minesweeper' | 'doom' | 'kiro' | 'paint');
          
          return (
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
              style={{ visibility: isVisible ? 'visible' : 'hidden' }}
            />
          );
        })}
      </div>
    </>
  );
}
