---
inclusion: always
---

# AI & Bedrock Guidelines

## Core Rule: Server-Side Only

**⚠️ CRITICAL: AWS Bedrock must ONLY be called from server-side code**

### Why Server-Side Only?

1. **Security**: API keys (BEDROCK_API_KEY) must never be exposed to the browser
2. **Architecture**: Bedrock SDK requires Node.js runtime, cannot run in browser
3. **Cost Control**: Server-side allows rate limiting and usage monitoring
4. **Error Handling**: Better control over API failures and retries

## Implementation Pattern

### ✅ CORRECT: API Route Pattern

```typescript
// src/app/api/my-ai-feature/route.ts (SERVER-SIDE)
import { NextRequest, NextResponse } from 'next/server';
import { getBedrockService } from '@/services/bedrock';
import { getClippyConfig } from '@/config/clippy';

export async function POST(request: NextRequest) {
  const { prompt, context } = await request.json();
  
  const bedrock = getBedrockService();
  const config = getClippyConfig('default');

  const response = await bedrock.generateResponse(
    prompt,
    [config.systemPrompt, ...context],
    {
      maxTokens: config.maxTokens,
      temperature: config.temperature,
      topP: config.topP
    }
  );

  return NextResponse.json({ 
    content: response.content,
    tokensUsed: response.tokensUsed 
  });
}
```

```typescript
// src/components/MyComponent.tsx (CLIENT-SIDE)
'use client';

async function askClippy(prompt: string) {
  const response = await fetch('/api/my-ai-feature', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, context: [] })
  });
  
  const data = await response.json();
  return data.content;
}
```

### ❌ INCORRECT: Direct Client-Side Call

```typescript
// src/components/MyComponent.tsx (CLIENT-SIDE)
'use client';

import { getBedrockService } from '@/services/bedrock'; // ❌ WRONG!

async function askClippy(prompt: string) {
  const bedrock = getBedrockService(); // ❌ Will fail - no env vars in browser
  const response = await bedrock.generateResponse(prompt, [], { maxTokens: 100 });
  return response.content;
}
```

## Clippy Configuration

Always use the centralized config system:

```typescript
import { getClippyConfig } from '@/config/clippy';

// For conversational assistance
const config = getClippyConfig('default');

// For code assistance
const codeConfig = getClippyConfig('code');
```

### Available Configs

- **`DEFAULT_CLIPPY_CONFIG`**: Conversational, friendly, 1000 tokens
- **`CODE_CLIPPY_CONFIG`**: Technical, code-focused, 2000 tokens

## Naming Convention

- Always refer to AI features as "Clippy"
- Use 📎 emoji for Clippy UI elements
- Maintain Kiro 97 personality in prompts

## Current API Routes

| Route | Purpose | Config | Client Component |
|-------|---------|--------|------------------|
| `/api/chat` | Floating Clippy | `default` | `ClippyAssistant` |
| `/api/code-assist` | Kiro editor | `code` | `Kiro` |

## Adding New AI Features Checklist

- [ ] Create API route in `src/app/api/[feature-name]/route.ts`
- [ ] Import `getBedrockService()` and `getClippyConfig()` in route
- [ ] Choose appropriate config profile (`'default'` or `'code'`)
- [ ] Add system prompt to context array
- [ ] Handle errors gracefully
- [ ] Client component calls API via `fetch()`
- [ ] Never import Bedrock service in client components
- [ ] Test with valid AWS credentials

## Environment Variables

Required in `.env.local`:

```env
BEDROCK_API_KEY=your_token_here
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
BEDROCK_INFERENCE_PROFILE_ARN=optional_profile_arn
```

**Important**: Use `BEDROCK_API_KEY` (not `AWS_BEARER_TOKEN_BEDROCK`) because AWS Amplify blocks `AWS_*` prefixed environment variables. The BedrockService internally converts this to `AWS_BEARER_TOKEN_BEDROCK` for the AWS SDK.

These are **only** available server-side in API routes.

## Error Handling

Always handle Bedrock errors gracefully:

```typescript
try {
  const response = await bedrock.generateResponse(prompt, context, options);
  return NextResponse.json({ content: response.content });
} catch (error) {
  console.error('Bedrock error:', error);
  return NextResponse.json(
    { error: error instanceof Error ? error.message : 'AI request failed' },
    { status: 500 }
  );
}
```

## Testing

When testing AI features:
1. Ensure `.env.local` has valid AWS credentials
2. Test API routes directly with tools like Postman
3. Verify client components handle loading/error states
4. Check token usage in responses

## Resources

- Bedrock Service: `src/services/bedrock.ts`
- Clippy Config: `src/config/clippy.ts`
- Example API Route: `src/app/api/chat/route.ts`
- Example Client: `src/components/ClippyAssistant.tsx`
