# Design Document

## Overview

Clippy Resurrected is a Next.js 16 application that recreates the classic Windows 95 desktop environment in a modern web browser. The system uses React components to implement draggable windows, a functional taskbar, desktop icons, and integrated applications. The architecture leverages React95 and 98.css for authentic Windows 95 styling, while integrating AWS Bedrock for an AI-powered Clippy assistant that can answer AWS-related questions using real-time documentation access through MCP.

The application follows a component-based architecture with clear separation between UI components, state management, and external service integrations. The system is built with TypeScript for type safety and includes comprehensive tooling (ESLint, Husky, Vitest) for code quality. The application is deployed on AWS Amplify with automatic CI/CD pipelines.

## Architecture

### High-Level Architecture

```mermaid
graph TB
    subgraph "Browser"
        UI[Next.js UI Layer]
        subgraph "Core Components"
            Desktop[Desktop Environment]
            Windows[Window Manager]
            Taskbar[Taskbar Component]
            StartMenu[Start Menu]
        end
        subgraph "Applications"
            Minesweeper[Minesweeper App]
            Browser[Mock IE Browser]
            Clippy[Clippy Assistant]
        end
    end
    
    subgraph "State Management"
        WindowState[Window State]
        AppState[Application State]
        ClippyState[Clippy State]
    end
    
    subgraph "External Services"
        AWS[AWS Bedrock LLM]
        MCP[AWS Docs MCP Server]
    end
    
    UI --> Desktop
    Desktop --> Windows
    Desktop --> Taskbar
    Desktop --> StartMenu
    Windows --> Minesweeper
    Windows --> Browser
    Windows --> Clippy
    
    Windows --> WindowState
    Minesweeper --> AppState
    Browser --> AppState
    Clippy --> ClippyState
    
    Clippy --> AWS
    Clippy --> MCP
    MCP --> AWS
```

### Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript with strict mode enabled
- **UI Libraries**: 
  - React95 for pre-built Windows 95 components
  - 98.css for additional styling
- **State Management**: React Context API + hooks
- **Drag & Drop**: react-draggable or custom implementation
- **AI Integration**: AWS Bedrock (Claude or similar)
- **MCP Integration**: 
  - Context7 MCP Server (`context7-mcp-server`) for Next.js documentation
  - AWS Documentation MCP Server (`awslabs.aws-documentation-mcp-server`) for AWS docs
- **Code Quality**: ESLint, Prettier, Husky for pre-commit hooks, commitlint for commit message validation
- **Testing**: 
  - Vitest for unit tests with TypeScript support
  - @testing-library/react for component testing
  - fast-check for property-based testing
- **Deployment**: AWS Amplify with automatic CI/CD
- **Build Tools**: Turbopack (Next.js 16 default)

## Components and Interfaces

### Core Components

#### DesktopEnvironment Component
```typescript
interface DesktopEnvironmentProps {
  children?: React.ReactNode;
}

interface DesktopState {
  icons: DesktopIcon[];
  selectedIcon: string | null;
}

// Manages the main desktop area, background, and icon layout
```

#### Window Component
```typescript
interface WindowProps {
  id: string;
  title: string;
  initialPosition: { x: number; y: number };
  initialSize: { width: number; height: number };
  children: React.ReactNode;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
  zIndex: number;
  isMinimized: boolean;
}

// Provides draggable, resizable window functionality
```

#### WindowManager
```typescript
interface WindowInstance {
  id: string;
  component: React.ComponentType;
  title: string;
  isMinimized: boolean;
  zIndex: number;
}

interface WindowManagerState {
  windows: WindowInstance[];
  activeWindowId: string | null;
  nextZIndex: number;
}

interface WindowManagerActions {
  openWindow: (component: React.ComponentType, title: string) => string;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
}
```

#### Taskbar Component
```typescript
interface TaskbarProps {
  windows: WindowInstance[];
  onWindowClick: (id: string) => void;
  onStartClick: () => void;
}

interface TaskbarState {
  currentTime: string;
  isStartMenuOpen: boolean;
}
```

#### StartMenu Component
```typescript
interface MenuItem {
  id: string;
  label: string;
  icon?: string;
  action?: () => void;
  subItems?: MenuItem[];
}

interface StartMenuProps {
  isOpen: boolean;
  onClose: () => void;
  menuItems: MenuItem[];
}
```

