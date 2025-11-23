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

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
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

## Development Workflow

- Pre-commit hooks run ESLint and Vitest automatically
- TypeScript strict mode enabled for type safety
- All commits must pass linting and tests

## License

MIT
