import {
  BedrockRuntimeClient,
  InvokeModelCommand,
  InvokeModelCommandInput,
} from '@aws-sdk/client-bedrock-runtime';

export interface GenerationOptions {
  maxTokens: number;
  temperature?: number;
  topP?: number;
  stopSequences?: string[];
}

export interface BedrockResponse {
  content: string;
  tokensUsed: number;
  finishReason: string;
}

export class BedrockService {
  private client: BedrockRuntimeClient;
  private modelId: string;
  private inferenceProfileArn?: string;

  constructor(region?: string, modelId?: string, apiKey?: string) {
    const bearerToken = apiKey || process.env.BEDROCK_API_KEY;
    
    if (!bearerToken) {
      throw new Error('BEDROCK_API_KEY environment variable is required for authentication');
    }

    // IMPORTANT: AWS Amplify blocks environment variables with AWS_* prefix
    // We use BEDROCK_API_KEY in .env.local and convert it here to AWS_BEARER_TOKEN_BEDROCK
    // This allows the AWS SDK to authenticate while bypassing Amplify's restrictions
    process.env.AWS_BEARER_TOKEN_BEDROCK = bearerToken;

    // Configure Bedrock client with the region
    this.client = new BedrockRuntimeClient({
      region: region || process.env.BEDROCK_REGION || 'us-east-1',
    });
    this.modelId = modelId || process.env.BEDROCK_MODEL_ID || 'amazon.nova-lite-v1:0';
    this.inferenceProfileArn = process.env.BEDROCK_INFERENCE_PROFILE_ARN;
  }

  /**
   * Set the inference profile ARN for cross-region inference
   * @param profileArn - The ARN of the inference profile to use
   */
  setInferenceProfile(profileArn: string): void {
    this.inferenceProfileArn = profileArn;
  }

  async generateResponse(
    prompt: string,
    context: string[],
    options: GenerationOptions
  ): Promise<BedrockResponse> {
    try {
      // Construct the full prompt with context
      const fullPrompt = this.buildPrompt(prompt, context);

      // Determine if this is a Claude or Nova model
      const isClaudeModel = this.modelId.startsWith('anthropic.');
      const isNovaModel = this.modelId.startsWith('amazon.nova');

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let payload: any;

      if (isClaudeModel) {
        // Claude models use the Messages API format
        payload = {
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: options.maxTokens,
          temperature: options.temperature ?? 0.7,
          top_p: options.topP ?? 0.9,
          messages: [
            {
              role: 'user',
              content: fullPrompt,
            },
          ],
          ...(options.stopSequences && { stop_sequences: options.stopSequences }),
        };
      } else if (isNovaModel) {
        // Nova models use the Messages API format (similar to Claude)
        payload = {
          messages: [
            {
              role: 'user',
              content: [
                {
                  text: fullPrompt,
                },
              ],
            },
          ],
          inferenceConfig: {
            max_new_tokens: options.maxTokens,
            temperature: options.temperature ?? 0.7,
            top_p: options.topP ?? 0.9,
            ...(options.stopSequences && { stopSequences: options.stopSequences }),
          },
        };
      } else {
        // Default to Claude format for unknown models
        payload = {
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: options.maxTokens,
          temperature: options.temperature ?? 0.7,
          top_p: options.topP ?? 0.9,
          messages: [
            {
              role: 'user',
              content: fullPrompt,
            },
          ],
          ...(options.stopSequences && { stop_sequences: options.stopSequences }),
        };
      }

      const input: InvokeModelCommandInput = {
        // Use inference profile ARN if configured, otherwise fall back to model ID
        modelId: this.inferenceProfileArn || this.modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify(payload),
      };

      const command = new InvokeModelCommand(input);
      const response = await this.client.send(command);

      if (!response.body) {
        throw new Error('No response body received from Bedrock');
      }

      // Parse the response
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));

      // Extract content and token usage based on model type
      let content: string;
      let tokensUsed: number;
      let finishReason: string;

      if (isNovaModel) {
        // Nova response format
        content = responseBody.output?.message?.content?.[0]?.text || '';
        tokensUsed = (responseBody.usage?.inputTokens || 0) + (responseBody.usage?.outputTokens || 0);
        finishReason = responseBody.stopReason || 'unknown';
      } else {
        // Claude response format
        content = responseBody.content?.[0]?.text || '';
        tokensUsed = (responseBody.usage?.input_tokens || 0) + (responseBody.usage?.output_tokens || 0);
        finishReason = responseBody.stop_reason || 'unknown';
      }

      return {
        content,
        tokensUsed,
        finishReason,
      };
    } catch (error) {
      // Handle rate limiting
      if (error instanceof Error && error.name === 'ThrottlingException') {
        throw new Error('Rate limit exceeded. Please try again later.');
      }

      // Handle other API failures
      if (error instanceof Error) {
        throw new Error(`Bedrock API error: ${error.message}`);
      }

      throw new Error('Unknown error occurred while calling Bedrock API');
    }
  }

  private buildPrompt(prompt: string, context: string[]): string {
    if (context.length === 0) {
      return prompt;
    }

    const contextSection = context.join('\n\n');
    return `Context:\n${contextSection}\n\nQuestion: ${prompt}`;
  }

  /**
   * Test connection to Bedrock service
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.generateResponse('Hello', [], { maxTokens: 10 });
      return true;
    } catch {
      return false;
    }
  }
}

// Export a singleton instance
let bedrockServiceInstance: BedrockService | null = null;

export function getBedrockService(): BedrockService {
  if (!bedrockServiceInstance) {
    bedrockServiceInstance = new BedrockService();
  }
  return bedrockServiceInstance;
}
