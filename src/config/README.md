# Configuration

Centralized configuration files for the Kiro 97 emulator.

## Clippy Configuration (`clippy.ts`)

Shared configuration for all Clippy (AI assistant) features powered by AWS Bedrock.

### Available Configs

#### `DEFAULT_CLIPPY_CONFIG`
Used for conversational assistance (floating Clippy character).
- Max tokens: 1000
- Temperature: 0.7
- Personality: Helpful Kiro 97 assistant

#### `CODE_CLIPPY_CONFIG`
Used for code assistance in the Kiro editor.
- Max tokens: 2000
- Temperature: 0.7
- Personality: Expert coding assistant

### Usage

```typescript
import { getClippyConfig } from '@/config/clippy';

// Get default config
const config = getClippyConfig('default');

// Get code config
const codeConfig = getClippyConfig('code');

// Use with Bedrock service
import { getBedrockService } from '@/services/bedrock';

const bedrock = getBedrockService();
const response = await bedrock.generateResponse(
  userPrompt,
  [config.systemPrompt, ...additionalContext],
  {
    maxTokens: config.maxTokens,
    temperature: config.temperature,
    topP: config.topP
  }
);
```

### Customizing for New Features

When adding new AI-powered features:

1. Import the config: `import { getClippyConfig } from '@/config/clippy';`
2. Choose the appropriate profile (`'default'` or `'code'`)
3. Optionally create a new config profile if needed
4. Use the shared `getBedrockService()` singleton

### Why Centralized Config?

- **Consistency**: All Clippy features have the same personality
- **Maintainability**: Update AI behavior in one place
- **Flexibility**: Easy to add new config profiles for different use cases
- **Resource Efficiency**: Single Bedrock service instance shared across features
