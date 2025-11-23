'use client';

import Window from './Window';
import { useWindowManager } from '@/contexts/WindowManagerContext';

export default function WindowContainer() {
  const { windows, closeWindow, minimizeWindow, focusWindow } = useWindowManager();

  return (
    <>
      {windows.map((windowInstance, index) => (
        <Window
          key={windowInstance.id}
          id={windowInstance.id}
          title={windowInstance.title}
          initialPosition={{
            x: 100 + index * 30,
            y: 100 + index * 30,
          }}
          initialSize={{
            width: 600,
            height: 400,
          }}
          onClose={() => closeWindow(windowInstance.id)}
          onMinimize={() => minimizeWindow(windowInstance.id)}
          onFocus={() => focusWindow(windowInstance.id)}
          zIndex={windowInstance.zIndex}
          isMinimized={windowInstance.isMinimized}
        >
          {windowInstance.component}
        </Window>
      ))}
    </>
  );
}
