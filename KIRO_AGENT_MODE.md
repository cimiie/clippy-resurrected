# Kiro Agent Mode

## Overview

Kiro's Clippy now works in **Agent Mode** - automatically inserting generated code into the editor and showing concise summaries in the chat panel, similar to how modern AI coding assistants work.

## How It Works

### User Experience

1. **User types a request**: "make me a hello world function"
2. **Clippy generates code**: Creates the code with proper syntax
3. **Auto-insertion**: Code is automatically inserted at cursor position
4. **Summary in chat**: Shows brief summary like "✅ Created a hello world function. 💡 Code has been automatically inserted at cursor position."

### Technical Flow

```
User Input
    ↓
/api/code-assist (with agent-mode prompt)
    ↓
Bedrock generates response with code blocks
    ↓
Client extracts code blocks using regex
    ↓
Auto-insert code at cursor position
    ↓
Show summary in chat (not full response)
```

## Changes Made

### 1. Updated Kiro Component (`src/apps/Kiro.tsx`)

**Auto-insertion Logic:**
- Extracts all code blocks from Clippy's response using regex
- Automatically inserts code at cursor position
- Shows summary message instead of full response
- Removed manual "Insert Code" button

**Welcome Message:**
- Updated to reflect agent behavior
- Added emoji indicators
- Clarified that code is auto-inserted

**Placeholder Text:**
- Changed from "Ask Clippy..." to "Tell Clippy what to code..."

### 2. Updated Code-Assist API (`src/app/api/code-assist/route.ts`)

**Agent-Mode Prompt:**
Added instructions to Clippy:
- Always wrap code in markdown code blocks
- Provide brief summary before code
- Keep summaries concise (1-2 sentences)
- Clarify that code will be auto-inserted

## User Interaction Patterns

### Code Generation
```
User: "make me a hello world"
Clippy: ✅ Created a hello world function.
        💡 Code has been automatically inserted at cursor position.
[Code appears in editor automatically]
```

### Code Explanation (No Code Blocks)
```
User: "explain this code"
Clippy: This code creates a function that prints "Hello World"...
[Full explanation shown, no auto-insertion]
```

### Multiple Code Blocks
```
User: "create a class with methods"
Clippy: ✅ Generated 3 code blocks and inserted into editor.
        💡 Code has been automatically inserted at cursor position.
[All code blocks inserted with spacing]
```

## Benefits

✅ **Faster workflow**: No manual "Insert Code" button clicks
✅ **Cleaner chat**: Summaries instead of verbose code in chat
✅ **Agent-like**: Feels like a coding assistant, not just a chatbot
✅ **Smart detection**: Only auto-inserts when code blocks are present
✅ **Flexible**: Still shows full response for explanations

## Code Block Detection

Uses regex to find markdown code blocks:
```javascript
const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
```

Supports:
- ` ```javascript `
- ` ```typescript `
- ` ```html `
- ` ```css `
- ` ``` ` (no language specified)

## Future Enhancements

Potential improvements:
- [ ] Undo last insertion button
- [ ] Preview code before insertion
- [ ] Multiple insertion points
- [ ] Diff view for code modifications
- [ ] File creation suggestions
- [ ] Multi-file code generation

## Testing

Try these prompts:
1. "make me a hello world function"
2. "create a React component"
3. "add error handling to this code"
4. "explain what this code does" (no auto-insert)
5. "refactor this to use async/await"

## Configuration

Agent mode is controlled by the prompt in `/api/code-assist`:
- Can be toggled by modifying the `agentPrompt` variable
- Uses `CODE_CLIPPY_CONFIG` for token limits and temperature
- Maintains Kiro 97 Clippy personality
