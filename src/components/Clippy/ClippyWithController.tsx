'use client';

import { useState, useCallback, useRef } from 'react';
import ClippyAssistant from './ClippyAssistant';
import TokenController from '../dev/TokenController';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import MinesweeperApp from '@/apps/BombSweeper/BombSweeper';
import NotepadApp from '@/apps/WordWrite/WordWrite';
import DoomApp from '@/apps/Gloom/Gloom';
import MockBrowser from '@/apps/WebFinder/WebFinder';

interface ClippyWithControllerProps {
  helpContext?: string | null;
  onHelpContextHandled?: () => void;
  onShutdown?: () => void;
}

export default function ClippyWithController({ helpContext, onHelpContextHandled, onShutdown }: ClippyWithControllerProps) {
  const [maxResponseLength, setMaxResponseLength] = useState(1000);
  const [tokensUsed, setTokensUsed] = useState(0);
  const clippyRef = useRef<{ openChatWithContext: (context: string) => void } | null>(null);
  const { openWindow } = useWindowManager();

  const handleTokenUsage = useCallback((tokens: number) => {
    setTokensUsed((prev) => prev + tokens);
  }, []);

  const handleResetUsage = useCallback(() => {
    setTokensUsed(0);
  }, []);

  const handleTokenLimitChange = useCallback((_limit: number) => {
    // Token limit is managed by TokenController component
  }, []);

  const handleMaxResponseLengthChange = useCallback((length: number) => {
    setMaxResponseLength(length);
  }, []);





  const handleQuickAction = useCallback((actionId: string) => {
    switch (actionId) {
      case 'play-gloom':
        openWindow(<DoomApp onClose={() => {}} />, 'Gloom');
        break;
      case 'browse-web':
        openWindow(<MockBrowser />, 'Web Finder');
        break;
      case 'launch-bombsweeper':
        openWindow(<MinesweeperApp />, 'Bomb Sweeper');
        break;
      case 'launch-wordwrite':
        openWindow(<NotepadApp />, 'WordWrite');
        break;
      default:
        console.log('Unknown quick action:', actionId);
    }
  }, [openWindow]);

  return (
    <>
      <TokenController
        onTokenLimitChange={handleTokenLimitChange}
        onMaxResponseLengthChange={handleMaxResponseLengthChange}
        tokensUsed={tokensUsed}
        onResetUsage={handleResetUsage}
      />
      <ClippyAssistant
        ref={clippyRef}
        maxResponseLength={maxResponseLength}
        onTokenUsage={handleTokenUsage}
        onQuickAction={handleQuickAction}
        helpContext={helpContext}
        onHelpContextHandled={onHelpContextHandled}
        onShutdown={onShutdown}
      />
    </>
  );
}
