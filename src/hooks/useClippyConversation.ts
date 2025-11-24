import { useState, useCallback } from 'react';
import { ChatMessage, QuickAction } from '@/types/clippy';

interface UseClippyConversationProps {
  maxResponseLength: number;
  onTokenUsage?: (tokens: number) => void;
  onContextChange?: (context: string) => void;
}

export function useClippyConversation({
  maxResponseLength,
  onTokenUsage,
  onContextChange,
}: UseClippyConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentContext, setCurrentContext] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);

  const generateQuickActionsForContext = useCallback((actionId: string): QuickAction[] => {
    const quickActionsMap: Record<string, QuickAction[]> = {
      'launch-minesweeper': [
        { id: 'how-to-play', label: 'How to Play', icon: '❓' },
        { id: 'minesweeper-tips', label: 'Strategy Tips', icon: '💡' },
        { id: 'minesweeper-history', label: 'Cool Facts', icon: '📚' },
      ],
      'how-to-play': [
        { id: 'minesweeper-tips', label: 'Advanced Tips', icon: '💡' },
        { id: 'minesweeper-history', label: 'History', icon: '📚' },
      ],
      'minesweeper-tips': [
        { id: 'how-to-play', label: 'Basic Rules', icon: '❓' },
        { id: 'minesweeper-history', label: 'Cool Facts', icon: '📚' },
      ],
      'minesweeper-history': [
        { id: 'how-to-play', label: 'How to Play', icon: '❓' },
        { id: 'minesweeper-tips', label: 'Strategy Tips', icon: '💡' },
      ],
    };

    return quickActionsMap[actionId] || [];
  }, []);

  const sendMessage = useCallback(async (message: string) => {
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: 'user',
      content: message,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          context: currentContext,
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content,
          })),
          maxTokens: maxResponseLength,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const response = await apiResponse.json();

      if (onTokenUsage) {
        onTokenUsage(response.tokensUsed);
      }

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        quickActions: response.quickActions,
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
    }
  }, [currentContext, messages, maxResponseLength, onTokenUsage]);

  const generateContextualResponse = useCallback(async (actionId: string) => {
    setIsTyping(true);

    try {
      const contextMap: Record<string, { context: string; topic: string }> = {
        'launch-minesweeper': {
          context: 'The user just opened Minesweeper, a classic puzzle game from Windows 95.',
          topic: 'minesweeper game rules strategy tips history',
        },
        'how-to-play': {
          context: 'The user wants to learn how to play Minesweeper.',
          topic: 'minesweeper rules gameplay instructions beginner guide',
        },
        'minesweeper-tips': {
          context: 'The user wants advanced tips for playing Minesweeper.',
          topic: 'minesweeper strategy advanced techniques patterns',
        },
        'minesweeper-history': {
          context: 'The user wants to know about the history of Minesweeper.',
          topic: 'minesweeper history origin windows 95 facts trivia',
        },
      };

      const actionContext = contextMap[actionId];
      if (!actionContext) return;

      setCurrentContext(actionContext.context);
      if (onContextChange) {
        onContextChange(actionContext.context);
      }

      const apiResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: actionContext.topic,
          context: actionContext.context,
          conversationHistory: messages.slice(-5).map(m => ({
            role: m.role,
            content: m.content,
          })),
          maxTokens: maxResponseLength,
        }),
      });

      if (!apiResponse.ok) {
        const errorData = await apiResponse.json();
        throw new Error(errorData.error || 'Failed to get response');
      }

      const response = await apiResponse.json();

      if (onTokenUsage) {
        onTokenUsage(response.tokensUsed);
      }

      const quickActions = response.quickActions || generateQuickActionsForContext(actionId);

      const assistantMessage: ChatMessage = {
        id: `msg-${Date.now()}-assistant`,
        role: 'assistant',
        content: response.content,
        timestamp: new Date(),
        quickActions,
        context: actionContext.context,
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
    }
  }, [messages, maxResponseLength, onTokenUsage, onContextChange, generateQuickActionsForContext]);

  const initializeWelcome = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm Clippy, your intelligent assistant! What would you like to do?",
      timestamp: new Date(),
      quickActions: [
        { id: 'launch-minesweeper', label: 'Launch Minesweeper', icon: '💣' },
      ],
    };
    setMessages([welcomeMessage]);
  }, []);

  return {
    messages,
    isTyping,
    currentContext,
    sendMessage,
    generateContextualResponse,
    initializeWelcome,
  };
}
