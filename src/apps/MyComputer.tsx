'use client';

import { useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useFileSystem } from '@/contexts/FileSystemContext';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import NotepadApp from './NotepadApp';
import MockBrowser from './MockBrowser';
import styles from './MyComputer.module.css';

// Dynamic imports to avoid SSR issues
const CommandPromptApp = dynamic(() => import('./CommandPromptApp'), { ssr: false });
const RegistryEditorApp = dynamic(() => import('./RegistryEditorApp'), { ssr: false });

interface FileSystemItem {
  name: string;
  type: 'folder' | 'file' | 'drive';
  icon: string;
  path: string;
  children?: FileSystemItem[];
}

const getBaseFileSystem = (): FileSystemItem[] => [
  {
    name: 'C:',
    type: 'drive',
    icon: '💾',
    path: 'C:',
    children: [
      {
        name: 'Program Files',
        type: 'folder',
        icon: '📁',
        path: 'C:\\Program Files',
        children: [
          {
            name: 'Web Finder',
            type: 'folder',
            icon: '📁',
            path: 'C:\\Program Files\\Web Finder',
            children: [
              { name: 'webfinder.exe', type: 'file', icon: '🌐', path: 'C:\\Program Files\\Web Finder\\webfinder.exe' },
            ],
          },
          {
            name: 'Accessories',
            type: 'folder',
            icon: '📁',
            path: 'C:\\Program Files\\Accessories',
            children: [
              { name: 'textedit.exe', type: 'file', icon: '📝', path: 'C:\\Program Files\\Accessories\\textedit.exe' },
              { name: 'calc.exe', type: 'file', icon: '🔢', path: 'C:\\Program Files\\Accessories\\calc.exe' },
              { name: 'draw.exe', type: 'file', icon: '🎨', path: 'C:\\Program Files\\Accessories\\draw.exe' },
              { name: 'wordwrite.exe', type: 'file', icon: '📄', path: 'C:\\Program Files\\Accessories\\wordwrite.exe' },
              { name: 'symbolviewer.exe', type: 'file', icon: '🔤', path: 'C:\\Program Files\\Accessories\\symbolviewer.exe' },
              { name: 'audiocapture.exe', type: 'file', icon: '🎙️', path: 'C:\\Program Files\\Accessories\\audiocapture.exe' },
            ],
          },
          {
            name: 'System Tools',
            type: 'folder',
            icon: '📁',
            path: 'C:\\Program Files\\System Tools',
            children: [
              { name: 'diskoptimizer.exe', type: 'file', icon: '💾', path: 'C:\\Program Files\\System Tools\\diskoptimizer.exe' },
              { name: 'taskwatcher.exe', type: 'file', icon: '📊', path: 'C:\\Program Files\\System Tools\\taskwatcher.exe' },
            ],
          },
          {
            name: 'Games',
            type: 'folder',
            icon: '📁',
            path: 'C:\\Program Files\\Games',
            children: [
              { name: 'bombsweeper.exe', type: 'file', icon: '💣', path: 'C:\\Program Files\\Games\\bombsweeper.exe' },
              { name: 'gloom.exe', type: 'file', icon: '👹', path: 'C:\\Program Files\\Games\\gloom.exe' },
            ],
          },
          {
            name: 'Kiro IDE',
            type: 'folder',
            icon: '📁',
            path: 'C:\\Program Files\\Kiro IDE',
            children: [
              { name: 'kiro.exe', type: 'file', icon: '💻', path: 'C:\\Program Files\\Kiro IDE\\kiro.exe' },
            ],
          },
        ],
      },
      {
        name: 'Windows',
        type: 'folder',
        icon: '📁',
        path: 'C:\\Windows',
        children: [
          { name: 'explorer.exe', type: 'file', icon: '💻', path: 'C:\\Windows\\explorer.exe' },
          {
            name: 'system32',
            type: 'folder',
            icon: '📁',
            path: 'C:\\Windows\\system32',
            children: [
              { name: 'cmd.exe', type: 'file', icon: '⌨️', path: 'C:\\Windows\\system32\\cmd.exe' },
              { name: 'regedit.exe', type: 'file', icon: '📋', path: 'C:\\Windows\\system32\\regedit.exe' },
              { name: 'systemsettings.exe', type: 'file', icon: '🎛️', path: 'C:\\Windows\\system32\\systemsettings.exe' },
            ],
          },
        ],
      },
      {
        name: 'My Documents',
        type: 'folder',
        icon: '📄',
        path: 'C:\\My Documents',
        children: [],
      },
    ],
  },
  {
    name: 'A:',
    type: 'drive',
    icon: '💿',
    path: 'A:',
    children: [],
  },
  {
    name: 'D:',
    type: 'drive',
    icon: '📀',
    path: 'D:',
    children: [],
  },
];

interface MyComputerProps {
  onLaunchApp?: (appName: string) => void;
  initialPath?: string;
}