### Application Components

#### MinesweeperApp Component
```typescript
interface MinesweeperState {
  grid: Cell[][];
  gameStatus: 'playing' | 'won' | 'lost';
  flagCount: number;
  timeElapsed: number;
}

interface Cell {
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  position: { row: number; col: number };
}

interface MinesweeperActions {
  revealCell: (row: number, col: number) => void;
  toggleFlag: (row: number, col: number) => void;
  resetGame: () => void;
}
```

#### MockBrowser Component
```typescript
interface MockBrowserState {
  currentUrl: string;
  history: string[];
  historyIndex: number;
  isLoading: boolean;
}

interface MockBrowserProps {
  initialUrl?: string;
}

interface BrowserActions {
  navigate: (url: string) => void;
  goBack: () => void;
  goForward: () => void;
  refresh: () => void;
}
```

#### ClippyAssistant Component
```typescript
interface ClippyState {
  isVisible: boolean;
  isChatOpen: boolean;
  messages: ChatMessage[];
  isTyping: boolean;
  animation: 'idle' | 'thinking' | 'speaking';
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ClippyProps {
  tokenLimit: number;
  maxResponseLength: number;
}
```

#### TokenController Component
```typescript
interface TokenControllerState {
  tokenLimit: number;
  tokensUsed: number;
  maxResponseLength: number;
  warningThreshold: number;
}

interface TokenControllerActions {
  setTokenLimit: (limit: number) => void;
  setMaxResponseLength: (length: number) => void;
  resetUsage: () => void;
  trackUsage: (tokens: number) => void;
}
```

### Service Interfaces

#### AWS Bedrock Service
```typescript
interface BedrockService {
  generateResponse: (
    prompt: string,
    context: string[],
    options: GenerationOptions
  ) => Promise<BedrockResponse>;
  
  // Use inference profile ARN instead of model ID for cross-region support
  setInferenceProfile: (profileArn: string) => void;
}

interface GenerationOptions {
  maxTokens: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
}

interface BedrockResponse {
  content: string;
  tokensUsed: number;
  finishReason: string;
}

interface BedrockConfig {
  region: string;
  apiKey: string; // Bearer token from AWS_BEARER_TOKEN_BEDROCK
  inferenceProfileArn?: string; // Optional inference profile ARN
  modelId: string; // Fallback model ID if no inference profile
}
```

#### MCP Service
```typescript
interface MCPService {
  queryDocumentation: (query: string) => Promise<DocumentationResult[]>;
  getServiceInfo: (serviceName: string) => Promise<ServiceDocumentation>;
}

interface DocumentationResult {
  title: string;
  content: string;
  url: string;
  relevanceScore: number;
}

interface ServiceDocumentation {
  serviceName: string;
  description: string;
  features: string[];
  documentation: string;
}
```

## Data Models

### Window Management
```typescript
type WindowId = string;

interface WindowPosition {
  x: number;
  y: number;
}

interface WindowSize {
  width: number;
  height: number;
}

interface WindowMetadata {
  id: WindowId;
  title: string;
  position: WindowPosition;
  size: WindowSize;
  zIndex: number;
  isMinimized: boolean;
  isMaximized: boolean;
  isFocused: boolean;
}
```

### Minesweeper Game State
```typescript
interface GameGrid {
  rows: number;
  cols: number;
  mineCount: number;
  cells: Cell[][];
}

interface GameStats {
  startTime: Date | null;
  endTime: Date | null;
  flagsPlaced: number;
  cellsRevealed: number;
}
```

### Clippy Conversation
```typescript
interface Conversation {
  id: string;
  messages: ChatMessage[];
  createdAt: Date;
  tokenUsage: TokenUsage;
}

interface TokenUsage {
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
}
```

### Desktop Icons
```typescript
interface DesktopIcon {
  id: string;
  label: string;
  iconImage: string;
  position: { x: number; y: number };
  action: () => void;
}
```

## Error Handling

### Window Management Errors
- **Invalid Window ID**: Log error and gracefully ignore operation
- **Z-Index Overflow**: Reset z-index values when threshold reached
- **Position Out of Bounds**: Constrain window position to viewport

### Minesweeper Errors
- **Invalid Cell Coordinates**: Validate coordinates before cell operations
- **Game State Corruption**: Implement state validation and recovery
- **Timer Errors**: Handle timer cleanup on component unmount

