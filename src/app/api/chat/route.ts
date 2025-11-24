import { NextRequest, NextResponse } from 'next/server';
import { getBedrockService } from '@/services/bedrock';
import { getMCPService } from '@/services/mcp';

export async function POST(request: NextRequest) {
  try {
    const { message, maxTokens } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // Initialize services
    const bedrockService = getBedrockService();
    const mcpService = getMCPService();

    // Query MCP for AWS documentation context
    const docResults = await mcpService.queryDocumentation(message);
    const context = docResults.map((doc) => `${doc.title}\n${doc.content}`);

    // Generate response using Bedrock
    const response = await bedrockService.generateResponse(
      message,
      context,
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
