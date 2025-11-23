# Windows 95 Emulator

A nostalgic browser-based Windows 95 emulator built with Next.js 16, TypeScript, and React.

## Features

- Authentic Windows 95 UI with draggable/resizable windows
- Functional taskbar with Start Menu
- Desktop icons and applications
- Minesweeper game
- AI-powered Clippy assistant using AWS Bedrock
- Mock Internet Explorer browser with AWS content

## Tech Stack

- **Framework**: Next.js 16.0.3 with App Router (Turbopack enabled)
- **Language**: TypeScript 5.7 (strict mode)
- **Runtime**: React 19.2.0 with React Compiler
- **UI Libraries**: React95, 98.css
- **Testing**: Vitest with @testing-library/react
- **Code Quality**: ESLint, Prettier, Husky
- **Deployment**: AWS Amplify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
npm run start
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── services/         # External services (AWS, MCP)
│   ├── types/            # TypeScript types
│   └── test/             # Test utilities
├── public/               # Static assets
└── .kiro/                # Kiro IDE configuration
    ├── specs/            # Feature specifications
    ├── settings/         # MCP configuration
    └── hooks/            # Agent hooks
```

## MCP Server Configuration

This project uses Model Context Protocol (MCP) servers to provide real-time documentation access during development and for the Clippy assistant.

### Configured MCP Servers

1. **Context7 MCP Server** - Next.js Documentation
   - Package: `context7-mcp-server@latest`
   - Provides: 1.5M tokens of Next.js documentation from nextjs.org/docs
   - Usage: Development assistance, component guidance, API reference

2. **AWS Documentation MCP Server** - AWS Service Documentation
   - Package: `awslabs.aws-documentation-mcp-server@latest`
   - Provides: AWS service documentation for Clippy assistant
   - Usage: AWS Bedrock integration, Amplify deployment guidance

### MCP Setup

The MCP servers are configured in `.kiro/settings/mcp.json` and will automatically connect when you open the project in Kiro IDE.

**Prerequisites**:
- For Context7: Node.js and npx (included with Node.js)
- For AWS Docs: Python and uvx (install via `pip install uv`)

**Manual Reconnection**:
If MCP servers don't connect automatically, you can reconnect them from the MCP Server view in Kiro IDE or use the command palette: `MCP: Reconnect Servers`

### Using MCP in Development

The MCP servers provide documentation context automatically through:
- Agent hooks that fetch latest docs on session start
- Real-time documentation queries during development
- Context-aware code suggestions and assistance

## Development Workflow

- Pre-commit hooks run ESLint and Vitest automatically
- TypeScript strict mode enabled for type safety
- All commits must pass linting and tests
- MCP servers provide real-time Next.js and AWS documentation

## License

MIT
