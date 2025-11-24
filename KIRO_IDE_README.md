# Kiro - Retro Style Code Editor

A nostalgic retro-style code editor with AI-powered assistance from Clippy using AWS Bedrock.

## Features

### Code Editor
- Multi-file tab support
- Line numbers
- Syntax-aware file handling (JS, TS, HTML, CSS, JSON)
- File operations (New, Open, Save, Close)
- Cursor position tracking
- Modified file indicators

### Clippy Assistant (AWS Bedrock)
- Context-aware code assistance powered by AWS Bedrock
- Automatically includes current file, language, and code context
- Ask Clippy questions about your code
- Get code explanations, bug fixes, and improvements
- Generate code snippets
- Insert AI-generated code directly into editor
- Powered by Amazon Nova Lite model

### Windows 95 UI
- Authentic menu bar with File, Edit, View, Help menus
- Tab-based file management
- Resizable AI panel
- Status bar with language and cursor position
- Classic Win95 styling with proper borders and colors

## How to Use

### Opening Kiro
1. Double-click the "Kiro" icon on the desktop
2. Or use Start Menu → Programs → Kiro

### Working with Files
- **New File**: File → New (Ctrl+N)
- **Open File**: File → Open (Ctrl+O) - supports .js, .ts, .jsx, .tsx, .html, .css, .json, .txt
- **Save File**: File → Save (Ctrl+S)
- **Close File**: Click × on tab or File → Close

### Using Clippy Assistant
1. Clippy panel is open by default (toggle with View → Clippy Assistant)
2. Type your question in the input box
3. Press Enter to send (Shift+Enter for new line)
4. Clippy will analyze your code and provide assistance
5. Click "Insert Code" button to add AI-generated code to your editor

### Clippy Capabilities
- **Explain code**: "What does this function do?"
- **Find bugs**: "Are there any bugs in this code?"
- **Suggest improvements**: "How can I optimize this?"
- **Generate code**: "Write a function to sort an array"

## Technical Details

- Built with React and TypeScript
- Clippy powered by AWS Bedrock via BedrockService
- Supports Amazon Nova and Claude models
- Context includes: filename, language, code content, cursor position
- Max 2000 tokens per Clippy response

## Environment Setup

Ensure your `.env.local` has:
```
AWS_BEARER_TOKEN_BEDROCK=your_token_here
AWS_REGION=us-east-1
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
```

## Keyboard Shortcuts

- Ctrl+N: New file
- Ctrl+O: Open file
- Ctrl+S: Save file
- Ctrl+Z: Undo
- Ctrl+Y: Redo
- Ctrl+X: Cut
- Ctrl+C: Copy
- Ctrl+V: Paste

Enjoy coding with a nostalgic twist! 💻✨
