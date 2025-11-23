'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export interface WindowInstance {
  id: string;
  component: ReactNode;
  title: string;
  isMinimized: boolean;
  zIndex: number;
}

interface WindowManagerState {
  windows: WindowInstance[];
  activeWindowId: string | null;
  nextZIndex: number;
}

interface WindowManagerActions {
  openWindow: (component: ReactNode, title: string) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}

type WindowManagerContextType = WindowManagerState & WindowManagerActions;

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

const INITIAL_Z_INDEX = 1000;

export function WindowManagerProvider({ children }: { children: ReactNode }) {
  const [windows, setWindows] = useState<WindowInstance[]>([]);
  const [activeWindowId, setActiveWindowId] = useState<string | null>(null);
  const [nextZIndex, setNextZIndex] = useState(INITIAL_Z_INDEX);

  const openWindow = useCallback((component: ReactNode, title: string): string => {
    const id = `window-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newWindow: WindowInstance = {
      id,
      component,
      title,
      isMinimized: false,
      zIndex: nextZIndex,
    };

    setWindows((prev) => [...prev, newWindow]);
    setActiveWindowId(id);
    setNextZIndex((prev) => prev + 1);

    return id;
  }, [nextZIndex]);

  const closeWindow = useCallback((id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id));
    setActiveWindowId((prev) => (prev === id ? null : prev));
  }, []);

  const minimizeWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: true } : w))
    );
    setActiveWindowId((prev) => (prev === id ? null : prev));
  }, []);

  const restoreWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, isMinimized: false, zIndex: nextZIndex } : w))
    );
    setActiveWindowId(id);
    setNextZIndex((prev) => prev + 1);
  }, [nextZIndex]);

  const focusWindow = useCallback((id: string) => {
    setWindows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w))
    );
    setActiveWindowId(id);
    setNextZIndex((prev) => prev + 1);
  }, [nextZIndex]);

  const value: WindowManagerContextType = {
    windows,
    activeWindowId,
    nextZIndex,
    openWindow,
    closeWindow,
    minimizeWindow,
    restoreWindow,
    focusWindow,
  };

  return (
    <WindowManagerContext.Provider value={value}>
      {children}
    </WindowManagerContext.Provider>
  );
}

export function useWindowManager(): WindowManagerContextType {
  const context = useContext(WindowManagerContext);
  if (context === undefined) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
}
