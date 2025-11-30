'use client';

import { createContext, useContext, ReactNode, useCallback, ReactElement } from 'react';
import ClippyQuickMenuWrapper from '@/components/ClippyQuickMenuWrapper';

interface ClippyHelperContextType {
  wrapAppWithHelper: (app: ReactElement, appName: string) => ReactElement;
  requestHelp: (appName: string) => void;
}

const ClippyHelperContext = createContext<ClippyHelperContextType | undefined>(undefined);

interface ClippyHelperProviderProps {
  children: ReactNode;
  onHelpRequest: (appName: string) => void;
  onShutdown: () => void;
}

export function ClippyHelperProvider({ children, onHelpRequest, onShutdown }: ClippyHelperProviderProps) {
  const wrapAppWithHelper = useCallback((app: ReactElement, appName: string) => {
    return (
      <ClippyQuickMenuWrapper appName={appName} onRequestHelp={onHelpRequest} onShutdown={onShutdown}>
        {app}
      </ClippyQuickMenuWrapper>
    );
  }, [onHelpRequest, onShutdown]);

  const requestHelp = useCallback((appName: string) => {
    onHelpRequest(appName);
  }, [onHelpRequest]);

  return (
    <ClippyHelperContext.Provider value={{ wrapAppWithHelper, requestHelp }}>
      {children}
    </ClippyHelperContext.Provider>
  );
}

export function useClippyHelper() {
  const context = useContext(ClippyHelperContext);
  if (!context) {
    throw new Error('useClippyHelper must be used within ClippyHelperProvider');
  }
  return context;
}
