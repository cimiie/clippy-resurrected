import { NextRequest, NextResponse } from 'next/server';
import { getBedrockService } from '@/services/bedrock';
import { getMCPService } from '@/services/mcp';

interface ConversationMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { message, maxTokens, context, conversationHistory } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Initialize services
    const bedrockService = getBedrockService();
    const mcpService = getMCPService();

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

    // Add system prompt for Clippy personality
    const systemPrompt = `You are Clippy, the helpful and enthusiastic assistant from Windows 95. 
You're knowledgeable, friendly, and love helping users with their questions. 
When discussing applications or features, provide helpful, accurate information in a conversational tone.
Keep responses concise but informative (2-3 paragraphs max unless asked for more detail).`;
    
    contextArray.unshift(systemPrompt);

    // Query MCP for AWS documentation context if relevant
    const docResults = await mcpService.queryDocumentation(message);
    if (docResults.length > 0) {
      const docContext = docResults.map((doc) => `${doc.title}\n${doc.content}`);
      contextArray.push(...docContext);
    }

    // Generate response using Bedrock
    const response = await bedrockService.generateResponse(
      enhancedPrompt,
      contextArray,
      {
        maxTokens: maxTokens || 1000,
        temperature: 0.7,
        topP: 0.9,
      }
    );

    return NextResponse.json({
      content: response.content,
      tokensUsed: response.tokensUsed,
      finishReason: response.finishReason,
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
