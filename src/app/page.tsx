'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext';
import { ClippyHelperProvider, useClippyHelper } from '@/contexts/ClippyHelperContext';
import DesktopEnvironment from '@/components/DesktopEnvironment';
import DesktopIcons from '@/components/DesktopIcons';
import WindowContainer from '@/components/WindowContainer';
import Taskbar from '@/components/Taskbar';
import { MenuItem } from '@/components/StartMenu';
import ClippyWithController from '@/components/ClippyWithController';
import ErrorBoundary from '@/components/ErrorBoundary';
import ClientOnly from '@/components/ClientOnly';
import PowerButton from '@/components/PowerButton';
import BootScreen from '@/components/BootScreen';
import LoginScreen from '@/components/LoginScreen';
import ShutdownScreen from '@/components/ShutdownScreen';
import { useState as useReactState } from 'react';

// Dynamic imports to avoid SSR issues
const MinesweeperApp = dynamic(() => import('@/apps/MinesweeperApp'), { ssr: false });
const MockBrowser = dynamic(() => import('@/apps/MockBrowser'), { ssr: false });
const DoomApp = dynamic(() => import('@/apps/DoomApp'), { ssr: false });
const Kiro = dynamic(() => import('@/apps/Kiro'), { ssr: false });
const Paint = dynamic(() => import('@/apps/Paint'), { ssr: false });
const NotepadApp = dynamic(() => import('@/apps/NotepadApp'), { ssr: false });
const CalculatorApp = dynamic(() => import('@/apps/CalculatorApp'), { ssr: false });
const WordPadApp = dynamic(() => import('@/apps/WordPadApp'), { ssr: false });
const CharacterMapApp = dynamic(() => import('@/apps/CharacterMapApp'), { ssr: false });
const SoundRecorderApp = dynamic(() => import('@/apps/SoundRecorderApp'), { ssr: false });
const DiskDefragmenterApp = dynamic(() => import('@/apps/DiskDefragmenterApp'), { ssr: false });
const SystemMonitorApp = dynamic(() => import('@/apps/SystemMonitorApp'), { ssr: false });
const CommandPromptApp = dynamic(() => import('@/apps/CommandPromptApp'), { ssr: false });
const ControlPanelApp = dynamic(() => import('@/apps/ControlPanelApp'), { ssr: false });

function DesktopContentInner() {
  const { windows, restoreWindow, focusWindow, openWindow } = useWindowManager();
  const { wrapAppWithHelper } = useClippyHelper();

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
          id: 'web-finder',
          label: 'Web Finder',
          icon: '🌐',
          action: () => openWindow(wrapAppWithHelper(<MockBrowser />, 'Web Finder'), 'Web Finder')
        },
        {
          id: 'accessories',
          label: 'Accessories',
          icon: '📂',
          subItems: [
            {
              id: 'calc',
              label: 'Calc',
              icon: '🔢',
              action: () => openWindow(<CalculatorApp />, 'Calc')
            },
            {
              id: 'textedit',
              label: 'TextEdit',
              icon: '📝',
              action: () => openWindow(wrapAppWithHelper(<NotepadApp />, 'TextEdit'), 'TextEdit')
            },
            {
              id: 'draw',
              label: 'Draw',
              icon: '🎨',
              action: () => openWindow(<Paint />, 'Draw')
            },
            {
              id: 'wordwrite',
              label: 'WordWrite',
              icon: '📄',
              action: () => openWindow(<WordPadApp />, 'WordWrite')
            },
            {
              id: 'symbol-viewer',
              label: 'Symbol Viewer',
              icon: '🔤',
              action: () => openWindow(<CharacterMapApp />, 'Symbol Viewer')
            },
            {
              id: 'audio-capture',
              label: 'Audio Capture',
              icon: '🎙️',
              action: () => openWindow(<SoundRecorderApp />, 'Audio Capture')
            },
            {
              id: 'system-tools',
              label: 'System Tools',
              icon: '🔧',
              subItems: [
                {
                  id: 'disk-optimizer',
                  label: 'Disk Optimizer',
                  icon: '💾',
                  action: () => openWindow(<DiskDefragmenterApp />, 'Disk Optimizer')
                },
                {
                  id: 'task-watcher',
                  label: 'Task Watcher',
                  icon: '📊',
                  action: () => openWindow(<SystemMonitorApp />, 'Task Watcher')
                }
              ]
            }
          ]
        },
        {
          id: 'kiro-ide',
          label: 'Kiro IDE',
          icon: '💻',
          action: () => openWindow(<Kiro />, 'Kiro IDE')
        },
        {
          id: 'command-shell',
          label: 'Command Shell',
          icon: '⌨️',
          action: () => openWindow(<CommandPromptApp />, 'Command Shell')
        },
        {
          id: 'games',
          label: 'Games',
          icon: '🎮',
          subItems: [
            {
              id: 'bomb-sweeper',
              label: 'Bomb Sweeper',
              icon: '💣',
              action: () => openWindow(wrapAppWithHelper(<MinesweeperApp />, 'Bomb Sweeper'), 'Bomb Sweeper')
            },
            {
              id: 'gloom',
              label: 'Gloom',
              icon: '👹',
              action: () => openWindow(wrapAppWithHelper(<DoomApp onClose={() => {}} />, 'Gloom'), 'Gloom')
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
      icon: '⚙️',
      subItems: [
        {
          id: 'system-settings',
          label: 'System Settings',
          icon: '🎛️',
          action: () => openWindow(<ControlPanelApp />, 'System Settings')
        }
      ]
    },
    {
      id: 'find',
      label: 'Find',
      icon: '🔍',
      subItems: [
        {
          id: 'find-files',
          label: 'Files or Folders...',
          icon: '📁'
        }
      ]
    },
    {
      id: 'run',
      label: 'Run...',
      icon: '▶️',
      action: () => openWindow(<CommandPromptApp />, 'Command Shell')
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
    </>
  );
}

interface DesktopContentProps {
  onShutdown: () => void;
}

function DesktopContent({ onShutdown }: DesktopContentProps) {
  const [helpContext, setHelpContext] = useReactState<string | null>(null);

  return (
    <ClippyHelperProvider onHelpRequest={setHelpContext} onShutdown={onShutdown}>
      <DesktopContentInner />
      <ErrorBoundary>
        <ClippyWithController helpContext={helpContext} onHelpContextHandled={() => setHelpContext(null)} />
      </ErrorBoundary>
    </ClippyHelperProvider>
  );
}

export default function Home() {
  const [poweredOn, setPoweredOn] = useState(false);
  const [bootComplete, setBootComplete] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [isShuttingDown, setIsShuttingDown] = useState(false);

  const handleShutdown = () => {
    setIsShuttingDown(true);
  };

  const handleShutdownComplete = () => {
    setPoweredOn(false);
    setBootComplete(false);
    setLoggedIn(false);
    setIsShuttingDown(false);
  };

  return (
    <ClientOnly>
      {!poweredOn && <PowerButton onPowerOn={() => setPoweredOn(true)} />}
      {poweredOn && !bootComplete && <BootScreen onComplete={() => setBootComplete(true)} />}
      {poweredOn && bootComplete && !loggedIn && <LoginScreen onLogin={() => setLoggedIn(true)} />}
      {poweredOn && bootComplete && loggedIn && !isShuttingDown && (
        <WindowManagerProvider>
          <DesktopContent onShutdown={handleShutdown} />
        </WindowManagerProvider>
      )}
      {isShuttingDown && <ShutdownScreen onComplete={handleShutdownComplete} />}
    </ClientOnly>
  );
}
