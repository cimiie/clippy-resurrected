import { useState, useCallback } from 'react';
import { ChatMessage } from '@/types/clippy';
import { getQuickActionsForContext, getActionContext } from '@/config/clippyActions';
import { QuickActionId } from '@/types/quickActions';

interface UseClippyConversationProps {
  maxResponseLength: number;
  onTokenUsage?: (tokens: number) => void;
  onContextChange?: (context: string) => void;
  sessionTokensUsed?: number;
}

export function useClippyConversation({
  maxResponseLength,
  onTokenUsage,
  onContextChange,
  sessionTokensUsed = 0,
}: UseClippyConversationProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentContext, setCurrentContext] = useState<string>('');
  const [isTyping, setIsTyping] = useState(false);

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
          sessionTokensUsed,
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
  }, [currentContext, messages, maxResponseLength, onTokenUsage, sessionTokensUsed]);

  const generateContextualResponse = useCallback(async (actionId: QuickActionId) => {
    setIsTyping(true);

    try {
      const actionContext = getActionContext(actionId);
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

      const quickActions = response.quickActions || getQuickActionsForContext(actionId);

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
  }, [messages, maxResponseLength, onTokenUsage, onContextChange]);

  const initializeWelcome = useCallback(() => {
    const welcomeMessage: ChatMessage = {
      id: 'welcome',
      role: 'assistant',
      content: "Hi! I'm Clippy, your intelligent assistant! What would you like to do?",
      timestamp: new Date(),
      quickActions: [
        { id: 'play-gloom', label: 'Play Gloom', icon: '👹' },
        { id: 'browse-web', label: 'Browse Web', icon: '🌐' },
        { id: 'launch-bombfinder', label: 'Launch Bomb Finder', icon: '💣' },
        { id: 'launch-wordwrite', label: 'Launch WordWrite', icon: '📝' },
      ],
    };
    setMessages([welcomeMessage]);
  }, []);

  return {
    messages,
    setMessages,
    isTyping,
    currentContext,
    sendMessage,
    generateContextualResponse,
    initializeWelcome,
  };
}
