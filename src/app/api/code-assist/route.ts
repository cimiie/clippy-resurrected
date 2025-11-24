import { NextRequest, NextResponse } from 'next/server';
import { getBedrockService } from '@/services/bedrock';
import { getClippyConfig } from '@/config/clippy';

interface CodeAssistRequest {
  prompt: string;
  fileName: string;
  language: string;
  code: string;
  cursorPosition: { line: number; col: number };
}

export async function POST(request: NextRequest) {
  try {
    const { prompt, fileName, language, code, cursorPosition }: CodeAssistRequest = await request.json();

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
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
