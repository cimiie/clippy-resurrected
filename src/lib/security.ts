/**
 * Security utilities for API route protection
 */

import { NextRequest } from 'next/server';

// In-memory rate limiting store (use Redis in production)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export interface SecurityConfig {
  allowedOrigins?: string[];
  rateLimit?: RateLimitConfig;
  maxMessageLength?: number;
  maxTokens?: number;
}

/**
 * Check if request origin is allowed
 */
export function isOriginAllowed(request: NextRequest, allowedOrigins?: string[]): boolean {
  // In development, allow localhost
  if (process.env.NODE_ENV === 'development') {
    return true;
  }

  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');
  
  // If no allowed origins specified, check that request comes from same host
  if (!allowedOrigins || allowedOrigins.length === 0) {
    const host = request.headers.get('host');
    if (origin) {
      return origin.includes(host || '');
    }
    if (referer) {
      return referer.includes(host || '');
    }
    // No origin/referer headers - likely direct API call, reject
    return false;
  }

  // Check against allowed origins list
  if (origin && allowedOrigins.some(allowed => origin.includes(allowed))) {
    return true;
  }
  if (referer && allowedOrigins.some(allowed => referer.includes(allowed))) {
    return true;
  }

  return false;
}

/**
 * Get client IP address from request
 */
export function getClientIp(request: NextRequest): string {
  // Check common headers for real IP (behind proxies/CDN)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip'); // Cloudflare
  
  if (cfConnectingIp) return cfConnectingIp;
  if (forwarded) return forwarded.split(',')[0].trim();
  if (realIp) return realIp;
  
  return 'unknown';
}

/**
 * Check rate limit for IP address
 */
export function checkRateLimit(
  ip: string,
  config: RateLimitConfig = { maxRequests: 20, windowMs: 60000 } // 20 req/min default
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  // No record or window expired - create new
  if (!record || now > record.resetTime) {
    const resetTime = now + config.windowMs;
    rateLimitStore.set(ip, { count: 1, resetTime });
    return { allowed: true, remaining: config.maxRequests - 1, resetTime };
  }

  // Increment count
  record.count++;
  
  // Check if over limit
  if (record.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetTime: record.resetTime };
  }

  return { 
    allowed: true, 
    remaining: config.maxRequests - record.count, 
    resetTime: record.resetTime 
  };
}

/**
 * Clean up expired rate limit records (call periodically)
 */
export function cleanupRateLimitStore(): void {
  const now = Date.now();
  for (const [ip, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}

// Cleanup every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanupRateLimitStore, 5 * 60 * 1000);
}

/**
 * Validate request payload
 */
export function validateChatRequest(payload: {
  message?: unknown;
  maxTokens?: unknown;
  context?: unknown;
  conversationHistory?: unknown;
}): { valid: boolean; error?: string } {
  // Check message
  if (!payload.message || typeof payload.message !== 'string') {
    return { valid: false, error: 'Message is required and must be a string' };
  }

  if (payload.message.length > 5000) {
    return { valid: false, error: 'Message too long (max 5000 characters)' };
  }

  // Check maxTokens
  if (payload.maxTokens !== undefined) {
    if (typeof payload.maxTokens !== 'number' || payload.maxTokens < 1) {
      return { valid: false, error: 'maxTokens must be a positive number' };
    }
    if (payload.maxTokens > 2000) {
      return { valid: false, error: 'maxTokens exceeds maximum (2000)' };
    }
  }

  // Check context array
  if (payload.context !== undefined && !Array.isArray(payload.context)) {
    return { valid: false, error: 'context must be an array' };
  }

  // Check conversation history
  if (payload.conversationHistory !== undefined) {
    if (!Array.isArray(payload.conversationHistory)) {
      return { valid: false, error: 'conversationHistory must be an array' };
    }
    if (payload.conversationHistory.length > 20) {
      return { valid: false, error: 'conversationHistory too long (max 20 messages)' };
    }
  }

  return { valid: true };
}

/**
 * Apply all security checks to a request
 */
export function secureApiRoute(
  request: NextRequest,
  payload: unknown,
  config: SecurityConfig = {}
): { allowed: boolean; error?: string; headers?: Record<string, string> } {
  // 1. Check origin
  if (!isOriginAllowed(request, config.allowedOrigins)) {
    return { 
      allowed: false, 
      error: 'Unauthorized origin' 
    };
  }

  // 2. Check rate limit
  const ip = getClientIp(request);
  const rateLimit = checkRateLimit(ip, config.rateLimit);
  
  const headers = {
    'X-RateLimit-Limit': String(config.rateLimit?.maxRequests || 20),
    'X-RateLimit-Remaining': String(rateLimit.remaining),
    'X-RateLimit-Reset': new Date(rateLimit.resetTime).toISOString(),
  };

  if (!rateLimit.allowed) {
    return { 
      allowed: false, 
      error: 'Rate limit exceeded. Please try again later.',
      headers 
    };
  }

  // 3. Validate payload
  const validation = validateChatRequest(payload as never);
  if (!validation.valid) {
    return { 
      allowed: false, 
      error: validation.error,
      headers 
    };
  }

  return { allowed: true, headers };
}
