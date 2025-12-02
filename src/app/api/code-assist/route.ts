import { NextRequest, NextResponse } from 'next/server';
import { getBedrockService } from '@/services/bedrock';
import { getClippyConfig } from '@/config/clippy';
import { secureApiRoute } from '@/lib/security';

interface CodeAssistRequest {
  prompt: string;
  fileName: string;
  language: string;
  code: string;
  cursorPosition: { line: number; col: number };
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    const { prompt, fileName, language, code, cursorPosition }: CodeAssistRequest = payload;

    // Apply security checks
    const securityCheck = secureApiRoute(request, { message: prompt }, {
      rateLimit: { maxRequests: 30, windowMs: 60000 }, // 30 requests per minute (code assist needs more)
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

    // Initialize Bedrock service
    const bedrockService = getBedrockService();
    const clippyConfig = getClippyConfig('code');

    // Build context for code assistance with agent-mode instructions
    const agentPrompt = `You are Clippy, a friendly code generation agent from Kiro 97!

RESPONSE FORMAT:
1. Start with a friendly 1-2 sentence summary of what you did
2. Then provide the code in markdown code blocks with language identifier (e.g., \`\`\`javascript)
3. After the code block, add a "Next steps:" section with 2-3 helpful suggestions

EXAMPLE:
I created a hello world function for you!

\`\`\`javascript
function helloWorld() {
  console.log("Hello, World!");
}
\`\`\`

Next steps:
- Call the function with helloWorld()
- Add parameters to customize the greeting
- Try console.error() for error messages

RULES:
- Be friendly and encouraging
- Keep summaries brief but warm
- Suggestions should be practical and relevant
- Do NOT explain how to use the editor
- If asked for explanations only, skip the code block`;

    const contextArray: string[] = [
      agentPrompt,
      `Current file: ${fileName}`,
      `Language: ${language}`,
      `Code:\n${code}`,
      `Cursor position: Line ${cursorPosition.line}, Col ${cursorPosition.col}`
    ];

    // Generate response using Bedrock
    const response = await bedrockService.generateResponse(
      prompt,
      contextArray,
      {
        maxTokens: clippyConfig.maxTokens,
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
    console.error('Code assist API error:', error);
    
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
