# Windows 95 Emulator

A nostalgic browser-based Windows 95 emulator built with Next.js 16, TypeScript, and React.

## Features

- Authentic Windows 95 UI with draggable/resizable windows
- Functional taskbar with Start Menu
- Desktop icons and applications
- Minesweeper game
- AI-powered Clippy assistant using AWS Bedrock
- Mock Internet Explorer browser with AWS content

## Tech Stack

- **Framework**: Next.js 16.0.3 with App Router (Turbopack enabled)
- **Language**: TypeScript 5.7 (strict mode)
- **Runtime**: React 19.2.0 with React Compiler
- **UI Libraries**: React95, 98.css
- **Testing**: Vitest with @testing-library/react
- **Code Quality**: ESLint, Prettier, Husky
- **Deployment**: AWS Amplify

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- AWS Account with Bedrock access (for Clippy assistant)

### Environment Variables

The application requires AWS Bedrock API credentials to enable the Clippy assistant. Create a `.env.local` file in the root directory with the following variables:

```bash
# AWS Configuration (Required for Clippy)
AWS_REGION=us-east-1
AWS_BEARER_TOKEN_BEDROCK=your_bedrock_api_key_here
BEDROCK_MODEL_ID=amazon.nova-lite-v1:0
BEDROCK_INFERENCE_PROFILE_ARN=arn:aws:bedrock:us-east-1:123456789012:inference-profile/your-profile-id

# Application Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Environment Variable Details**:

- `AWS_REGION`: AWS region where Bedrock is available (e.g., `us-east-1`, `us-west-2`)
- `AWS_BEARER_TOKEN_BEDROCK`: Your Bedrock API key for Bearer token authentication (replaces IAM user credentials)
- `BEDROCK_MODEL_ID`: The Bedrock model ID to use (default: `amazon.nova-lite-v1:0`)
  - **Nova Lite** (default): `amazon.nova-lite-v1:0` - Fast, affordable, good quality
  - **Nova Pro**: `amazon.nova-pro-v1:0` - Higher quality, more expensive
  - **Nova Micro**: `amazon.nova-micro-v1:0` - Cheapest, basic capabilities
  - **Claude 3 Haiku**: `anthropic.claude-3-haiku-20240307-v1:0` - Fast, high quality
  - **Claude 3 Sonnet**: `anthropic.claude-3-sonnet-20240229-v1:0` - Best quality, most expensive
- `BEDROCK_INFERENCE_PROFILE_ARN`: (Optional) Inference profile ARN for cross-region inference and cost tracking
- `NEXT_PUBLIC_APP_URL`: Public URL of the application (used for client-side features)

**AWS Bedrock Setup with API Keys**:

1. **Create an AWS account** if you don't have one

2. **Enable AWS Bedrock** in your chosen region:
   - Navigate to the AWS Bedrock console
   - Go to "Model access" in the left sidebar
   - Request access to Amazon Nova models (approval is usually instant)

3. **Generate a Bedrock API Key**:
   - In the AWS Bedrock console, navigate to "API keys" in the left sidebar
   - Click "Create API key"
   - Give your key a descriptive name (e.g., "clippy-resurrected-dev")
   - Select the appropriate permissions (InvokeModel access)
   - Click "Create"
   - **Important**: Copy the API key immediately - you won't be able to see it again
   - Store the API key securely in your `.env.local` file as `AWS_BEARER_TOKEN_BEDROCK`

4. **Set up Inference Profile** (Optional but Recommended):
   - Inference profiles provide cross-region inference for better throughput and availability
   - They also enable cost tracking with tags and usage metrics in CloudWatch
   
   **To create an inference profile**:
   - In the AWS Bedrock console, navigate to "Inference profiles"
   - Click "Create inference profile"
   - Configure the profile:
     - **Name**: Give it a descriptive name (e.g., "clippy-nova-lite-profile")
     - **Model**: Select `amazon.nova-lite-v1:0`
     - **Throughput**: Choose "On-demand" for pay-per-use pricing
     - **Regions**: Select multiple regions for cross-region inference (e.g., us-east-1, us-west-2)
     - **Tags**: Add cost allocation tags (e.g., `Application: clippy-resurrected`)
   - Click "Create"
   - Copy the inference profile ARN (format: `arn:aws:bedrock:region:account-id:inference-profile/profile-id`)
   - Add the ARN to your `.env.local` file as `BEDROCK_INFERENCE_PROFILE_ARN`

**Benefits of Inference Profiles**:
- **Cross-region inference**: Automatically routes requests across multiple regions for better throughput
- **Cost tracking**: Tag-based cost allocation helps monitor Clippy usage costs
- **Usage metrics**: CloudWatch metrics for monitoring request patterns and performance
- **Improved availability**: Automatic failover if one region experiences issues

**Note**: The default configuration uses **Amazon Nova Lite** for cost-effectiveness. You can switch to other models (Nova Pro, Claude, etc.) by changing the `BEDROCK_MODEL_ID` environment variable or creating an inference profile with a different model.

**Note**: A `.env.example` file is provided as a template. Copy it to `.env.local` and fill in your actual credentials.

**Security**: Never commit `.env.local` to version control. It's already included in `.gitignore`.

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Testing

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage

# Run tests with UI
npm run test:ui
```

