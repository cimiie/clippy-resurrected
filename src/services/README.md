# Services Module

This directory contains service integrations for external APIs and systems.

## AWS Bedrock Service

The `bedrock.ts` module provides integration with AWS Bedrock for LLM capabilities.

### Features
- Bearer token authentication with Bedrock API keys
- Inference profile support for cross-region inference
- Token limit enforcement
- Error handling for rate limiting and API failures
- Context-aware prompt building
- Support for Nova and Claude models

### Usage
```typescript
import { getBedrockService } from '@/services';

const bedrock = getBedrockService();
const response = await bedrock.generateResponse(
  'What is AWS Lambda?',
  ['AWS Lambda is a serverless compute service'],
  { maxTokens: 500, temperature: 0.7 }
);

console.log(response.content);
console.log(`Tokens used: ${response.tokensUsed}`);
```

### Configuration
Set the following environment variables:
- `AWS_REGION` - AWS region (default: us-east-1)
- `AWS_BEARER_TOKEN_BEDROCK` - Bedrock API key for Bearer token authentication
- `BEDROCK_MODEL_ID` - Model ID (default: amazon.nova-lite-v1:0)
- `BEDROCK_INFERENCE_PROFILE_ARN` - (Optional) Inference profile ARN for cross-region inference

## MCP Service

The `mcp.ts` module provides integration with Model Context Protocol servers for documentation access.

### Features
- Documentation query caching (5-minute TTL)
- Graceful failure handling
- Service-specific information retrieval
- Automatic cache management

### Usage
```typescript
import { getMCPService } from '@/services';

const mcp = getMCPService();

// Query documentation
const docs = await mcp.queryDocumentation('S3 bucket policies');
console.log(docs[0].title);

// Get service info
const serviceInfo = await mcp.getServiceInfo('Lambda');
console.log(serviceInfo.description);

// Clear cache if needed
mcp.clearCache();
```

### MCP Integration
The MCP service is designed to work with the AWS Documentation MCP server configured in `.kiro/settings/mcp.json`. In production, the placeholder methods (`fetchDocumentationFromMCP` and `fetchServiceInfoFromMCP`) should be replaced with actual MCP protocol calls.

## Testing

Both services include comprehensive unit tests:

```bash
# Run all service tests
npm run test -- src/services

# Run specific service tests
npm run test -- src/services/bedrock.test.ts
npm run test -- src/services/mcp.test.ts
```

## Error Handling

Both services implement robust error handling:
- **Bedrock**: Catches rate limiting, API failures, and network errors
- **MCP**: Falls back to cached data on connection failures, returns empty results gracefully

## Singleton Pattern

Both services use the singleton pattern for efficient resource usage:
- `getBedrockService()` - Returns shared Bedrock instance
- `getMCPService()` - Returns shared MCP instance
