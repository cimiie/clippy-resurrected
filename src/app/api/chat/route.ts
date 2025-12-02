import { NextRequest, NextResponse } from 'next/server';
import { getBedrockService } from '@/services/bedrock';
import { getClippyConfig } from '@/config/clippy';
import { secureApiRoute } from '@/lib/security';

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { message, maxTokens, context, conversationHistory, sessionTokensUsed } = payload;

    // Apply security checks
    const securityCheck = secureApiRoute(request, payload, {
      rateLimit: { maxRequests: 20, windowMs: 60000 }, // 20 requests per minute
      maxMessageLength: 5000,
      maxTokens: 2000,
    });

    if (!securityCheck.allowed) {
      return NextResponse.json(
        { error: securityCheck.error },
        { 
          status: securityCheck.error?.includes('Rate limit') ? 429 : 403,
          headers: securityCheck.headers 
        }
      );
    }

    // Check session token limit (10k tokens per session)
    const SESSION_LIMIT = 10000;
    if (sessionTokensUsed && sessionTokensUsed >= SESSION_LIMIT) {
      return NextResponse.json(
        { error: 'Session token limit reached. Please refresh the page to start a new session.' },
        { 
          status: 429,
          headers: securityCheck.headers 
        }
      );
    }

    // Initialize services
    const bedrockService = getBedrockService();

    // Build enhanced prompt with conversation history and context
    const enhancedPrompt = message;
    const contextArray: string[] = [];

    // Add current context if provided
    if (context) {
      contextArray.push(`Current Context: ${context}`);
    }

    // Add conversation history for continuity
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const historyText = conversationHistory
        .map((msg: ConversationMessage) => `${msg.role}: ${msg.content}`)
        .join('\n');
      contextArray.push(`Recent Conversation:\n${historyText}`);
    }

    // Add system prompt for Clippy personality from centralized config
    const clippyConfig = getClippyConfig('default');
    contextArray.unshift(clippyConfig.systemPrompt);

    // Generate response using Bedrock with Clippy config
    const response = await bedrockService.generateResponse(
      enhancedPrompt,
      contextArray,
      {
        maxTokens: maxTokens || clippyConfig.maxTokens,
        temperature: clippyConfig.temperature,
        topP: clippyConfig.topP,
      }
    );

    return NextResponse.json({
      content: response.content,
      tokensUsed: response.tokensUsed,
      finishReason: response.finishReason,
    }, {
      headers: securityCheck.headers
    });
  } catch (error) {
    console.error('Chat API error:', error);
    
    return NextResponse.json(
      { 
        error: error instanceof Error 
          ? error.message 
          : 'An unexpected error occurred' 
      },
      { status: 500 }
    );
  }
}
