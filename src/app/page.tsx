'use client';

import { WindowManagerProvider } from '@/contexts/WindowManagerContext';
import WindowContainer from '@/components/WindowContainer';

export default function Home() {
  return (
    <WindowManagerProvider>
      <main style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#008080',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <WindowContainer />
      </main>
    </WindowManagerProvider>
  );
}
