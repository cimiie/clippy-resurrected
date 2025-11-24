'use client';

import { useState, useEffect, useRef } from 'react';
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

interface Position {
  x: number;
  y: number;
}

export default function ClippyAssistant({
  maxResponseLength,
  onTokenUsage,
  onQuickAction,
  onContextChange,
}: ClippyAssistantProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [position, setPosition] = useState<Position>({ 
    x: window.innerWidth - 100, 
    y: window.innerHeight - 120 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

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

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.chatWindow}`)) {
      return; // Don't drag if clicking on chat window
    }
    
    setIsDragging(true);
    setHasMoved(false);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleClippyClickInternal = () => {
    // Only toggle chat if we didn't drag
    if (!hasMoved) {
      handleClippyClick();
    }
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;

      setHasMoved(true);
      
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;

      // Keep Clippy within viewport bounds
      const maxX = window.innerWidth - 80;
      const maxY = window.innerHeight - 80;

      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Calculate chat window position based on Clippy's position and viewport edges
  const getChatWindowPosition = () => {
    const chatWidth = 350;
    const chatHeight = 450;
    const clippyWidth = 80;
    const clippyHeight = 80;
    const margin = 10;

    let chatX = 0;
    let chatY = position.y - chatHeight - margin;

    // Check if there's room above
    if (chatY < 0) {
      // Not enough room above, try below
      chatY = position.y + clippyHeight + margin;
      
      // If still not enough room, position at top
      if (chatY + chatHeight > window.innerHeight) {
        chatY = margin;
      }
    }

    // Check horizontal positioning
    // Try to align with Clippy on the right
    chatX = position.x + clippyWidth - chatWidth;
    
    // If too far left, align left edge with Clippy
    if (chatX < 0) {
      chatX = position.x;
    }
    
    // If still too far right, push left
    if (chatX + chatWidth > window.innerWidth) {
      chatX = window.innerWidth - chatWidth - margin;
    }

    return { x: chatX, y: chatY };
  };

  const chatPosition = getChatWindowPosition();

  return (
    <div 
      ref={containerRef}
      className={styles.clippyContainer}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      onMouseDown={handleMouseDown}
    >
      <ClippyCharacter
        animation={animation}
        isTyping={isTyping}
        onClick={handleClippyClickInternal}
      />

      {isChatOpen && (
        <ClippyChatWindow
          messages={messages}
          isTyping={isTyping}
          onClose={() => setIsChatOpen(false)}
          onSubmit={sendMessage}
          onQuickAction={handleQuickAction}
          position={chatPosition}
        />
      )}
    </div>
  );
}
