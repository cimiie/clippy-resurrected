# Project Structure

## Directory Organization

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── layout.tsx    # Root layout
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── components/       # React components
├── contexts/         # React context providers
├── hooks/            # Custom React hooks
├── services/         # External service integrations (AWS, MCP)
├── types/            # TypeScript type definitions
└── test/             # Test utilities and setup
    └── setup.ts      # Vitest global setup

public/               # Static assets (images, fonts, etc.)
├── 98.css            # Windows 98 CSS framework

.kiro/                # Kiro IDE configuration
├── specs/            # Feature specifications
├── settings/         # MCP and other settings
└── hooks/            # Agent hooks
```

## File Naming Conventions

- React components: PascalCase (e.g., `WindowManager.tsx`)
- Pages: lowercase (e.g., `page.tsx`)
- Tests: `*.test.tsx` or `*.test.ts` co-located with source files
- Types: PascalCase (e.g., `WindowTypes.ts`)

## Import Alias

Use `@/` for imports from `src/`:
```typescript
import { Component } from '@/components/Component';
```

## Testing

- Tests co-located with components: `Component.test.tsx`
- Test setup in `src/test/setup.ts`
- Coverage excludes: test files, config files, type definitions, mock data
