/**
 * Centralized Clippy (AI Assistant) Configuration
 * 
 * This file contains shared configuration for all Clippy/AI assistant features
 * powered by AWS Bedrock. Individual apps can import and customize as needed.
 */

export interface ClippyConfig {
  /** Maximum tokens for AI responses */
  maxTokens: number;
  /** Temperature for response generation (0-1, higher = more creative) */
  temperature: number;
  /** Top-p sampling parameter */
  topP: number;
  /** System prompt defining Clippy's personality */
  systemPrompt: string;
}

/**
 * Default Clippy configuration for conversational assistance
 */
export const DEFAULT_CLIPPY_CONFIG: ClippyConfig = {
  maxTokens: 1000,
  temperature: 0.7,
  topP: 0.9,
  systemPrompt: `You are Clippy, the helpful and enthusiastic assistant from Kiro 97. 
You're knowledgeable, friendly, and love helping users with their questions. 
When discussing applications or features, provide helpful, accurate information in a conversational tone.
Keep responses concise but informative (2-3 paragraphs max unless asked for more detail).`,
};

/**
 * Clippy configuration optimized for code assistance
 */
export const CODE_CLIPPY_CONFIG: ClippyConfig = {
  maxTokens: 2000,
  temperature: 0.7,
  topP: 0.9,
  systemPrompt: `You are Clippy, the friendly coding assistant from Kiro 97!
You're helpful, encouraging, and love generating code.
Write clean, working code with modern best practices.
Always provide a friendly summary and helpful next steps.
Format code blocks using markdown triple backticks with language identifiers.`,
};

/**
 * Clippy configuration for in-app contextual help
 */
export const IN_APP_CLIPPY_CONFIG: ClippyConfig = {
  maxTokens: 500,
  temperature: 0.7,
  topP: 0.9,
  systemPrompt: `You are Clippy, the helpful assistant in Kiro 97!
When introducing an app, give a brief 1-2 sentence overview of what it does.
Keep responses SHORT and conversational - just the essentials.
Let users ask follow-up questions if they want more detail.`,
};

/**
 * Get Clippy config for a specific use case
 */
export function getClippyConfig(type: 'default' | 'code' | 'in-app' = 'default'): ClippyConfig {
  if (type === 'code') return CODE_CLIPPY_CONFIG;
  if (type === 'in-app') return IN_APP_CLIPPY_CONFIG;
  return DEFAULT_CLIPPY_CONFIG;
}
