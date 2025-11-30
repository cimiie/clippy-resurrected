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
      'play-doom': [
        { id: 'doom-controls', label: 'Game Controls', icon: '🎮' },
        { id: 'doom-history', label: 'Gloom History', icon: '📚' },
        { id: 'doom-tips', label: 'Survival Tips', icon: '💡' },
      ],
      'doom-controls': [
        { id: 'doom-tips', label: 'Survival Tips', icon: '💡' },
        { id: 'doom-history', label: 'History', icon: '📚' },
      ],
      'doom-history': [
        { id: 'doom-controls', label: 'Controls', icon: '🎮' },
        { id: 'doom-tips', label: 'Tips', icon: '💡' },
      ],
      'doom-tips': [
        { id: 'doom-controls', label: 'Controls', icon: '🎮' },
        { id: 'doom-history', label: 'History', icon: '📚' },
      ],
      'browse-internet': [
        { id: 'internet-tips', label: 'Browsing Tips', icon: '💡' },
        { id: 'internet-history', label: 'IE History', icon: '📚' },
        { id: 'internet-features', label: 'Cool Features', icon: '✨' },
      ],
      'internet-tips': [
        { id: 'internet-features', label: 'Features', icon: '✨' },
        { id: 'internet-history', label: 'History', icon: '📚' },
      ],
      'internet-history': [
        { id: 'internet-tips', label: 'Tips', icon: '💡' },
        { id: 'internet-features', label: 'Features', icon: '✨' },
      ],
      'internet-features': [
        { id: 'internet-tips', label: 'Tips', icon: '💡' },
        { id: 'internet-history', label: 'History', icon: '📚' },
      ],
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
      'launch-notepad': [
        { id: 'notepad-shortcuts', label: 'Keyboard Shortcuts', icon: '⌨️' },
        { id: 'notepad-tips', label: 'Tips & Tricks', icon: '💡' },
        { id: 'notepad-history', label: 'TextEdit History', icon: '📚' },
      ],
      'notepad-shortcuts': [
        { id: 'notepad-tips', label: 'Tips & Tricks', icon: '💡' },
        { id: 'notepad-history', label: 'History', icon: '📚' },
      ],
      'notepad-tips': [
        { id: 'notepad-shortcuts', label: 'Shortcuts', icon: '⌨️' },
        { id: 'notepad-history', label: 'History', icon: '📚' },
      ],
      'notepad-history': [
        { id: 'notepad-shortcuts', label: 'Shortcuts', icon: '⌨️' },
        { id: 'notepad-tips', label: 'Tips & Tricks', icon: '💡' },
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
        'play-gloom': {
          context: 'The user just launched Gloom, a classic first-person shooter game.',
          topic: 'gloom game launched ready to play controls tips classic fps',
        },
        'gloom-controls': {
          context: 'The user wants to learn the controls for playing Gloom.',
          topic: 'gloom game controls keyboard mouse movement shooting weapons',
        },
        'gloom-history': {
          context: 'The user wants to know about the history of Gloom.',
          topic: 'gloom history classic fps game revolutionary shooter',
        },
        'gloom-tips': {
          context: 'The user wants survival tips for playing Gloom.',
          topic: 'gloom gameplay tips strategy survival secrets tricks',
        },
        'browse-web': {
          context: 'The user just opened Web Finder to browse the web.',
          topic: 'web finder opened ready to browse web navigation features',
        },
        'web-tips': {
          context: 'The user wants tips for browsing with Web Finder.',
          topic: 'web finder browsing tips navigation shortcuts favorites',
        },
        'web-history': {
          context: 'The user wants to know about the history of Web Finder.',
          topic: 'web finder history web browser evolution internet browsing',
        },
        'web-features': {
          context: 'The user wants to learn about Web Finder features.',
          topic: 'web finder features favorites bookmarks navigation tools',
        },
        'launch-bombsweeper': {
          context: 'The user just opened Bomb Sweeper, a classic puzzle game.',
          topic: 'bomb sweeper game rules strategy tips history',
        },
        'how-to-play': {
          context: 'The user wants to learn how to play Bomb Sweeper.',
          topic: 'bomb sweeper rules gameplay instructions beginner guide',
        },
        'bombsweeper-tips': {
          context: 'The user wants advanced tips for playing Bomb Sweeper.',
          topic: 'bomb sweeper strategy advanced techniques patterns',
        },
        'bombsweeper-history': {
          context: 'The user wants to know about the history of Bomb Sweeper.',
          topic: 'bomb sweeper history origin classic puzzle game facts trivia',
        },
        'launch-wordwrite': {
          context: 'The user just opened WordWrite, a simple text editor.',
          topic: 'wordwrite text editor features shortcuts tips',
        },
        'wordwrite-shortcuts': {
          context: 'The user wants to learn keyboard shortcuts for WordWrite.',
          topic: 'wordwrite keyboard shortcuts hotkeys commands quick access',
        },
        'wordwrite-tips': {
          context: 'The user wants tips and tricks for using WordWrite effectively.',
          topic: 'wordwrite tips tricks productivity features hidden functions',
        },
        'wordwrite-history': {
          context: 'The user wants to know about the history of WordWrite.',
          topic: 'wordwrite history origin windows evolution facts trivia',
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
        { id: 'play-gloom', label: 'Play Gloom', icon: '👹' },
        { id: 'browse-web', label: 'Browse Web', icon: '🌐' },
        { id: 'launch-bombsweeper', label: 'Launch Bomb Sweeper', icon: '💣' },
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
