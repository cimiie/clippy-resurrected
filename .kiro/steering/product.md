---
inclusion: always
---

# Product Overview

A nostalgic browser-based retro OS emulator branded as **Kiro 97** that recreates the classic Windows 98 desktop experience with modern web technologies.

## Key Features

- Authentic Windows 98-style UI with draggable/resizable windows
- Functional taskbar with Start Menu and desktop icons
- Built-in applications including Bomb Finder, Kiro IDE code editor
- AI-powered Clippy assistant using AWS Bedrock
- Mock Internet Explorer browser with AWS content
- Custom Kiro 97 branding with vibrant orange-to-cyan color scheme

## Target Experience

Recreate the look, feel, and functionality of Windows 98 in a modern browser while adding AI-enhanced features through the Clippy assistant. The project is branded as **Kiro 97** with a distinctive logo featuring warm oranges (#FF6B35, #F7931E, #FDC830) and cool cyan (#00D9FF) instead of the traditional Microsoft colors.

## AI Assistant - Clippy

**Important**: When referring to AI assistance features in this project, always use the name "Clippy". This is our AWS Bedrock-powered AI assistant that provides:

- Conversational assistance (floating Clippy character)
- Code assistance in the Kiro editor
- Context-aware help throughout the Kiro 97 environment

### Technical Implementation

All AI features are implemented using AWS Bedrock (Amazon Nova Lite model by default):

- **Service**: `BedrockService` class in `src/services/bedrock.ts`
- **Architecture**: Server-side only via Next.js API routes
- **Security**: API keys and credentials never exposed to client
- **API Routes**:
  - `/api/chat` - Floating Clippy conversations
  - `/api/code-assist` - Kiro editor code assistance

**Rule**: Never call Bedrock directly from client components. Always use API routes.

## Design Theme

The project uses **Windows 98** styling via the 98.css framework, which provides authentic Windows 98 UI elements including the classic gray (#c0c0c0) color scheme, beveled borders, and MS Sans Serif font.

## Kiro 97 Branding

The application is branded as **Kiro 97** throughout:
- Boot screen displays "Kiro 97" with custom logo
- Login screen welcomes users to "Kiro 97"
- Start menu header shows "Kiro 97" with logo icon
- Logo uses distinctive colors: #FF6B35 (coral), #F7931E (orange), #FDC830 (yellow), #00D9FF (cyan)
- Logo is a 2x2 grid rotated 45 degrees, similar to classic Windows logo but with unique colors
