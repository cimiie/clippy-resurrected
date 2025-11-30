'use client';

import { ReactNode, createContext, useContext, useState, useRef, useEffect } from 'react';
import ClippyQuickMenu from './ClippyQuickMenu';
import ClippyFlyout from './ClippyFlyout';

interface ClippyQuickMenuWrapperProps {
  children: ReactNode;
  appName: string;
  onRequestHelp: (appName: string) => void;
  onShutdown: () => void;
}

const ClippyHelpContext = createContext<((appName: string) => void) | null>(null);

export function useClippyHelp() {
  return useContext(ClippyHelpContext);
}

export default function ClippyQuickMenuWrapper({
  children,
  appName,
  onRequestHelp,
  onShutdown,
}: ClippyQuickMenuWrapperProps) {
  const [showFlyout, setShowFlyout] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHelp = () => {
    setShowFlyout(true);
  };

  const handleCloseFlyout = () => {
    setShowFlyout(false);
  };

  // Position the flyout next to the window
  useEffect(() => {
    if (!showFlyout) return;

    const updateFlyoutPosition = () => {
      const windowElement = containerRef.current?.closest('[data-window-id]') as HTMLElement;
      const flyoutContainer = document.querySelector('[data-clippy-flyout-container]') as HTMLElement;
      
      if (windowElement && flyoutContainer) {
        const rect = windowElement.getBoundingClientRect();
        flyoutContainer.style.left = `${rect.right}px`;
        flyoutContainer.style.top = `${rect.top}px`;
        flyoutContainer.style.height = `${rect.height}px`;
      }
    };

    updateFlyoutPosition();

    // Update position on window resize or movement
    const observer = new MutationObserver(updateFlyoutPosition);
    const windowElement = containerRef.current?.closest('[data-window-id]') as HTMLElement;
    
    if (windowElement) {
      observer.observe(windowElement, {
        attributes: true,
        attributeFilter: ['style'],
      });
    }

    window.addEventListener('resize', updateFlyoutPosition);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', updateFlyoutPosition);
    };
  }, [showFlyout]);

  return (
    <ClippyHelpContext.Provider value={onRequestHelp}>
      <>
        <div ref={containerRef} style={{ width: '100%', height: '100%', position: 'relative' }}>
          {children}
          {!showFlyout && (
            <ClippyQuickMenu appName={appName} onHelp={handleHelp} onShutdown={onShutdown} />
          )}
        </div>
        {showFlyout && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '320px',
              height: '100%',
              zIndex: 9999,
            }}
            data-clippy-flyout-container
          >
            <ClippyFlyout appName={appName} onClose={handleCloseFlyout} />
          </div>
        )}
      </>
    </ClippyHelpContext.Provider>
  );
}
