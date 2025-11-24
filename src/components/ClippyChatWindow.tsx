'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '@/types/clippy';
import ClippyMessage from './ClippyMessage';
import styles from './ClippyAssistant.module.css';

interface ClippyChatWindowProps {
  messages: ChatMessage[];
  isTyping: boolean;
  onClose: () => void;
  onSubmit: (message: string) => void;
  onQuickAction: (actionId: string) => void;
  position: { x: number; y: number };
}

export default function ClippyChatWindow({
  messages,
  isTyping,
  onClose,
  onSubmit,
  onQuickAction,
  position,
}: ClippyChatWindowProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isTyping) {
      return;
    }

    onSubmit(inputValue.trim());
    setInputValue('');
  };

  return (
    <div 
      className={styles.chatWindow}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    >
      <div className={styles.chatTitleBar}>
        <span className={styles.chatTitle}>Clippy - Intelligent Assistant</span>
        <button
          className={styles.chatCloseButton}
          onClick={onClose}
          aria-label="Close chat"
        >
          ×
        </button>
      </div>

      <div className={styles.chatContent}>
        <div className={styles.messagesContainer}>
          {messages.map((message) => (
            <ClippyMessage
              key={message.id}
              message={message}
              onQuickAction={onQuickAction}
            />
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
            type="text"
            className={styles.input}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type a message..."
            disabled={isTyping}
          />
          <button
            type="submit"
            className={styles.sendButton}
            disabled={isTyping || !inputValue.trim()}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
