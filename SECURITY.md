# Security Documentation

## API Protection Measures

This project implements multiple layers of security to protect AWS Bedrock API endpoints from abuse.

### 1. Origin Validation

**What it does**: Ensures requests only come from your deployed domain.

**How it works**:
- Checks `Origin` and `Referer` headers
- In production, rejects requests from external domains
- In development, allows localhost for testing

**Protection against**: Direct API calls from external scripts/sites

### 2. Rate Limiting

**What it does**: Limits requests per IP address.

**Current limits**:
- `/api/chat`: 20 requests per minute per IP
- `/api/code-assist`: 30 requests per minute per IP

**How it works**:
- Tracks requests by IP address (supports Cloudflare, proxies)
- Returns 429 status when limit exceeded
- Includes rate limit headers in response

**Protection against**: Spam attacks, abuse from single source

### 3. Request Validation

**What it does**: Validates and caps request parameters.

**Limits enforced**:
- Message length: max 5000 characters
- Max tokens: capped at 2000 per request
- Conversation history: max 20 messages
- Session limit: 10,000 tokens per browser session

**Protection against**: Expensive requests, token exhaustion

### 4. CORS Restrictions

**What it does**: Browser-level protection via middleware.

**How it works**:
- Only allows same-origin requests in production
- Blocks cross-origin API calls from other websites
- Handles preflight OPTIONS requests

**Protection against**: Cross-site request forgery (CSRF)

### 5. Server-Side Only Architecture

**What it does**: API keys never exposed to browser.

**How it works**:
- Bedrock credentials stored in `.env.local` (server-side only)
- Client components call API routes, not Bedrock directly
- AWS SDK runs only on server

**Protection against**: API key theft, credential exposure

## Response Headers

All API responses include rate limit information:

```
X-RateLimit-Limit: 20
X-RateLimit-Remaining: 15
X-RateLimit-Reset: 2024-01-01T12:00:00.000Z
```

## Monitoring Recommendations

### AWS Cost Alerts

Set up billing alerts in AWS Console:

1. Go to AWS Billing Dashboard
2. Create budget alert for Bedrock usage
3. Set threshold (e.g., $10/month)
4. Get email notifications

### CloudWatch Metrics

Monitor Bedrock API calls:
- Invocation count
- Token usage
- Error rates
- Throttling events

### Application Logs

Check server logs for:
- Rate limit violations (429 errors)
- Origin validation failures (403 errors)
- Unusual traffic patterns

## Production Deployment

### Environment Variables

Required in production (AWS Amplify):

```env
BEDROCK_API_KEY=your_token_here
BEDROCK_REGION=us-east-1
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
NODE_ENV=production
```

### Additional Protections

Consider adding:

1. **AWS WAF** (Web Application Firewall)
   - IP-based blocking
   - Geographic restrictions
   - Advanced rate limiting

2. **Cloudflare** (if not using AWS WAF)
   - DDoS protection
   - Bot detection
   - Rate limiting at edge

3. **API Gateway** (alternative architecture)
   - AWS-managed rate limiting
   - API keys per user
   - Usage plans and quotas

## Testing Security

### Test Rate Limiting

```bash
# Send 25 requests quickly (should get rate limited)
for i in {1..25}; do
  curl -X POST http://localhost:3000/api/chat \
    -H "Content-Type: application/json" \
    -d '{"message":"test"}' &
done
```

### Test Origin Validation

```bash
# Should fail in production (wrong origin)
curl -X POST https://your-site.com/api/chat \
  -H "Content-Type: application/json" \
  -H "Origin: https://evil-site.com" \
  -d '{"message":"test"}'
```

### Test Request Validation

```bash
# Should fail (message too long)
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message":"'$(python3 -c 'print("a"*6000)')'"}'
```

## Limitations

### In-Memory Rate Limiting

Current implementation uses in-memory storage:
- **Limitation**: Resets on server restart
- **Limitation**: Doesn't work across multiple server instances
- **Production solution**: Use Redis or AWS ElastiCache

### No User Authentication

Current implementation doesn't require login:
- Anyone visiting your site can use Clippy
- Consider adding authentication for production
- Options: NextAuth.js, AWS Cognito, Auth0

## Incident Response

If you detect abuse:

1. **Immediate**: Check AWS Bedrock usage in console
2. **Block IP**: Add to rate limit blocklist (requires Redis)
3. **Rotate credentials**: Update `BEDROCK_API_KEY` if compromised
4. **Review logs**: Identify attack patterns
5. **Update limits**: Reduce rate limits if needed

## Questions?

- Rate limits too strict? Adjust in `src/lib/security.ts`
- Need per-user limits? Add authentication + user-based tracking
- Multiple server instances? Migrate to Redis for rate limiting