### Clippy/AWS Integration Errors
- **API Rate Limiting**: Display user-friendly message and implement exponential backoff
- **Token Limit Exceeded**: Prevent new requests and show warning dialog
- **Network Failures**: Show retry option with offline indicator
- **Invalid Responses**: Parse and validate LLM responses, show error message on failure
- **MCP Connection Failures**: Fallback to cached documentation or show unavailable message

### MCP Service Errors
- **Documentation Not Found**: Return empty results with appropriate message
- **MCP Server Unavailable**: Cache last successful results and notify user
- **Query Timeout**: Implement timeout handling with user notification

### General Error Boundaries
- Implement React Error Boundaries for each major component
- Log errors to console in development
- Display user-friendly error messages in Windows 95 style dialog boxes
- Provide recovery actions (refresh, close window, etc.)

## Testing Strategy

### Unit Testing with Vitest

Unit tests will use Vitest with @testing-library/react to verify specific behaviors and edge cases. All tests will be written in TypeScript with `.test.ts` or `.test.tsx` extensions.

**Vitest Configuration**:
- TypeScript support enabled
- JSX/TSX transformation configured
- React Testing Library integration
- Coverage reporting with v8
- Watch mode for development

**Test Categories**:

**Window Management** (`src/components/Window.test.tsx`):
- Window opens at specified position
- Window closes and removes from state
- Minimize/restore toggles correctly
- Z-index updates on focus
- Drag operations update position
- Resize operations update dimensions

**Minesweeper** (`src/apps/Minesweeper.test.tsx`):
- Grid initializes with correct mine count
- Revealing empty cell cascades correctly
- Flagging prevents cell reveal
- Win condition triggers on all non-mine cells revealed
- Loss condition triggers on mine reveal
- Timer starts on first click

**Taskbar** (`src/components/Taskbar.test.tsx`):
- Clock updates every minute
- Window buttons appear/disappear correctly
- Start menu toggles on button click
- Taskbar buttons maintain window order

**Clippy** (`src/components/ClippyAssistant.test.tsx`):
- Chat interface opens/closes
- Messages append to conversation
- Token usage tracking increments correctly
- LLM API calls made with correct parameters

**Token Controller** (`src/components/TokenController.test.tsx`):
- Warning displays at threshold
- Requests blocked when limit exceeded
- Settings persist to localStorage
- Token limit updates affect subsequent requests

**Error Cases**:
- Empty Clippy query handled gracefully
- Invalid window ID operations fail safely
- Network failures show appropriate errors
- Component error boundaries catch and display errors

**Test Execution**:
- Run tests: `npm run test` or `vitest`
- Watch mode: `vitest --watch`
- Coverage: `vitest --coverage`
- CI mode: `vitest --run` (no watch mode)

### Property-Based Testing

Property-based tests will use fast-check to verify universal properties across many randomly generated inputs. Each test will run a minimum of 100 iterations.

Tests will be tagged with comments in this format: `**Feature: clippy-resurrected, Property {number}: {property_text}**`

The property-based testing approach will verify correctness properties that should hold for all valid inputs, complementing the unit tests' coverage of specific examples.

## Implementation Notes