### Linting

```bash
npm run lint
```

### Building

```bash
npm run build
npm run start
```

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── hooks/            # Custom hooks
│   ├── services/         # External services (AWS, MCP)
│   ├── types/            # TypeScript types
│   └── test/             # Test utilities
├── public/               # Static assets
└── .kiro/                # Kiro IDE configuration
    ├── specs/            # Feature specifications
    ├── settings/         # MCP configuration
    └── hooks/            # Agent hooks
```

## MCP Server Configuration

This project uses Model Context Protocol (MCP) servers to provide real-time documentation access during development and for the Clippy assistant.

### Configured MCP Servers

1. **Context7 MCP Server** - Next.js Documentation
   - Package: `context7-mcp-server@latest`
   - Provides: 1.5M tokens of Next.js documentation from nextjs.org/docs
   - Usage: Development assistance, component guidance, API reference

2. **AWS Documentation MCP Server** - AWS Service Documentation
   - Package: `awslabs.aws-documentation-mcp-server@latest`
   - Provides: AWS service documentation for Clippy assistant
   - Usage: AWS Bedrock integration, Amplify deployment guidance

### MCP Setup

The MCP servers are configured in `.kiro/settings/mcp.json` and will automatically connect when you open the project in Kiro IDE.

**Prerequisites**:
- For Context7: Node.js and npx (included with Node.js)
- For AWS Docs: Python and uvx (install via `pip install uv`)

**Manual Reconnection**:
If MCP servers don't connect automatically, you can reconnect them from the MCP Server view in Kiro IDE or use the command palette: `MCP: Reconnect Servers`

### Using MCP in Development

The MCP servers provide documentation context automatically through:
- Agent hooks that fetch latest docs on session start
- Real-time documentation queries during development
- Context-aware code suggestions and assistance

## Development Workflow

- Pre-commit hooks run ESLint and Vitest automatically
- TypeScript strict mode enabled for type safety
- All commits must pass linting and tests
- MCP servers provide real-time Next.js and AWS documentation

## Deployment

### AWS Amplify Deployment

This application is configured for deployment on AWS Amplify with automatic CI/CD.

#### Initial Setup Steps

1. **Prerequisites**:
   - AWS Account with appropriate permissions
   - Git repository (GitHub, GitLab, Bitbucket, or AWS CodeCommit)
   - AWS Bedrock access enabled in your region
   - Bedrock API key generated (see setup instructions above)

2. **Connect Repository**:
   - Log in to AWS Amplify Console
   - Click "New app" → "Host web app"
   - Select your Git provider and authorize access
   - Choose the repository and branch (typically `main`)
   - Click "Next"

3. **Configure Build Settings**:
   - Amplify will auto-detect Next.js configuration
   - Verify the `amplify.yml` file is detected
   - Build settings should show:
     - Build command: `npm run build`
     - Output directory: `.next`
   - Click "Next"

4. **Set Environment Variables**:
   - In the build settings page, expand "Advanced settings"
   - Add the following environment variables:
     - `AWS_REGION` = `us-east-1` (or your preferred region)
     - `AWS_BEARER_TOKEN_BEDROCK` = Your Bedrock API key
     - `BEDROCK_MODEL_ID` = `amazon.nova-lite-v1:0`
     - `BEDROCK_INFERENCE_PROFILE_ARN` = (Optional) Your inference profile ARN
     - `NEXT_PUBLIC_APP_URL` = (leave empty, will be set after first deploy)
   - Click "Next"

5. **Review and Deploy**:
   - Review all settings
   - Click "Save and deploy"
   - Wait for initial deployment to complete (5-10 minutes)

6. **Update Public URL**:
   - After first deployment, copy the Amplify domain (e.g., `https://main.d1234567890.amplifyapp.com`)
   - Go to Environment Variables and update `NEXT_PUBLIC_APP_URL` with this domain
   - Trigger a new build to apply the change

#### Deployment Checklist

Use this checklist for each deployment:

