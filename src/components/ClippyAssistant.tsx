'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './ClippyAssistant.module.css';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ClippyAssistantProps {
  maxResponseLength: number;
  onTokenUsage?: (tokens: number) => void;
}

export default function ClippyAssistant({
  maxResponseLength,
  onTokenUsage,
}: ClippyAssistantProps) {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [animation, setAnimation] = useState<'idle' | 'thinking' | 'speaking'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Idle animation cycle
  useEffect(() => {
    if (!isTyping && animation === 'idle') {
      const interval = setInterval(() => {
        // Trigger idle animation periodically
        setAnimation('idle');
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isTyping, animation]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleClippyClick = () => {
    setIsChatOpen(!isChatOpen);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isTyping) {
      return;
    }

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    setAnimation('thinking');

    try {
      // Call the API route instead of calling Bedrock directly
      setAnimation('speaking');
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          maxTokens: maxResponseLength,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const response = await apiResponse.json();

      // Track token usage
      if (onTokenUsage) {
        onTokenUsage(response.tokensUsed);
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: `msg-${Date.now()}-error`,
        role: 'assistant',
        content: error instanceof Error 
          ? `Sorry, I encountered an error: ${error.message}` 
          : 'Sorry, I encountered an unexpected error.',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
      setAnimation('idle');
    }
  };

  return (
    <div className={styles.clippyContainer}>
      {/* Clippy Character */}
      <div 
        className={`${styles.clippy} ${styles[animation]}`}
        onClick={handleClippyClick}
        title="Click me for help!"
      >
        <div className={styles.clippyBody}>
          📎
        </div>
      </div>

      {/* Chat Interface */}
      {isChatOpen && (
        <div className={styles.chatWindow}>
          <div className={styles.chatTitleBar}>
            <span className={styles.chatTitle}>Clippy - AWS Assistant</span>
            <button
              className={styles.chatCloseButton}
              onClick={() => setIsChatOpen(false)}
              aria-label="Close chat"
            >
              ×
            </button>
          </div>

          <div className={styles.chatContent}>
            <div className={styles.messagesContainer}>
              {messages.length === 0 && (
                <div className={styles.welcomeMessage}>
                  <p>Hi! I&apos;m Clippy, your AWS assistant!</p>
                  <p>Ask me anything about AWS services.</p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`${styles.message} ${
                    message.role === 'user' ? styles.userMessage : styles.assistantMessage
                  }`}
                >
                  <div className={styles.messageContent}>{message.content}</div>
                  <div className={styles.messageTime}>
                    {message.timestamp.toLocaleTimeString()}
                  </div>
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
                type="text"
                className={styles.input}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about AWS..."
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
      )}
    </div>
  );
}
