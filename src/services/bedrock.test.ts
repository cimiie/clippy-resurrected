import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BedrockService } from './bedrock';

// Mock the AWS SDK
vi.mock('@aws-sdk/client-bedrock-runtime', () => ({
  BedrockRuntimeClient: vi.fn().mockImplementation(() => ({
    send: vi.fn(),
  })),
  InvokeModelCommand: vi.fn(),
}));

describe('BedrockService', () => {
  let service: BedrockService;
  const mockApiKey = 'test-bearer-token-12345';

  beforeEach(() => {
    // Set up environment variable for tests
    process.env.BEDROCK_API_KEY = mockApiKey;
    service = new BedrockService('us-east-1', 'test-model');
  });

  it('creates instance with default configuration', () => {
    expect(service).toBeInstanceOf(BedrockService);
  });

  it('builds prompt with context', () => {
    const prompt = 'What is AWS?';
    const context = ['AWS is a cloud platform', 'It offers many services'];
    
    // Access private method through type assertion for testing
    const buildPrompt = (service as any).buildPrompt.bind(service);
    const result = buildPrompt(prompt, context);
    
    expect(result).toContain('Context:');
    expect(result).toContain('AWS is a cloud platform');
    expect(result).toContain('Question: What is AWS?');
  });

  it('builds prompt without context', () => {
    const prompt = 'What is AWS?';
    const context: string[] = [];
    
    const buildPrompt = (service as any).buildPrompt.bind(service);
    const result = buildPrompt(prompt, context);
    
    expect(result).toBe(prompt);
    expect(result).not.toContain('Context:');
  });

  it('throws error when Bearer token is not provided', () => {
    delete process.env.BEDROCK_API_KEY;
    
    expect(() => {
      new BedrockService('us-east-1', 'test-model');
    }).toThrow('BEDROCK_API_KEY environment variable is required for authentication');
  });

  it('accepts API key as constructor parameter', () => {
    delete process.env.BEDROCK_API_KEY;
    const customApiKey = 'custom-api-key-67890';
    
    expect(() => {
      new BedrockService('us-east-1', 'test-model', customApiKey);
    }).not.toThrow();
  });

  it('sets inference profile ARN', () => {
    const profileArn = 'arn:aws:bedrock:us-east-1:123456789012:inference-profile/test-profile';
    service.setInferenceProfile(profileArn);
    
    // Verify the profile was set by checking the private property
    expect((service as any).inferenceProfileArn).toBe(profileArn);
  });

  it('reads inference profile ARN from environment variable', () => {
    const profileArn = 'arn:aws:bedrock:us-east-1:123456789012:inference-profile/env-profile';
    process.env.BEDROCK_INFERENCE_PROFILE_ARN = profileArn;
    
    const newService = new BedrockService('us-east-1', 'test-model');
    
    expect((newService as any).inferenceProfileArn).toBe(profileArn);
  });
});