### Styling Approach
- Use CSS modules for all component styling
- Apply 98.css for base Windows 95 styling
- Follow patterns from Notepad and Paint apps for consistent UI
- No external UI component libraries (React95 removed)
- Maintain Windows 95 color palette (#C0C0C0, #FFFFFF, #808080)
- Use CSS Grid for desktop icon layout
- Implement 3D button effects with box-shadow

### State Management Strategy
- Use React Context for global state (WindowManager, AppState)
- Local component state for UI-specific state (hover, focus)
- Custom hooks for reusable state logic (useWindowManager, useClippy)

### Performance Considerations
- Memoize window components to prevent unnecessary re-renders
- Debounce window drag/resize operations
- Lazy load application components
- Implement virtual scrolling for long Start Menu lists if needed

### AWS Bedrock Integration with Inference Profiles

**Authentication**:
- Use Bedrock API keys (Bearer token) instead of IAM user credentials
- Store API key in `AWS_BEARER_TOKEN_BEDROCK` environment variable
- API keys provide simpler authentication without AWS credential management
- For production, consider transitioning to short-term API keys or IAM roles

**Inference Profiles**:
- Use inference profile ARNs instead of direct model IDs for Nova Lite
- Inference profiles enable:
  - Cross-region inference for improved throughput and availability
  - Cost tracking with tags for monitoring Clippy usage
  - Usage metrics collection in CloudWatch
  - Automatic request routing across multiple regions

**Configuration**:
- Primary model: `amazon.nova-lite-v1:0` (on-demand throughput)
- Inference profile ARN format: `arn:aws:bedrock:region:account-id:inference-profile/profile-id`
- Region: `ap-southeast-1` (or cross-region profile for better performance)
- Implement request queuing for token management
- Cache MCP documentation results to reduce API calls
- Use streaming responses for Clippy to improve perceived performance

**Implementation Details**:
- Modify BedrockRuntimeClient to use Bearer token authentication
- Set `Authorization: Bearer ${api-key}` header for API requests
- Support both direct model ID and inference profile ARN
- Fallback to model ID if inference profile is not configured

### Development Workflow
- Husky pre-commit hooks run ESLint, TypeScript checks, and Vitest unit tests
- Husky commit-msg hooks enforce conventional commit format via commitlint
- Prettier for code formatting
- Conventional commits enforced with @commitlint/config-conventional
- Component-driven development with Storybook (optional)

### AWS Amplify Deployment

**Deployment Architecture**:
- Automatic builds triggered on git push to main branch
- Build process runs: `npm install` → `npm run build` → `npm run test`
- Environment variables injected securely from Amplify console
- Static assets served via CloudFront CDN
- HTTPS enabled by default with AWS-managed certificates

**Build Configuration** (`amplify.yml`):
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run test
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

**Environment Variables Required**:
- `AWS_REGION`: AWS region for Bedrock (e.g., `ap-southeast-1`)
- `AWS_BEARER_TOKEN_BEDROCK`: Bedrock API key for Bearer token authentication
- `BEDROCK_INFERENCE_PROFILE_ARN`: (Optional) Inference profile ARN for cross-region support
- `BEDROCK_MODEL_ID`: Model identifier (e.g., `amazon.nova-lite-v1:0`)
- `NEXT_PUBLIC_APP_URL`: Public application URL

**Note**: `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY` are no longer required when using Bedrock API keys.

**Deployment Features**:
- Automatic rollback on build failures
- Preview deployments for pull requests
- Custom domain support
- Server-side rendering (SSR) support via Amplify Hosting
- Monitoring and logging through CloudWatch

### MCP Server Configuration

The project uses Model Context Protocol (MCP) servers to provide real-time documentation access during development and for the Clippy assistant.

**MCP Configuration File**: `.kiro/settings/mcp.json`

**Configured MCP Servers**:

1. **Context7 MCP Server** (`context7-mcp-server`)
   - **Purpose**: Provides Next.js documentation from nextjs.org/docs
   - **Package**: `context7-mcp-server@latest` via npx
   - **Documentation Coverage**: 1.5M tokens, 7.4K documents
   - **Use Cases**: 
     - Development assistance with Next.js 16 App Router
     - Component implementation guidance
     - Best practices and patterns
     - API reference lookup

2. **AWS Documentation MCP Server** (`awslabs.aws-documentation-mcp-server`)
   - **Purpose**: Provides AWS service documentation for Clippy assistant
   - **Package**: `awslabs.aws-documentation-mcp-server@latest` via uvx
   - **Use Cases**:
     - Clippy assistant responses about AWS services
     - AWS Bedrock integration guidance
     - AWS Amplify deployment documentation

**Configuration Example**:
```json
{
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "context7-mcp-server@latest"],
      "env": {},
      "disabled": false,
      "autoApprove": []
    },
    "aws-docs": {
      "command": "uvx",
      "args": ["awslabs.aws-documentation-mcp-server@latest"],
      "env": {
        "FASTMCP_LOG_LEVEL": "ERROR"
      },
      "disabled": false,
      "autoApprove": []
    }
  }
}
```

**MCP Server Management**:
- Servers automatically reconnect on configuration changes
- Manual reconnection available via MCP Server view in Kiro
- Both servers run via package managers (npx/uvx) without installation

### Agent Hooks Configuration

Agent hooks will be configured to automatically fetch the latest documentation before development interactions:

**Hook 1: Session Start Documentation Fetch**
- Trigger: When a new agent session is created (first message)
- Action: Query Context7 MCP (Next.js) and AWS MCP servers for latest documentation
- Purpose: Ensure agent has current AWS and Next.js information from the start

**Hook 2: Pre-Message Documentation Update**
- Trigger: When a message is sent to the agent
- Action: Refresh Next.js and AWS documentation from MCP servers
- Purpose: Keep documentation context current throughout the session

**Hook Configuration File**: `.kiro/hooks/fetch-docs.json`
```json
{
  "name": "Fetch Latest Documentation",
  "trigger": "onSessionCreate",
  "actions": [
    {
      "type": "message",
      "content": "Fetch latest AWS documentation from MCP and Next.js best practices from Context7"
    }
  ]
}
```

These hooks ensure that during development, the agent always has access to the most current AWS service information and Next.js patterns from Context7, improving code quality and reducing outdated implementation approaches.


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Window dragging follows cursor
*For any* window and any drag operation on its title bar, the window position should update to follow the cursor's movement delta.
**Validates: Requirements 2.1**

### Property 2: Window resizing updates dimensions
*For any* window and any resize operation on its edges or corners, the window dimensions should change according to the drag delta while respecting minimum size constraints.
**Validates: Requirements 2.2**

### Property 3: Window closure removes from environment
*For any* window, clicking its close button should remove it from the window manager state and the DOM.
**Validates: Requirements 2.3**

### Property 4: Window minimize creates taskbar entry
*For any* window, minimizing it should hide the window and ensure a corresponding taskbar button exists and remains visible.
**Validates: Requirements 2.4**

### Property 5: All windows have required controls
*For any* newly created window, it should render with a title bar containing minimize, maximize, and close buttons.
**Validates: Requirements 2.5**

### Property 6: Start menu closes on outside click
*For any* click position outside the start menu bounds when the menu is open, the start menu should close.
**Validates: Requirements 3.2**

### Property 7: Menu items with sub-items show submenus on hover
*For any* menu item that has sub-items, hovering over it should display the nested submenu.
**Validates: Requirements 3.3**

### Property 8: Application menu items launch windows
*For any* menu item representing an application, clicking it should create a new window instance for that application.
**Validates: Requirements 3.4**

### Property 9: Cell reveal shows mine count or triggers game over
*For any* unrevealed, unflagged cell in a Minesweeper game, left-clicking it should either reveal the cell with its adjacent mine count (if not a mine) or trigger game over (if it is a mine).
**Validates: Requirements 4.2**

### Property 10: Right-click toggles flag state
*For any* unrevealed cell in a Minesweeper game, right-clicking should toggle the flag state (flagged ↔ unflagged).
**Validates: Requirements 4.3**

### Property 11: Clicking mine reveals all mines
*For any* Minesweeper game state, clicking a cell containing a mine should reveal all mines on the grid and trigger game over.
**Validates: Requirements 4.5**

### Property 12: Clippy queries invoke LLM service
*For any* valid question string submitted to ClippyAssistant, the system should make an API call to the AWS LLM service with that query.
**Validates: Requirements 5.3**

### Property 13: Token limits apply to all requests
*For any* ClippyAssistant request, the system should enforce the configured token limit in the LLM API call parameters.
**Validates: Requirements 5.4**

### Property 14: Token limit changes affect subsequent requests
*For any* valid token limit value set through the TokenController, all subsequent ClippyAssistant requests should use the new limit.
**Validates: Requirements 6.2**

### Property 15: Response length settings constrain LLM
*For any* valid response length setting, the system should configure the LLM max tokens parameter to respect this constraint.
**Validates: Requirements 6.3**

### Property 16: Exceeded limits block new requests
*For any* state where token usage equals or exceeds the configured limit, the system should prevent new ClippyAssistant requests from being sent.
**Validates: Requirements 6.5**

### Property 17: Browser navigation buttons update state
*For any* navigation button (back, forward, refresh) in the MockBrowser, clicking it should update the browser state appropriately (history index or reload flag).
**Validates: Requirements 7.4**

### Property 18: Window opening creates taskbar button
*For any* window opened in the system, a corresponding button indicator should appear in the taskbar.
**Validates: Requirements 8.1**

### Property 19: Taskbar button click focuses window
*For any* taskbar button, clicking it should bring the corresponding window to the front (highest z-index) and set it as focused.
**Validates: Requirements 8.2**

### Property 20: Window closure removes taskbar button
*For any* window that is closed, its corresponding taskbar button should be removed from the taskbar.
**Validates: Requirements 8.3**

### Property 21: Minimized windows keep taskbar buttons
*For any* minimized window, its taskbar button should remain visible and clicking it should restore the window.
**Validates: Requirements 8.4**

### Property 22: Taskbar maintains window order
*For any* sequence of window openings, the taskbar should display window buttons in the same order they were created.
**Validates: Requirements 8.5**

### Property 23: Desktop icon single-click selects
*For any* desktop icon, single-clicking it should set its selection state to true and highlight it visually.
**Validates: Requirements 10.1**

### Property 24: Desktop icon double-click launches app
*For any* desktop icon, double-clicking it should create a new window instance for the associated application.
**Validates: Requirements 10.2**

### Property 25: Outside click deselects icon
*For any* selected desktop icon and any click position outside that icon's bounds, the icon should become deselected.
**Validates: Requirements 10.3**

### Property 26: Icons arrange in grid layout
*For any* number of desktop icons, they should be positioned in a grid layout starting from the top-left of the desktop.
**Validates: Requirements 10.4**

### Property 27: Icons display image and label
*For any* rendered desktop icon, it should contain both an icon image element and a label text element.
**Validates: Requirements 10.5**

### Property 28: Clock uses local timezone
*For any* system timezone setting, the taskbar clock should display time in that local timezone.
**Validates: Requirements 11.4**

### Property 29: AWS questions query MCP server
*For any* AWS-related question submitted to ClippyAssistant, the system should make a query to the AWS documentation MCP server.
**Validates: Requirements 14.1**

### Property 30: Documentation queries use MCP integration
*For any* documentation query made by ClippyAssistant, the system should retrieve results through the MCP integration rather than direct API calls.
**Validates: Requirements 14.4**

### Property 31: LLM prompts include MCP documentation
*For any* ClippyAssistant response generation, if AWS documentation was retrieved from MCP, it should be included in the LLM prompt context.
**Validates: Requirements 14.5**

### Property 32: UI elements use Windows 95 color palette
*For any* rendered UI button or 3D element, it should apply colors from the Windows 95 palette (#C0C0C0, #FFFFFF, #808080).
**Validates: Requirements 1.3**

### Property 33: Text elements use correct font family
*For any* rendered text element, its computed font-family should include MS Sans Serif, Tahoma, or Arial in the fallback chain.
**Validates: Requirements 1.4**

### Property 34: Agent hooks fetch documentation on session start
*For any* new agent session, the configured agent hooks should automatically query both AWS MCP and Next.js MCP servers for latest documentation.
**Validates: Requirements 15.1**

### Property 35: Agent hooks execute before message processing
*For any* message sent to the agent, the agent hooks should execute and retrieve documentation before the agent processes the message.
**Validates: Requirements 15.2**

### Property 36: Agent hooks provide documentation context
*For any* agent interaction where hooks have executed, the retrieved AWS and Next.js documentation should be available in the agent's context.
**Validates: Requirements 15.4**

### Property 37: Amplify builds run all tests before deployment
*For any* code push to the repository, the AWS Amplify build process should execute all unit tests and only deploy if tests pass.
**Validates: Requirements 16.3**

### Property 38: Environment variables are injected securely
*For any* deployment, AWS Amplify should inject configured environment variables without exposing them in the build logs or client-side code.
**Validates: Requirements 16.4**

### Property 39: Build failures prevent deployment
*For any* build that fails tests or compilation, AWS Amplify should prevent deployment and maintain the previous working version.
**Validates: Requirements 16.6**

### Property 40: Bearer token authentication is used
*For any* BedrockService initialization, the system should authenticate using the Bearer token from AWS_BEARER_TOKEN_BEDROCK environment variable instead of IAM user credentials.
**Validates: Requirements 17.1**

### Property 41: Inference profile ARN is used for requests
*For any* Clippy inference request, the system should use the configured inference profile ARN instead of a direct model ID.
**Validates: Requirements 17.2, 17.6**

### Property 42: Bearer token is read from environment
*For any* application startup, the system should successfully read the AWS_BEARER_TOKEN_BEDROCK environment variable and use it for authentication.
**Validates: Requirements 17.5**
