'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type AppId = 
  | 'minesweeper'
  | 'paint'
  | 'kiro'
  | 'browser'
  | 'notepad'
  | 'calculator'
  | 'charmap'
  | 'soundrecorder'
  | 'diskdefrag'
  | 'sysmonitor'
  | 'doom';

export interface InstalledApp {
  id: AppId;
  name: string;
  icon: string;
}

const ALL_APPS: InstalledApp[] = [
  { id: 'minesweeper', name: 'Bomb Sweeper', icon: '💣' },
  { id: 'paint', name: 'Draw', icon: '🎨' },
  { id: 'kiro', name: 'Kiro IDE', icon: '💻' },
  { id: 'browser', name: 'Web Finder', icon: '🌐' },
  { id: 'notepad', name: 'WordWrite', icon: '📝' },
  { id: 'calculator', name: 'Calc', icon: '🔢' },
  { id: 'charmap', name: 'Symbol Viewer', icon: '🔤' },
  { id: 'soundrecorder', name: 'Audio Capture', icon: '🎙️' },
  { id: 'diskdefrag', name: 'Disk Optimizer', icon: '💾' },
  { id: 'sysmonitor', name: 'Task Watcher', icon: '📊' },
  { id: 'doom', name: 'Gloom', icon: '👹' }
];

interface InstalledAppsContextType {
  installedApps: InstalledApp[];
  isAppInstalled: (appId: AppId) => boolean;
  uninstallApp: (appId: AppId) => void;
  reinstallApp: (appId: AppId) => void;
}

const InstalledAppsContext = createContext<InstalledAppsContextType | undefined>(undefined);

export function InstalledAppsProvider({ children }: { children: ReactNode }) {
  const [installedApps, setInstalledApps] = useState<InstalledApp[]>(ALL_APPS);

  const isAppInstalled = (appId: AppId): boolean => {
    return installedApps.some(app => app.id === appId);
  };

  const uninstallApp = (appId: AppId) => {
    setInstalledApps(prev => prev.filter(app => app.id !== appId));
  };

  const reinstallApp = (appId: AppId) => {
    const app = ALL_APPS.find(a => a.id === appId);
    if (app && !isAppInstalled(appId)) {
      setInstalledApps(prev => [...prev, app]);
    }
  };

  return (
    <InstalledAppsContext.Provider value={{ installedApps, isAppInstalled, uninstallApp, reinstallApp }}>
      {children}
    </InstalledAppsContext.Provider>
  );
}

export function useInstalledApps() {
  const context = useContext(InstalledAppsContext);
  if (!context) {
    throw new Error('useInstalledApps must be used within InstalledAppsProvider');
  }
  return context;
}
