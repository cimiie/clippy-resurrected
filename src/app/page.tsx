'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { WindowManagerProvider, useWindowManager } from '@/contexts/WindowManagerContext';
import { ClippyHelperProvider, useClippyHelper } from '@/contexts/ClippyHelperContext';
import DesktopEnvironment from '@/components/desktop/DesktopEnvironment';
import DesktopIcons from '@/components/desktop/DesktopIcons';
import WindowContainer from '@/components/window/WindowContainer';
import Taskbar from '@/components/taskbar/Taskbar';
import { MenuItem } from '@/components/taskbar/StartMenu';
import ClippyWithController from '@/components/Clippy/ClippyWithController';
import ErrorBoundary from '@/components/common/ErrorBoundary';
import ClientOnly from '@/components/common/ClientOnly';
import PowerButton from '@/components/system/PowerButton';
import BootScreen from '@/components/system/BootScreen';
import LoginScreen from '@/components/system/LoginScreen';
import ShutdownScreen from '@/components/system/ShutdownScreen';

// Dynamic imports to avoid SSR issues
const MinesweeperApp = dynamic(() => import('@/apps/BombFinder/BombFinder'), { ssr: false });
const MockBrowser = dynamic(() => import('@/apps/WebFinder/WebFinder'), { ssr: false });
const GloomApp = dynamic(() => import('@/apps/Gloom/Gloom'), { ssr: false });
const Kiro = dynamic(() => import('@/apps/KiroIDE/KiroIDE'), { ssr: false });
const Paint = dynamic(() => import('@/apps/Draw/Draw'), { ssr: false });
const NotepadApp = dynamic(() => import('@/apps/WordWrite/WordWrite'), { ssr: false });
const CalculatorApp = dynamic(() => import('@/apps/Calc/Calc'), { ssr: false });

const CharacterMapApp = dynamic(() => import('@/apps/SymbolViewer/SymbolViewer'), { ssr: false });
const SoundRecorderApp = dynamic(() => import('@/apps/AudioCapture/AudioCapture'), { ssr: false });
const DiskDefragmenterApp = dynamic(() => import('@/apps/DiskOptimizer/DiskOptimizer'), { ssr: false });
const SystemMonitorApp = dynamic(() => import('@/apps/TaskWatcher/TaskWatcher'), { ssr: false });
const CommandPromptApp = dynamic(() => import('@/apps/CommandPrompt/CommandPrompt'), { ssr: false });
const ControlPanelApp = dynamic(() => import('@/apps/ControlPanel/ControlPanel'), { ssr: false });
const RegistryEditorApp = dynamic(() => import('@/apps/RegistryEditor/RegistryEditor'), { ssr: false });

import { useInstalledApps } from '@/contexts/InstalledAppsContext';

interface DesktopContentInnerProps {
  onShutdown: () => void;
}

