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
- AWS Account with Bedrock access (for Clippy assistant)

### Environment Variables

The application requires AWS credentials to enable the Clippy assistant. Create a `.env.local` file in the root directory with the following variables:

```bash
# AWS Configuration (Required for Clippy)
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your_access_key_here
AWS_SECRET_ACCESS_KEY=your_secret_key_here
BEDROCK_MODEL_ID=anthropic.claude-3-sonnet-20240229-v1:0

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Environment Variable Details**:

- `AWS_REGION`: AWS region where Bedrock is available (e.g., `us-east-1`, `us-west-2`)
- `AWS_ACCESS_KEY_ID`: Your AWS access key with Bedrock permissions
- `AWS_SECRET_ACCESS_KEY`: Your AWS secret access key
- `BEDROCK_MODEL_ID`: The Claude model ID to use (default: `anthropic.claude-3-sonnet-20240229-v1:0`)
- `NEXT_PUBLIC_APP_URL`: Public URL of the application (used for client-side features)

**AWS Bedrock Setup**:

1. Create an AWS account if you don't have one
2. Enable AWS Bedrock in your chosen region
3. Request access to Claude models in the Bedrock console
4. Create an IAM user with Bedrock permissions:
   - `bedrock:InvokeModel`
   - `bedrock:InvokeModelWithResponseStream`
5. Generate access keys for the IAM user
6. Add the credentials to your `.env.local` file

**Note**: A `.env.example` file is provided as a template. Copy it to `.env.local` and fill in your actual credentials.

**Security**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

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

## Deployment

### AWS Amplify Deployment

This application is configured for deployment on AWS Amplify with automatic CI/CD.

**Deployment Steps**:

1. **Connect Repository**: Link your Git repository to AWS Amplify
2. **Configure Build Settings**: Amplify will auto-detect Next.js configuration
3. **Set Environment Variables**: Add the following in Amplify Console → Environment Variables:
   - `AWS_REGION`
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `BEDROCK_MODEL_ID`
   - `NEXT_PUBLIC_APP_URL` (set to your Amplify domain)

4. **Deploy**: Push to your main branch to trigger automatic deployment

**Build Configuration**:

The build process automatically:
- Runs `npm ci` to install dependencies
- Executes `npm run test` to run all tests
- Runs `npm run build` to create production build
- Only deploys if all tests pass

**Environment Variable Security**:
- Environment variables are encrypted at rest in Amplify
- Server-side variables (AWS credentials) are never exposed to the client
- Only `NEXT_PUBLIC_*` variables are included in the client bundle

**Monitoring**:
- Build logs available in Amplify Console
- CloudWatch integration for application logs
- Automatic rollback on build failures

**Custom Domain** (Optional):
- Configure custom domain in Amplify Console
- HTTPS enabled automatically with AWS-managed certificates

## License

MIT