export default function MyComputer({ onLaunchApp, initialPath = '' }: MyComputerProps) {
  const { listFiles, getFile } = useFileSystem();
  const { openWindow } = useWindowManager();
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [pathHistory, setPathHistory] = useState<string[]>([initialPath]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Build file system with virtual files
  const FILE_SYSTEM = useMemo(() => {
    const baseFS = getBaseFileSystem();
    const virtualFiles = listFiles('C:\\My Documents');
    
    // Find My Documents folder and add virtual files
    const cDrive = baseFS.find(item => item.name === 'C:');
    if (cDrive?.children) {
      const myDocs = cDrive.children.find(item => item.name === 'My Documents');
      if (myDocs) {
        myDocs.children = virtualFiles.map(vf => ({
          name: vf.name,
          type: 'file' as const,
          icon: vf.icon,
          path: vf.path
        }));
      }
    }
    
    return baseFS;
  }, [listFiles]);

  const getCurrentItems = (): FileSystemItem[] => {
    if (!currentPath) return FILE_SYSTEM;

    const pathParts = currentPath.split('\\').filter(Boolean);
    let items: FileSystemItem[] = FILE_SYSTEM;

    for (const part of pathParts) {
      const found = items.find((item) => item.name === part);
      if (found?.children) {
        items = found.children;
      } else {
        return [];
      }
    }

    return items;
  };

  const navigate = (path: string) => {
    const newHistory = pathHistory.slice(0, historyIndex + 1);
    newHistory.push(path);
    setPathHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setCurrentPath(path);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setCurrentPath(pathHistory[historyIndex - 1]);
    }
  };

  const goForward = () => {
    if (historyIndex < pathHistory.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setCurrentPath(pathHistory[historyIndex + 1]);
    }
  };

  const goUp = () => {
    if (!currentPath) return;
    const pathParts = currentPath.split('\\').filter(Boolean);
    pathParts.pop();
    navigate(pathParts.join('\\'));
  };

  const handleItemClick = (item: FileSystemItem) => {
    if (item.type === 'folder' || item.type === 'drive') {
      navigate(item.path);
    } else if (item.type === 'file') {
      // Handle .exe files
      if (item.name.endsWith('.exe')) {
        // Handle system executables directly
        if (item.name === 'cmd.exe') {
          openWindow(<CommandPromptApp />, 'Command Shell');
          return;
        }
        if (item.name === 'regedit.exe') {
          openWindow(<RegistryEditorApp />, 'Registry Editor');
          return;
        }
        
        // Handle other apps via onLaunchApp
        if (onLaunchApp) {
          const appMap: Record<string, string> = {
            'webfinder.exe': 'web-finder',
            'textedit.exe': 'textedit',
            'bombsweeper.exe': 'bomb-sweeper',
            'gloom.exe': 'gloom',
            'calc.exe': 'calc',
            'draw.exe': 'draw',
            'kiro.exe': 'kiro-ide',
            'wordwrite.exe': 'wordwrite',
            'symbolviewer.exe': 'symbol-viewer',
            'audiocapture.exe': 'audio-capture',
            'diskoptimizer.exe': 'disk-optimizer',
            'taskwatcher.exe': 'task-watcher',
            'systemsettings.exe': 'system-settings',
          };
          const appId = appMap[item.name];
          if (appId) {
            onLaunchApp(appId);
          }
        }
      }
      // Handle .txt files - open in TextEdit
      else if (item.name.endsWith('.txt')) {
        const file = getFile(item.path);
        if (file) {
          openWindow(
            <NotepadApp initialContent={file.content} initialFilename={file.name} />,
            `TextEdit - ${file.name}`
          );
        }
      }
      // Handle .html files - open in Web Finder
      else if (item.name.endsWith('.html') || item.name.endsWith('.htm')) {
        const file = getFile(item.path);
        if (file) {
          openWindow(
            <MockBrowser initialContent={file.content} initialFilename={file.name} />,
            'Web Finder'
          );
        }
      }
    }
  };

  const currentItems = getCurrentItems();
  const canGoBack = historyIndex > 0;
  const canGoForward = historyIndex < pathHistory.length - 1;
  const canGoUp = currentPath !== '';

  return (
    <div className={styles.explorer}>
      <div className={styles.toolbar}>
        <button
          className={styles.navButton}
          onClick={goBack}
          disabled={!canGoBack}
          title="Back"
        >
          ←
        </button>
        <button
          className={styles.navButton}
          onClick={goForward}
          disabled={!canGoForward}
          title="Forward"
        >
          →
        </button>
        <button
          className={styles.navButton}
          onClick={goUp}
          disabled={!canGoUp}
          title="Up"
        >
          ↑
        </button>
        <div className={styles.addressBar}>
          <span className={styles.addressLabel}>Address:</span>
          <input
            type="text"
            value={currentPath || 'My Computer'}
            readOnly
            className={styles.addressInput}
          />
        </div>
      </div>

      <div className={styles.content}>
        {currentItems.map((item) => (
          <div
            key={item.path}
            className={styles.item}
            onDoubleClick={() => handleItemClick(item)}
          >
            <div className={styles.icon}>{item.icon}</div>
            <div className={styles.label}>{item.name}</div>
          </div>
        ))}
      </div>

      <div className={styles.statusBar}>
        <span>{currentItems.length} object(s)</span>
      </div>
    </div>
  );
}
