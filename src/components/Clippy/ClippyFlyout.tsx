'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/clippy';
import { useClippyConversation } from '@/hooks/useClippyConversation';
import ClippyCharacter from './ClippyCharacter';
import styles from './ClippyFlyout.module.css';

interface ClippyFlyoutProps {
  appName: string;
  onClose: () => void;
}

export default function ClippyFlyout({ appName, onClose }: ClippyFlyoutProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    setMessages,
    isTyping,
    sendMessage,
    generateContextualResponse,
  } = useClippyConversation({
    maxResponseLength: 500,
  });

  // Initialize with a simple welcome message
  useEffect(() => {
    if (messages.length > 0) return; // Only initialize once

    const welcomeMessages: Record<string, { content: string; actions: Array<{ id: string; label: string; icon: string }> }> = {
      'Gloom': {
        content: "Welcome to Gloom! This is a classic first-person shooter where you battle demons and monsters. Ready to play?",
        actions: [
          { id: 'gloom-controls', label: 'Game Controls', icon: '🎮' },
          { id: 'gloom-tips', label: 'Survival Tips', icon: '💡' },
          { id: 'gloom-history', label: 'About Gloom', icon: '📚' },
        ],
      },
      'Web Finder': {
        content: "Welcome to Web Finder! Browse the web with this classic browser. What would you like to know?",
        actions: [
          { id: 'web-tips', label: 'Browsing Tips', icon: '💡' },
          { id: 'web-features', label: 'Cool Features', icon: '✨' },
          { id: 'web-history', label: 'Browser History', icon: '📚' },
        ],
      },
      'Bomb Sweeper': {
        content: "Welcome to Bomb Sweeper! Clear the minefield by flagging all the bombs. Can you beat the clock?",
        actions: [
          { id: 'how-to-play', label: 'How to Play', icon: '❓' },
          { id: 'bombsweeper-tips', label: 'Strategy Tips', icon: '💡' },
          { id: 'bombsweeper-history', label: 'Cool Facts', icon: '📚' },
        ],
      },
      'WordWrite': {
        content: "Welcome to WordWrite! A simple text editor for all your writing needs. What can I help you with?",
        actions: [
          { id: 'wordwrite-shortcuts', label: 'Keyboard Shortcuts', icon: '⌨️' },
          { id: 'wordwrite-tips', label: 'Tips & Tricks', icon: '💡' },
          { id: 'wordwrite-history', label: 'About WordWrite', icon: '📚' },
        ],
      },
    };

    const welcome = welcomeMessages[appName];
    if (welcome) {
      const welcomeMessage: ChatMessage = {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: welcome.content,
        timestamp: new Date(),
        quickActions: welcome.actions,
      };
      setMessages([welcomeMessage]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    await sendMessage(inputValue);
    setInputValue('');
    inputRef.current?.focus();
  };

  const handleQuickAction = async (actionId: string) => {
    await generateContextualResponse(actionId);
  };

  return (
    <div className={styles.flyout}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <ClippyCharacter animation={isTyping ? 'thinking' : 'idle'} isTyping={isTyping} />
          <span className={styles.title}>Clippy Help - {appName}</span>
        </div>
        <button className={styles.closeButton} onClick={onClose} title="Close">
          ×
        </button>
      </div>

      <div className={styles.messagesContainer}>
        {messages.map((message) => (
          <div
            key={message.id}
            className={`${styles.message} ${
              message.role === 'user' ? styles.userMessage : styles.assistantMessage
            }`}
          >
            <div className={styles.messageContent}>{message.content}</div>
            {message.quickActions && message.quickActions.length > 0 && (
              <div className={styles.quickActions}>
                {message.quickActions.map((action) => (
                  <button
                    key={action.id}
                    className={styles.quickActionButton}
                    onClick={() => handleQuickAction(action.id)}
                  >
                    <span className={styles.quickActionIcon}>{action.icon}</span>
                    {action.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className={`${styles.message} ${styles.assistantMessage}`}>
            <div className={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <form className={styles.inputForm} onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Ask Clippy anything..."
          disabled={isTyping}
        />
        <button
          type="submit"
          className={styles.sendButton}
          disabled={!inputValue.trim() || isTyping}
        >
          Send
        </button>
      </form>
    </div>
  );
}
