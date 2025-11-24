'use client';

import { useState, useEffect } from 'react';
import { ClippyAnimation } from '@/types/clippy';
import { useClippyConversation } from '@/hooks/useClippyConversation';
import ClippyCharacter from './ClippyCharacter';
import ClippyChatWindow from './ClippyChatWindow';
import styles from './ClippyAssistant.module.css';

interface ClippyAssistantProps {
  maxResponseLength: number;
  onTokenUsage?: (tokens: number) => void;
  onQuickAction?: (actionId: string) => void;
  onContextChange?: (context: string) => void;
}

export default function ClippyAssistant({
  maxResponseLength,
  onTokenUsage,
  onQuickAction,
  onContextChange,
}: ClippyAssistantProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);

  const {
    messages,
    isTyping,
    sendMessage,
    generateContextualResponse,
    initializeWelcome,
  } = useClippyConversation({
    maxResponseLength,
    onTokenUsage,
    onContextChange,
  });

  useEffect(() => {
    if (isChatOpen && messages.length === 0) {
      initializeWelcome();
    }
  }, [isChatOpen, messages.length, initializeWelcome]);

  // Derive animation state from isTyping
  const animation: ClippyAnimation = isTyping ? 'thinking' : 'idle';

  const handleClippyClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleQuickAction = async (actionId: string) => {
    if (onQuickAction) {
      onQuickAction(actionId);
    }
    await generateContextualResponse(actionId);
  };

  return (
    <div className={styles.clippyContainer}>
      <ClippyCharacter
        animation={animation}
        isTyping={isTyping}
        onClick={handleClippyClick}
      />

      {isChatOpen && (
        <ClippyChatWindow
          messages={messages}
          isTyping={isTyping}
          onClose={() => setIsChatOpen(false)}
          onSubmit={sendMessage}
          onQuickAction={handleQuickAction}
        />
      )}
    </div>
  );
}
