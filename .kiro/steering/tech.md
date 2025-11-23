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

## Common Commands

```bash
# Development
npm run dev              # Start dev server on localhost:3000

# Testing
npm run test             # Run tests once
npm run test:coverage    # Run tests with coverage report
npm run test:ui          # Run tests with Vitest UI

# Code Quality
npm run lint             # Run ESLint

# Build & Deploy
npm run build            # Production build
npm run start            # Start production server
```

## Git Hooks (Husky)

- **pre-commit**: Runs ESLint and Vitest automatically
- **commit-msg**: Enforces conventional commit format via commitlint

## MCP Integration

Two MCP servers provide documentation context:
- **Context7**: Next.js documentation (1.5M tokens from nextjs.org/docs)
- **AWS Docs**: AWS service documentation for Bedrock/Amplify

Configuration in `.kiro/settings/mcp.json`
