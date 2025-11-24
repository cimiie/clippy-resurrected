'use client';

import { useState, useCallback } from 'react';
import ClippyAssistant from './ClippyAssistant';
import TokenController from './TokenController';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import MinesweeperApp from '@/apps/MinesweeperApp';

export default function ClippyWithController() {
  const [maxResponseLength, setMaxResponseLength] = useState(1000);
  const [tokensUsed, setTokensUsed] = useState(0);
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
      case 'launch-minesweeper':
        openWindow(<MinesweeperApp />, 'Minesweeper');
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
        maxResponseLength={maxResponseLength}
        onTokenUsage={handleTokenUsage}
        onQuickAction={handleQuickAction}
      />
    </>
  );
}