- [ ] All tests pass locally (`npm run test`)
- [ ] Build succeeds locally (`npm run build`)
- [ ] Environment variables are configured in Amplify Console
- [ ] AWS Bedrock API key is valid and has proper permissions
- [ ] Inference profile is created (if using cross-region inference)
- [ ] Code is committed and pushed to the main branch
- [ ] Amplify build starts automatically
- [ ] Build logs show successful test execution
- [ ] Build logs show successful Next.js build
- [ ] Deployment completes without errors
- [ ] Application is accessible at the Amplify URL
- [ ] Clippy assistant functions correctly (test AWS queries)
- [ ] All windows and applications work as expected

**Build Configuration**:

The build process automatically:
- Runs `npm ci` to install dependencies
- Executes `npm run test` to run all tests
- Runs `npm run build` to create production build
- Only deploys if all tests pass

**Amplify Build Settings Configuration**:

1. **Automatic Deployments**:
   - Navigate to Amplify Console → App Settings → Build Settings
   - Automatic deployments are enabled by default on git push to main branch
   - Configure branch patterns if you want to deploy from multiple branches

2. **Test Execution Before Deployment**:
   - Tests run automatically as part of the build process (see `amplify.yml`)
   - Build fails and deployment is prevented if any test fails
   - Test results are visible in the build logs

3. **Build Failure Notifications**:
   - Go to Amplify Console → Notifications
   - Add email notifications for build failures
   - Configure SNS topics for integration with Slack, PagerDuty, etc.
   - Set up CloudWatch alarms for build metrics

4. **Preview Deployments for Pull Requests**:
   - Navigate to Amplify Console → App Settings → Previews
   - Enable "Pull request previews"
   - Select which branches should generate previews
   - Each PR will get a unique preview URL for testing
   - Previews are automatically deleted when PR is closed

**Environment Variable Security**:
- Environment variables are encrypted at rest in Amplify
- Server-side variables (AWS credentials) are never exposed to the client
- Only `NEXT_PUBLIC_*` variables are included in the client bundle

**Monitoring and Logging**:

1. **Build Logs**:
   - Access via Amplify Console → App → Build history
   - Click on any build to view detailed logs
   - Logs include: dependency installation, test execution, build output
   - Download logs for offline analysis if needed

2. **Application Logs**:
   - CloudWatch integration enabled automatically
   - Access via CloudWatch Console → Log groups
   - Look for log group: `/aws/amplify/<app-id>`
   - Set up log retention policies (default: never expire)

3. **Performance Monitoring**:
   - Amplify provides basic metrics: requests, data transfer, errors
   - Access via Amplify Console → Monitoring tab
   - Set up CloudWatch alarms for:
     - High error rates (4xx, 5xx responses)
     - Unusual traffic patterns
     - Build failures

4. **Real-time Monitoring**:
   - Use CloudWatch Live Tail for real-time log streaming
   - Monitor application errors and AWS Bedrock API calls
   - Track Clippy assistant usage and response times

**Rollback Procedures**:

If a deployment introduces issues, you can rollback to a previous version:

1. **Automatic Rollback**:
   - Build failures automatically prevent deployment
   - Previous working version remains live
   - No manual intervention needed

2. **Manual Rollback**:
   - Go to Amplify Console → App → Build history
   - Find the last known good deployment
   - Click the three dots menu → "Redeploy this version"
   - Confirm redeployment
   - Wait for rollback to complete (2-5 minutes)

3. **Git-based Rollback**:
   - Revert the problematic commit in your Git repository
   - Push the revert commit to trigger new deployment
   - This creates a proper audit trail in version control

4. **Emergency Rollback**:
   - If the application is completely broken:
     - Disable the app temporarily in Amplify Console
     - Fix the issue locally and test thoroughly
     - Re-enable and deploy the fix
   - Communicate downtime to users if applicable

**Troubleshooting Common Deployment Issues**:

1. **Build Fails During Test Phase**:
   - Check test logs in Amplify build output
   - Run tests locally to reproduce: `npm run test`
   - Fix failing tests and push changes

2. **Environment Variables Not Working**:
   - Verify variables are set in Amplify Console
   - Check variable names match exactly (case-sensitive)
   - Ensure `NEXT_PUBLIC_*` prefix for client-side variables
   - Redeploy after adding/changing variables

3. **AWS Bedrock Errors**:
   - Verify Bedrock is enabled in your AWS region
   - Check that the API key is valid and has InvokeModel permissions
   - Ensure model ID or inference profile ARN is correct and accessible
   - Verify the inference profile exists in the correct region (if using)
   - Check CloudWatch logs for specific error messages

4. **Build Timeout**:
   - Default timeout is 30 minutes
   - If builds timeout, check for:
     - Large dependencies causing slow installs
     - Slow or hanging tests
     - Network issues during dependency installation

**Custom Domain** (Optional):
- Configure custom domain in Amplify Console
- HTTPS enabled automatically with AWS-managed certificates
- DNS propagation may take 24-48 hours

## License

MIT
