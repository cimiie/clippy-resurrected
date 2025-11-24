'use client';

import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext';
import DesktopEnvironment from '@/components/DesktopEnvironment';
import DesktopIcons from '@/components/DesktopIcons';
import WindowContainer from '@/components/WindowContainer';
import Taskbar from '@/components/Taskbar';
import { MenuItem } from '@/components/StartMenu';
import MinesweeperApp from '@/apps/MinesweeperApp';
import MockBrowser from '@/apps/MockBrowser';
import ClippyWithController from '@/components/ClippyWithController';
import ErrorBoundary from '@/components/ErrorBoundary';

function DesktopContent() {
  const { windows, restoreWindow, focusWindow, openWindow } = useWindowManager();

  const handleWindowClick = (windowId: string) => {
    const window = windows.find(w => w.id === windowId);
    if (window?.isMinimized) {
      restoreWindow(windowId);
    } else {
      focusWindow(windowId);
    }
  };

  // Configure Start Menu items
  const menuItems: MenuItem[] = [
    {
      id: 'programs',
      label: 'Programs',
      icon: '📁',
      subItems: [
        {
          id: 'internet-explorer',
          label: 'Internet Explorer',
          icon: '🌐',
          action: () => openWindow(<MockBrowser />, 'Internet Explorer')
        },
        {
          id: 'accessories',
          label: 'Accessories',
          icon: '📂',
          subItems: [
            {
              id: 'notepad',
              label: 'Notepad',
              icon: '📝',
              action: () => console.log('Launch Notepad')
            }
          ]
        },
        {
          id: 'games',
          label: 'Games',
          icon: '🎮',
          subItems: [
            {
              id: 'minesweeper',
              label: 'Minesweeper',
              icon: '💣',
              action: () => openWindow(<MinesweeperApp />, 'Minesweeper')
            }
          ]
        }
      ]
    },
    {
      id: 'documents',
      label: 'Documents',
      icon: '📄'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: '⚙️'
    },
    {
      id: 'shutdown',
      label: 'Shut Down...',
      icon: '🔌',
      action: () => console.log('Shutdown')
    }
  ];

  return (
    <>
      <ErrorBoundary>
        <DesktopEnvironment>
          <DesktopIcons />
          <WindowContainer />
        </DesktopEnvironment>
      </ErrorBoundary>
      <ErrorBoundary>
        <Taskbar 
          windows={windows}
          onWindowClick={handleWindowClick}
          menuItems={menuItems}
        />
      </ErrorBoundary>
      <ErrorBoundary>
        <ClippyWithController />
      </ErrorBoundary>
    </>
  );
}

export default function Home() {
  return (
    <WindowManagerProvider>
      <DesktopContent />
    </WindowManagerProvider>
  );
}
