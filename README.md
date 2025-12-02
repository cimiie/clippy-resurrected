# Kiro 97

A browser-based Windows 98 emulator built with Next.js, TypeScript, and React. Experience the classic desktop aesthetic reimagined with modern web tech.

## Features

- Authentic Windows 98 UI with draggable/resizable windows
- Functional taskbar with Start Menu and desktop icons
- AI-powered Clippy assistant (AWS Bedrock)
- Virtual file system with My Documents
- 16 built-in applications

### Built-in Applications

- **Bomb Finder** - Classic minesweeper game
- **Calculator** - Basic calculator
- **Command Prompt** - Terminal emulator
- **Control Panel** - System settings
- **Disk Optimizer** - Disk defragmentation simulator
- **Draw** - Paint/drawing application
- **Gloom** - Doom-style game
- **Kiro IDE** - Code editor with AI assistance
- **My Computer** - File system browser
- **Registry Editor** - Windows registry viewer
- **Symbol Viewer** - Character map
- **Task Watcher** - Task manager
- **Web Finder** - Internet browser
- **Word Pad** - Rich text editor
- **Word Write** - Text editor (Notepad)
- **Audio Capture** - Sound recorder

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment (copy and edit with your AWS credentials)
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript 5.7 (strict mode)
- **UI**: 98.css + CSS Modules
- **Testing**: Vitest + Testing Library
- **AI**: AWS Bedrock (Amazon Nova)
- **Deployment**: AWS Amplify

## Environment Variables

Create `.env.local` with:

```bash
AWS_REGION=us-east-1
AWS_BEARER_TOKEN_BEDROCK=your_api_key
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
BEDROCK_INFERENCE_PROFILE_ARN=optional_profile_arn
```

See `.env.example` for full template.

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests
npm run test:coverage # Tests with coverage
npm run lint         # ESLint
```

## Project Structure

```
src/
├── app/          # Next.js pages and API routes
├── apps/         # Desktop applications (Notepad, Paint, etc.)
├── components/   # React components
├── contexts/     # React contexts (FileSystem, Settings)
├── hooks/        # Custom hooks
├── services/     # External services (Bedrock)
├── config/       # Configuration (Clippy settings)
└── types/        # TypeScript definitions
```

## Clippy AI Architecture

All AI features use server-side API routes - never call Bedrock from client components.

| Feature | API Route | Purpose |
|---------|-----------|---------|
| Floating Clippy | `/api/chat` | Conversational help |
| Kiro IDE | `/api/code-assist` | Code assistance |

## Deployment

Configured for AWS Amplify with automatic CI/CD. Push to main branch triggers:
1. Test execution
2. Production build
3. Deployment (only if tests pass)

Set environment variables in Amplify Console before deploying.

## License

MIT
