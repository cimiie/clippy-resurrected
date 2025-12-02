'use client';

import { useCallback, useRef } from 'react';
import ClippyAssistant from './ClippyAssistant';
import TokenController from '../dev/TokenController';
import { useWindowManager } from '@/contexts/WindowManagerContext';
import { useTokenContext } from '@/contexts/TokenContext';
import MinesweeperApp from '@/apps/BombFinder/BombFinder';
import NotepadApp from '@/apps/WordWrite/WordWrite';
import GloomApp from '@/apps/Gloom/Gloom';
import MockBrowser from '@/apps/WebFinder/WebFinder';
import { QuickActionId } from '@/types/quickActions';

interface ClippyWithControllerProps {
  helpContext?: string | null;
  onHelpContextHandled?: () => void;
  onShutdown?: () => void;
}

const MAX_RESPONSE_LENGTH = 1000; // Fixed max response length

export default function ClippyWithController({
  helpContext,
  onHelpContextHandled,
  onShutdown,
}: ClippyWithControllerProps) {
  const clippyRef = useRef<{ openChatWithContext: (context: string) => void } | null>(null);
  const { openWindow } = useWindowManager();

  // Use global token context
  const { tokensUsed, sessionLimit, handleTokenUsage } = useTokenContext();





  const handleQuickAction = useCallback((actionId: QuickActionId) => {
    switch (actionId) {
      case 'play-gloom':
      case 'gloom-controls':
      case 'gloom-history':
      case 'gloom-tips':
        openWindow(<GloomApp onClose={() => {}} />, 'Gloom');
        break;
      case 'browse-web':
      case 'web-tips':
      case 'web-history':
      case 'web-features':
        openWindow(<MockBrowser />, 'Web Finder');
        break;
      case 'launch-bombfinder':
      case 'how-to-play':
      case 'bombfinder-tips':
      case 'bombfinder-history':
        openWindow(<MinesweeperApp />, 'Bomb Finder');
        break;
      case 'launch-wordwrite':
      case 'wordwrite-shortcuts':
      case 'wordwrite-tips':
      case 'wordwrite-history':
        openWindow(<NotepadApp />, 'WordWrite');
        break;
    }
  }, [openWindow]);

  return (
    <>
      <TokenController
        tokensUsed={tokensUsed}
        sessionLimit={sessionLimit}
      />
      <ClippyAssistant
        ref={clippyRef}
        maxResponseLength={MAX_RESPONSE_LENGTH}
        onTokenUsage={handleTokenUsage}
        onQuickAction={handleQuickAction}
        helpContext={helpContext}
        onHelpContextHandled={onHelpContextHandled}
        onShutdown={onShutdown}
        sessionTokensUsed={tokensUsed}
      />
    </>
  );
}
