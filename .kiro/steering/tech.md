# Technology Stack

## Core Technologies

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript 5.7 (strict mode enabled)
- **Runtime**: Node.js 18+
- **UI Libraries**: React95, 98.css for authentic Windows 95 styling
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

## MCP Integration

Two MCP servers provide documentation context:
- **Context7**: Next.js documentation (1.5M tokens from nextjs.org/docs)
- **AWS Docs**: AWS service documentation for Bedrock/Amplify

Configuration in `.kiro/settings/mcp.json`
