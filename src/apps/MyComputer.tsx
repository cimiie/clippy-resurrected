'use client';

import { useState } from 'react';
import styles from './MyComputer.module.css';

interface FileSystemItem {
  name: string;
  type: 'folder' | 'file' | 'drive';
  icon: string;
  path: string;
  children?: FileSystemItem[];
}

const FILE_SYSTEM: FileSystemItem[] = [
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
            name: 'Internet Explorer',
            type: 'folder',
            icon: '📁',
            path: 'C:\\Program Files\\Internet Explorer',
            children: [
              { name: 'iexplore.exe', type: 'file', icon: '🌐', path: 'C:\\Program Files\\Internet Explorer\\iexplore.exe' },
            ],
          },
          {
            name: 'Accessories',
            type: 'folder',
            icon: '📁',
            path: 'C:\\Program Files\\Accessories',
            children: [
              { name: 'notepad.exe', type: 'file', icon: '📝', path: 'C:\\Program Files\\Accessories\\notepad.exe' },
            ],
          },
          {
            name: 'Games',
            type: 'folder',
            icon: '📁',
            path: 'C:\\Program Files\\Games',
            children: [
              { name: 'minesweeper.exe', type: 'file', icon: '💣', path: 'C:\\Program Files\\Games\\minesweeper.exe' },
              { name: 'doom.exe', type: 'file', icon: '👹', path: 'C:\\Program Files\\Games\\doom.exe' },
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
          { name: 'system32', type: 'folder', icon: '📁', path: 'C:\\Windows\\system32' },
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
}

export default function MyComputer({ onLaunchApp }: MyComputerProps) {
  const [currentPath, setCurrentPath] = useState<string>('');
  const [pathHistory, setPathHistory] = useState<string[]>(['']);
  const [historyIndex, setHistoryIndex] = useState(0);

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
    } else if (item.type === 'file' && item.name.endsWith('.exe')) {
      // Launch the application
      if (onLaunchApp) {
        const appMap: Record<string, string> = {
          'iexplore.exe': 'internet-explorer',
          'notepad.exe': 'notepad',
          'minesweeper.exe': 'minesweeper',
          'doom.exe': 'doom',
        };
        const appId = appMap[item.name];
        if (appId) {
          onLaunchApp(appId);
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