function DesktopContentInner({ onShutdown }: DesktopContentInnerProps) {
  const { windows, restoreWindow, focusWindow, openWindow } = useWindowManager();
  const { wrapAppWithHelper } = useClippyHelper();
  const { isAppInstalled } = useInstalledApps();

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
          action: () => {
            if (!isAppInstalled('browser')) {
              alert('Web Finder has been uninstalled. Please reinstall it from Add/Remove Programs.');
              return;
            }
            openWindow(wrapAppWithHelper(<MockBrowser />, 'Web Finder'), 'Web Finder');
          }
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
              action: () => {
                if (!isAppInstalled('calculator')) {
                  alert('Calc has been uninstalled. Please reinstall it from Add/Remove Programs.');
                  return;
                }
                openWindow(<CalculatorApp />, 'Calc');
              }
            },
            {
              id: 'wordwrite',
              label: 'WordWrite',
              icon: '📝',
              action: () => {
                if (!isAppInstalled('notepad')) {
                  alert('WordWrite has been uninstalled. Please reinstall it from Add/Remove Programs.');
                  return;
                }
                openWindow(wrapAppWithHelper(<NotepadApp />, 'WordWrite'), 'WordWrite');
              }
            },
            {
              id: 'draw',
              label: 'Draw',
              icon: '🎨',
              action: () => {
                if (!isAppInstalled('paint')) {
                  alert('Draw has been uninstalled. Please reinstall it from Add/Remove Programs.');
                  return;
                }
                openWindow(<Paint />, 'Draw');
              }
            },
            {
              id: 'symbol-viewer',
              label: 'Symbol Viewer',
              icon: '🔤',
              action: () => {
                if (!isAppInstalled('charmap')) {
                  alert('Symbol Viewer has been uninstalled. Please reinstall it from Add/Remove Programs.');
                  return;
                }
                openWindow(<CharacterMapApp />, 'Symbol Viewer');
              }
            },
            {
              id: 'audio-capture',
              label: 'Audio Capture',
              icon: '🎙️',
              action: () => {
                if (!isAppInstalled('soundrecorder')) {
                  alert('Audio Capture has been uninstalled. Please reinstall it from Add/Remove Programs.');
                  return;
                }
                openWindow(<SoundRecorderApp />, 'Audio Capture');
              }
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
                  action: () => {
                    if (!isAppInstalled('diskdefrag')) {
                      alert('Disk Optimizer has been uninstalled. Please reinstall it from Add/Remove Programs.');
                      return;
                    }
                    openWindow(<DiskDefragmenterApp />, 'Disk Optimizer');
                  }
                },
                {
                  id: 'task-watcher',
                  label: 'Task Watcher',
                  icon: '📊',
                  action: () => {
                    if (!isAppInstalled('sysmonitor')) {
                      alert('Task Watcher has been uninstalled. Please reinstall it from Add/Remove Programs.');
                      return;
                    }
                    openWindow(<SystemMonitorApp />, 'Task Watcher');
                  }
                },
                {
                  id: 'registry-editor',
                  label: 'Registry Editor',
                  icon: '📋',
                  action: () => openWindow(<RegistryEditorApp />, 'Registry Editor')
                }
              ]
            }
          ]
        },
        {
          id: 'kiro-ide',
          label: 'Kiro IDE',
          icon: '💻',
          action: () => {
            if (!isAppInstalled('kiro')) {
              alert('Kiro IDE has been uninstalled. Please reinstall it from Add/Remove Programs.');
              return;
            }
            openWindow(<Kiro />, 'Kiro IDE');
          }
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
              id: 'bomb-finder',
              label: 'Bomb Finder',
              icon: '💣',
              action: () => {
                if (!isAppInstalled('minesweeper')) {
                  alert('Bomb Finder has been uninstalled. Please reinstall it from Add/Remove Programs.');
                  return;
                }
                openWindow(wrapAppWithHelper(<MinesweeperApp />, 'Bomb Finder'), 'Bomb Finder');
              }
            },
            {
              id: 'gloom',
              label: 'Gloom',
              icon: '👹',
              action: () => {
                if (!isAppInstalled('doom')) {
                  alert('Gloom has been uninstalled. Please reinstall it from Add/Remove Programs.');
                  return;
                }
                openWindow(wrapAppWithHelper(<GloomApp onClose={() => {}} />, 'Gloom'), 'Gloom');
              }
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
          id: 'control-panel',
          label: 'Control Panel',
          icon: '🎛️',
          action: () => openWindow(<ControlPanelApp />, 'Control Panel')
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
      action: onShutdown
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
  const [helpContext, setHelpContext] = useState<string | null>(null);

  return (
    <ClippyHelperProvider onHelpRequest={setHelpContext} onShutdown={onShutdown}>
      <DesktopContentInner onShutdown={onShutdown} />
      <ErrorBoundary>
        <ClippyWithController 
          helpContext={helpContext} 
          onHelpContextHandled={() => setHelpContext(null)}
          onShutdown={onShutdown}
        />
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
      {poweredOn && bootComplete && !loggedIn && <LoginScreen onLogin={() => setLoggedIn(true)} onShutdown={handleShutdown} />}
      {poweredOn && bootComplete && loggedIn && !isShuttingDown && (
        <WindowManagerProvider>
          <DesktopContent onShutdown={handleShutdown} />
        </WindowManagerProvider>
      )}
      {isShuttingDown && <ShutdownScreen onComplete={handleShutdownComplete} />}
    </ClientOnly>
  );
}
