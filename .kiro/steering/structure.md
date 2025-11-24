# Project Structure

## Directory Organization

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── layout.tsx    # Root layout (includes FileSystemProvider)
│   ├── page.tsx      # Home page
│   └── globals.css   # Global styles
├── apps/             # Kiro 97 applications
├── components/       # React components
├── contexts/         # React context providers
│   └── FileSystemContext.tsx  # Virtual file system (in-memory)
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

## Virtual File System

The app uses an in-memory virtual file system (`FileSystemContext`) for saving files:

- **Location**: `src/contexts/FileSystemContext.tsx`
- **Provider**: Wrapped in root layout (`src/app/layout.tsx`)
- **Default Save Location**: `C:\My Documents`
- **Persistence**: Memory only (files don't persist across page refreshes)

### Usage in Apps

```typescript
import { useFileSystem } from '@/contexts/FileSystemContext';

function MyApp() {
  const { saveFile, listFiles, getFile, deleteFile } = useFileSystem();
  
  // Save to My Documents
  saveFile('myfile.txt', 'content');
  
  // List files in My Documents
  const files = listFiles('C:\\My Documents');
}
```

### Apps Using Virtual File System

- **Kiro IDE**: Save files with dialog showing My Documents
- **Notepad**: Save text files to My Documents
- **My Computer**: Browse and view saved files in My Documents folder

## Testing

- Tests co-located with components: `Component.test.tsx`
- Test setup in `src/test/setup.ts`
- Coverage excludes: test files, config files, type definitions, mock data
