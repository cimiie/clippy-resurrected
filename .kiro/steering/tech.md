---
inclusion: always
---

# Technology Stack

## Core Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.7 (strict mode enabled)
- **Runtime**: Node.js 18+
- **UI Libraries**: 98.css for authentic Windows 95 styling, CSS modules for components
- **Testing**: Vitest with @testing-library/react and jsdom
- **Code Quality**: ESLint (Next.js config), Prettier, Husky git hooks
- **Deployment**: AWS Amplify

## TypeScript Configuration

- Strict mode enabled
- Path alias: `@/*` maps to `./src/*`
- Target: ES2020
- Module resolution: bundler

## Common Commands (Windows)

```cmd
REM Development
npm run dev              & REM Start dev server on localhost:3000

REM Testing
npm run test             & REM Run tests once
npm run test:coverage    & REM Run tests with coverage report
npm run test:ui          & REM Run tests with Vitest UI

REM Code Quality
npm run lint             & REM Run ESLint

REM Build & Deploy
npm run build            & REM Production build
npm run start            & REM Start production server
```

## Git Hooks (Husky)

- **pre-commit**: Runs ESLint and Vitest automatically
- **commit-msg**: Enforces conventional commit format via commitlint

## Clippy (AI Assistant) Architecture

All AI assistant features use a centralized configuration system powered by AWS Bedrock.

### Core Principles

**⚠️ IMPORTANT: Always use Bedrock server-side via API routes**

- **NEVER** call `getBedrockService()` directly from client components
- **ALWAYS** create API routes in `src/app/api/` for Bedrock calls
- Environment variables (BEDROCK_API_KEY) are only available server-side
- Bedrock SDK cannot run in the browser

**Note**: We use `BEDROCK_API_KEY` instead of `AWS_BEARER_TOKEN_BEDROCK` because AWS Amplify blocks environment variables with the `AWS_` prefix. The BedrockService internally converts this to the AWS SDK format.

### Configuration

- **Config Location**: `src/config/clippy.ts`
- **Bedrock Service**: `src/services/bedrock.ts` (singleton pattern via `getBedrockService()`)
- **Two Config Profiles**:
  - `DEFAULT_CLIPPY_CONFIG`: For conversational assistance (floating Clippy)
  - `CODE_CLIPPY_CONFIG`: For code assistance (Kiro editor)

### Server-Side Usage Pattern (API Routes)

```typescript
// src/app/api/your-feature/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getBedrockService } from '@/services/bedrock';
import { getClippyConfig } from '@/config/clippy';

export async function POST(request: NextRequest) {
  const { prompt, context } = await request.json();
  
  const bedrock = getBedrockService();
  const config = getClippyConfig('code'); // or 'default'

  const response = await bedrock.generateResponse(
    prompt,
    [config.systemPrompt, ...context],
    {
      maxTokens: config.maxTokens,
      temperature: config.temperature,
      topP: config.topP
    }
  );

  return NextResponse.json({ content: response.content });
}
```

### Client-Side Usage Pattern (React Components)

```typescript
// Client component calls API route
const response = await fetch('/api/your-feature', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt, context })
});

const data = await response.json();
```

### Current Implementations

| Feature | API Route | Config | Client Component |
|---------|-----------|--------|------------------|
| Floating Clippy | `/api/chat` | `DEFAULT_CLIPPY_CONFIG` | `ClippyAssistant` |
| Kiro Editor | `/api/code-assist` | `CODE_CLIPPY_CONFIG` | `Kiro` |

### Adding New AI Features

1. Create API route in `src/app/api/your-feature/route.ts`
2. Use `getBedrockService()` and `getClippyConfig()` in the route
3. Client component calls the API route via `fetch()`
4. Never import Bedrock service in client components

## MCP Integration

Two MCP servers provide documentation context:
- **Context7**: Next.js documentation (1.5M tokens from nextjs.org/docs)
- **AWS Docs**: AWS service documentation for Bedrock/Amplify

Configuration in `.kiro/settings/mcp.json`
