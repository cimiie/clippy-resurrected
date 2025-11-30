'use client';

import { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import { ClippyAnimation } from '@/types/clippy';
import { useClippyConversation } from '@/hooks/useClippyConversation';
import ClippyCharacter from './ClippyCharacter';
import ClippyChatWindow from './ClippyChatWindow';
import ConfirmDialog from '../common/ConfirmDialog';
import styles from './ClippyAssistant.module.css';

interface ClippyAssistantProps {
  maxResponseLength: number;
  onTokenUsage?: (tokens: number) => void;
  onQuickAction?: (actionId: string) => void;
  onContextChange?: (context: string) => void;
  helpContext?: string | null;
  onHelpContextHandled?: () => void;
  onShutdown?: () => void;
}

export interface ClippyAssistantRef {
  openChatWithContext: (context: string) => void;
}

interface Position {
  x: number;
  y: number;
}

const ClippyAssistant = forwardRef<ClippyAssistantRef, ClippyAssistantProps>(({
  maxResponseLength,
  onTokenUsage,
  onQuickAction,
  onContextChange,
  helpContext,
  onHelpContextHandled,
  onShutdown,
}, ref) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showIntroText, setShowIntroText] = useState(true);
  const [position, setPosition] = useState<Position>(() => {
    // Only access window on client-side - start in center
    if (typeof window !== 'undefined') {
      return {
        x: (window.innerWidth - 80) / 2,
        y: (window.innerHeight - 80) / 2,
      };
    }
    return { x: 0, y: 0 };
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
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

  // Handle help context from apps
  useEffect(() => {
    if (!helpContext) return;

    const helpActionMap: Record<string, string> = {
      'Gloom': 'play-gloom',
      'Web Finder': 'browse-web',
      'Bomb Sweeper': 'launch-bombsweeper',
      'WordWrite': 'launch-wordwrite',
    };
    const actionId = helpActionMap[helpContext];
    
    if (actionId) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowIntroText(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsChatOpen(true);
      
      // Generate response
      generateContextualResponse(actionId);
    }
    
    if (onHelpContextHandled) {
      onHelpContextHandled();
    }
  }, [helpContext, generateContextualResponse, onHelpContextHandled]);

  // Expose method to open chat with context
  useImperativeHandle(ref, () => ({
    openChatWithContext: (context: string) => {
      setShowIntroText(false);
      setIsChatOpen(true);
      const helpActionMap: Record<string, string> = {
        'Gloom': 'play-gloom',
        'Web Finder': 'browse-web',
        'Bomb Sweeper': 'launch-bombsweeper',
        'WordWrite': 'launch-wordwrite',
      };
      const actionId = helpActionMap[context];
      if (actionId) {
        generateContextualResponse(actionId);
      }
    },
  }));

  // Derive animation state from isTyping
  const animation: ClippyAnimation = isTyping ? 'thinking' : 'idle';

  const handleClippyClick = () => {
    setShowIntroText(false);
    setIsChatOpen(!isChatOpen);
  };

  const handleQuickAction = async (actionId: string) => {
    if (onQuickAction) {
      onQuickAction(actionId);
    }
    await generateContextualResponse(actionId);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDialog(false);
    
    if (onShutdown) {
      // Show "You asked for this" message briefly before shutdown
      setIsChatOpen(false);
      setShowIntroText(true);
      
      // Create a temporary message element
      const messageDiv = document.createElement('div');
      messageDiv.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #c0c0c0;
        border: 2px outset #ffffff;
        padding: 20px 40px;
        font-family: 'MS Sans Serif', Arial, sans-serif;
        font-size: 14px;
        z-index: 10001;
        box-shadow: 2px 2px 0 rgba(0, 0, 0, 0.4);
      `;
      messageDiv.textContent = 'You asked for this...';
      document.body.appendChild(messageDiv);
      
      // Wait 2 seconds then shutdown
      setTimeout(() => {
        document.body.removeChild(messageDiv);
        onShutdown();
      }, 2000);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirmDialog(false);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(`.${styles.chatWindow}`)) {
      return; // Don't drag if clicking on chat window
    }
    
    setShowIntroText(false);
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

      // Check if hovering over trash icon
      const trashIcon = document.querySelector('[data-icon-id="trash"]');
      if (trashIcon) {
        const rect = trashIcon.getBoundingClientRect();
        const isOver = 
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;
        
        // Add/remove hover class
        if (isOver) {
          trashIcon.classList.add('clippy-hover');
        } else {
          trashIcon.classList.remove('clippy-hover');
        }
      }
    };

    const handleMouseUp = (e: MouseEvent) => {
      if (isDragging) {
        // Remove hover class from trash
        const trashIcon = document.querySelector('[data-icon-id="trash"]');
        if (trashIcon) {
          trashIcon.classList.remove('clippy-hover');
          
          const rect = trashIcon.getBoundingClientRect();
          const clippyX = e.clientX;
          const clippyY = e.clientY;
          
          // Check if Clippy was dropped on the trash icon
          if (
            clippyX >= rect.left &&
            clippyX <= rect.right &&
            clippyY >= rect.top &&
            clippyY <= rect.bottom
          ) {
            // Show confirmation dialog
            setShowConfirmDialog(true);
          }
        }
      }
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
  }, [isDragging, dragOffset, onShutdown]);

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
    <>
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

        {showIntroText && (
          <div className={styles.introText}>
            <div className={styles.introTextBubble}>
              Hi! I&apos;m Clippy!
              <br />
              Click me to chat or drag me around!
            </div>
          </div>
        )}

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

      {showConfirmDialog && (
        <ConfirmDialog
          title="Delete System Component"
          message="Clippy is a required system component. Removing it will cause irreversible system damage. Are you sure you want to continue?"
          onConfirm={handleConfirmDelete}
          onCancel={handleCancelDelete}
        />
      )}
    </>
  );
});

ClippyAssistant.displayName = 'ClippyAssistant';

export default ClippyAssistant;
