# Design Document: Next.js 16 Upgrade

## Overview

This design outlines the approach for upgrading the Windows 95 emulator application from Next.js 15.1.0 to Next.js 16. The upgrade involves updating core dependencies, migrating to new conventions (middleware → proxy), adopting Turbopack as the default bundler, enabling React Compiler, and updating async request APIs. The design ensures a smooth transition while maintaining all existing functionality and leveraging new performance improvements.

## Architecture

### Current Architecture
- Next.js 15.1.0 with App Router
- React 18.3.1
- TypeScript 5.7
- Webpack bundler (default in Next.js 15)
- Vitest for testing
- ESLint with next/core-web-vitals config

### Target Architecture
- Next.js 16.x with App Router
- React 19.x (required by Next.js 16)
- TypeScript 5.7 (maintained)
- Turbopack bundler (new default in Next.js 16)
- React Compiler enabled
- Proxy convention (replacing middleware)
- Updated async request APIs
- Vitest for testing (maintained)
- ESLint with updated configuration

### Migration Strategy

The upgrade will follow a phased approach:

1. **Dependency Update Phase**: Update Next.js and related packages
2. **Configuration Migration Phase**: Update next.config.ts for Next.js 16 conventions
3. **Code Migration Phase**: Update code to use new APIs and conventions
4. **Verification Phase**: Test and validate the upgrade

## Components and Interfaces

### 1. Package Dependencies

**Current Dependencies:**
```json
{
  "next": "^15.1.0",
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "eslint-config-next": "^15.1.0"
}
```

**Target Dependencies:**
```json
{
  "next": "^16.0.0",
  "react": "^19.0.0",
  "react-dom": "^19.0.0",
  "eslint-config-next": "^16.0.0"
}
```

**New Dev Dependencies:**
- `babel-plugin-react-compiler` (if React Compiler is enabled)

### 2. Configuration Files

#### next.config.ts

**Changes Required:**
- Move Turbopack configuration from `experimental.turbopack` to top-level `turbopack`
- Replace `experimental.dynamicIO` with `cacheComponents` (if used)
- Replace `skipMiddlewareUrlNormalize` with `skipProxyUrlNormalize` (if used)
- Add `reactCompiler: true` to enable React Compiler
- Update image configuration defaults if needed
- Remove deprecated configurations

**Example Structure:**
```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // React Compiler (new in Next.js 16)
  reactCompiler: true,
  
  // Turbopack configuration (moved from experimental)
  turbopack: {
    // resolveAlias if needed for Node.js modules
  },
  
  // Image configuration updates
  images: {
    // imageSizes: [16, 32, 48, 64, 96, 128, 256, 384], // if 16px needed
    // minimumCacheTTL: 60, // if previous behavior desired
    // maximumRedirects: 3, // explicit if needed
  },
  
  // Renamed configurations
  // skipProxyUrlNormalize: true, // if previously using skipMiddlewareUrlNormalize
}

export default nextConfig
```

#### package.json Scripts

**Current:**
```json
{
  "dev": "next dev",
  "build": "next build"
}
```

**Target (no changes needed):**
- Turbopack is now default, so no --turbopack flags needed
- Scripts remain the same

### 3. Middleware/Proxy Files

**Migration Required:**
- Rename `middleware.ts` → `proxy.ts` (if exists)
- Rename `middleware` function → `proxy` function
- Update imports and references

**Current Pattern:**
```typescript
export function middleware(request: Request) {
  // logic
}
```

**Target Pattern:**
```typescript
export function proxy(request: Request) {
  // logic
}
```

### 4. Async Request APIs

#### Server Components with Params

**Current Pattern:**
```typescript
export default function Page({ params }: { params: { slug: string } }) {
  const slug = params.slug
}
```

**Target Pattern:**
```typescript
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}
```

#### Headers and Cookies

**Current Pattern:**
```typescript
import { headers, cookies } from 'next/headers'

const headersList = headers()
const cookieStore = cookies()
```

**Target Pattern:**
```typescript
import { headers, cookies } from 'next/headers'

const headersList = await headers()
const cookieStore = await cookies()
```

#### Route Handlers

**Current Pattern:**
```typescript
export async function GET(request: Request, { params }: { params: { id: string } }) {
  const id = params.id
}
```

**Target Pattern:**
```typescript
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
}
```

### 5. Caching APIs

**Current Pattern:**
```typescript
import { unstable_cacheLife, unstable_cacheTag } from 'next/cache'
```

**Target Pattern:**
```typescript
import { cacheLife, cacheTag } from 'next/cache'
```

**Updated revalidateTag:**
```typescript
import { revalidateTag } from 'next/cache'

// Now accepts cacheLife profile as second argument
revalidateTag('tag-name', 'max')
```

### 6. Image Component

**No Breaking Changes for Basic Usage:**
- `next/image` import remains the same
- Basic props remain unchanged

**Configuration Changes:**
- Default `imageSizes` no longer includes 16px
- Default `qualities` is now [75] instead of [75, 100]
- Default `minimumCacheTTL` is now 4 hours instead of 60 seconds
- Default `maximumRedirects` is now 3 instead of unlimited

## Data Models

### TypeScript Type Updates

#### Params Type
```typescript
// Before
type Params = { slug: string }

// After
type Params = Promise<{ slug: string }>
```

#### Route Handler Segment Data
```typescript
// Before
type SegmentData = { params: { id: string } }

// After
type SegmentData = { params: Promise<{ id: string }> }
```

### Configuration Types

All configuration types are provided by Next.js:
```typescript
import type { NextConfig } from 'next'
```

## Data Flow

### Upgrade Process Flow

```
1. Update Dependencies
   ↓
2. Update next.config.ts
   ↓
3. Migrate Middleware → Proxy (if exists)
   ↓
4. Update Async Request APIs
   ↓
5. Update Caching Imports
   ↓
6. Verify Build & Dev Server
   ↓
7. Run Tests
   ↓
8. Manual Testing
```

### Build Process Changes

**Next.js 15:**
```
next build → Webpack bundler → .next output
```

**Next.js 16:**
```
next build → Turbopack bundler → .next output
```

**Development Process Changes:**

**Next.js 15:**
```
next dev → Webpack bundler → Hot reload
```

**Next.js 16:**
```
next dev → Turbopack bundler → Faster hot reload
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property Reflection

After analyzing all acceptance criteria, several patterns emerge:

1. **Configuration Migration Properties**: Many criteria check that specific configuration values are migrated correctly (middleware→proxy, experimental→stable)
2. **Code Pattern Properties**: Several criteria verify that code patterns are updated consistently across all files (await params, await headers/cookies)
3. **Import Statement Properties**: Multiple criteria check that import statements follow new conventions (stable cache APIs, no legacy imports)
4. **Verification Properties**: Some criteria verify that the system works correctly after migration (build succeeds, tests pass)

**Redundancy Analysis:**
- Properties 4.1-4.5 all relate to async API usage and can be combined into comprehensive async API properties
- Properties 8.1 and 8.5 both check for stable API usage and can be combined
- Properties 10.1, 10.2, and 10.5 all check for deprecated API removal and can be combined

### Property 1: Async params are consistently awaited

*For any* Server Component or Route Handler that accesses params, the params object should be awaited before accessing its properties.

**Validates: Requirements 4.1, 4.4**

### Property 2: Async request APIs are consistently awaited

*For any* Server Component that uses headers() or cookies(), these function calls should be awaited before accessing their return values.

**Validates: Requirements 4.2, 4.3**

### Property 3: Params types are Promise-wrapped

*For any* TypeScript type definition for params in Server Components or Route Handlers, the params type should be defined as Promise<{ [key: string]: string }> or similar Promise-wrapped structure.

**Validates: Requirements 4.5**

### Property 4: Stable caching APIs are used

*For any* import statement that imports caching utilities from 'next/cache', the imports should use stable names (cacheLife, cacheTag) without the unstable_ prefix.

**Validates: Requirements 8.1, 8.5**

### Property 5: Deprecated APIs are removed

*For any* file in the codebase, there should be no imports or usage of deprecated APIs including next/legacy/image, AMP-related APIs, or other Next.js 15 deprecated features.

**Validates: Requirements 10.1, 10.2, 10.5**

## Error Handling

### Upgrade Failures

**Dependency Resolution Errors:**
- **Cause**: Peer dependency conflicts during npm install
- **Handling**: Review package-lock.json, use `npm install --legacy-peer-deps` if needed, or update conflicting packages
- **Recovery**: Revert to previous package.json and investigate conflicts

**Build Errors:**
- **Cause**: Breaking changes in Next.js 16 not properly migrated
- **Handling**: Review build error messages, check migration guide, update code accordingly
- **Recovery**: Use git to revert changes and apply fixes incrementally

**Type Errors:**
- **Cause**: TypeScript types not updated for new async APIs
- **Handling**: Update type definitions to use Promise-wrapped types
- **Recovery**: Review TypeScript compiler errors and update types systematically

### Runtime Errors

**Module Resolution Errors:**
- **Cause**: Turbopack handling Node.js modules differently than Webpack
- **Handling**: Add resolveAlias configuration in next.config.ts
- **Example**: Map 'fs' to empty module for client-side code

**Middleware/Proxy Errors:**
- **Cause**: Middleware not renamed to proxy
- **Handling**: Ensure all middleware files and functions are renamed
- **Recovery**: Check Next.js error messages for guidance

**Async API Errors:**
- **Cause**: Params, headers, or cookies not awaited
- **Handling**: Add await keywords before accessing these APIs
- **Recovery**: Review error stack traces to identify missing awaits

### Testing Errors

**Test Failures:**
- **Cause**: Tests not updated for new async patterns
- **Handling**: Update test code to await async APIs
- **Recovery**: Review test failures and update test utilities

**Coverage Gaps:**
- **Cause**: New code paths not covered by tests
- **Handling**: Add tests for migration-specific code
- **Recovery**: Review coverage reports and add missing tests

## Testing Strategy

### Unit Testing

Unit tests will verify specific migration steps and configurations:

**Configuration Tests:**
- Verify next.config.ts has correct structure
- Check that deprecated config options are removed
- Validate that new config options are added correctly

**Import Tests:**
- Verify stable cache API imports
- Check that legacy imports are removed
- Validate that all imports resolve correctly

**Type Tests:**
- Verify TypeScript compilation succeeds
- Check that params types are Promise-wrapped
- Validate that all type definitions are correct

**Script Tests:**
- Verify package.json scripts don't have --turbopack flags
- Check that all scripts run without errors

### Property-Based Testing

Property-based tests will verify universal properties across the codebase using **fast-check** (JavaScript property-based testing library):

**Configuration:**
- Each property-based test will run a minimum of 100 iterations
- Tests will use fast-check's built-in generators and custom generators for code patterns
- Tests will be tagged with comments referencing the design document properties

**Property Test 1: Async params consistency**
- **Tag**: `**Feature: nextjs-16-upgrade, Property 1: Async params are consistently awaited**`
- **Generator**: Generate file paths for all Server Components and Route Handlers
- **Property**: For each file, verify that params access is preceded by await
- **Validates**: Requirements 4.1, 4.4

**Property Test 2: Async request APIs consistency**
- **Tag**: `**Feature: nextjs-16-upgrade, Property 2: Async request APIs are consistently awaited**`
- **Generator**: Generate file paths for all Server Components
- **Property**: For each file, verify that headers() and cookies() calls are awaited
- **Validates**: Requirements 4.2, 4.3

**Property Test 3: Params type consistency**
- **Tag**: `**Feature: nextjs-16-upgrade, Property 3: Params types are Promise-wrapped**`
- **Generator**: Generate file paths for all TypeScript files with params types
- **Property**: For each type definition, verify params is Promise-wrapped
- **Validates**: Requirements 4.5

**Property Test 4: Stable caching API usage**
- **Tag**: `**Feature: nextjs-16-upgrade, Property 4: Stable caching APIs are used**`
- **Generator**: Generate file paths for all files importing from 'next/cache'
- **Property**: For each import, verify no unstable_ prefix is used
- **Validates**: Requirements 8.1, 8.5

**Property Test 5: No deprecated APIs**
- **Tag**: `**Feature: nextjs-16-upgrade, Property 5: Deprecated APIs are removed**`
- **Generator**: Generate file paths for all source files
- **Property**: For each file, verify no deprecated API imports or usage
- **Validates**: Requirements 10.1, 10.2, 10.5

### Integration Testing

Integration tests will verify the application works correctly after upgrade:

**Build Integration:**
- Run `npm run build` and verify success
- Check that build output uses Turbopack
- Verify that all pages are built correctly

**Development Server Integration:**
- Run `npm run dev` and verify server starts
- Check that Turbopack is used by default
- Verify that hot reload works correctly

**Production Server Integration:**
- Run `npm run start` after build
- Verify all routes are accessible
- Check that assets are served correctly

**Test Suite Integration:**
- Run `npm run test` and verify all tests pass
- Check that test coverage is maintained
- Verify that no new test failures are introduced

### Manual Testing

Manual testing will verify user-facing functionality:

**Visual Testing:**
- Load application in browser
- Verify Windows 95 UI renders correctly
- Check that all interactive elements work

**Feature Testing:**
- Test all application features
- Verify Clippy assistant works
- Check that Minesweeper and other apps function

**Performance Testing:**
- Measure build times (should be faster with Turbopack)
- Check hot reload speed (should be faster)
- Verify page load times are maintained or improved

## Deployment Considerations

### AWS Amplify Compatibility

**Verification Steps:**
1. Ensure Next.js 16 is supported by AWS Amplify
2. Check that build configuration is compatible
3. Verify that environment variables work correctly
4. Test deployment to staging environment before production

**Potential Issues:**
- Amplify may need configuration updates for Turbopack
- Build cache may need to be cleared
- Environment variable access patterns may need updates

### Rollback Strategy

**Preparation:**
1. Tag current version in git before upgrade
2. Document current package versions
3. Create backup of package-lock.json
4. Test rollback procedure in development

**Rollback Steps:**
1. Revert to previous git tag
2. Run `npm ci` to restore exact dependencies
3. Rebuild and redeploy
4. Verify application functionality

### Monitoring

**Post-Deployment Monitoring:**
- Monitor build times in CI/CD
- Check application error rates
- Verify performance metrics
- Monitor user-reported issues

**Success Criteria:**
- Build times improved or maintained
- No increase in error rates
- All features functioning correctly
- No user-reported issues related to upgrade

## Implementation Notes

### Codemod Usage

Next.js provides codemods to automate some migrations:

```bash
# Upgrade to latest version with codemod
npx @next/codemod@canary upgrade latest

# Migrate middleware to proxy
npx @next/codemod@latest middleware-to-proxy .

# Migrate next lint to ESLint CLI (if needed)
npx @next/codemod@canary next-lint-to-eslint-cli .
```

**Codemod Limitations:**
- May not catch all edge cases
- Manual review required after running
- Some migrations may need manual intervention

### Incremental Migration

The upgrade can be done incrementally:

1. **Phase 1**: Update dependencies only
2. **Phase 2**: Update configuration files
3. **Phase 3**: Migrate code patterns (async APIs)
4. **Phase 4**: Enable React Compiler
5. **Phase 5**: Final verification and testing

This allows for easier troubleshooting and rollback if issues arise.

### Development Workflow

**During Migration:**
1. Create feature branch for upgrade
2. Commit after each major step
3. Test thoroughly at each step
4. Document any issues encountered
5. Create PR for review before merging

**Testing Workflow:**
1. Run tests after each change
2. Manually test in development
3. Build and test production build
4. Deploy to staging for final verification

## References

- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Next.js 16 Release Notes](https://nextjs.org/blog/next-16)
- [Turbopack Documentation](https://nextjs.org/docs/app/api-reference/turbopack)
- [React Compiler Documentation](https://react.dev/learn/react-compiler)
- [Next.js Codemods](https://nextjs.org/docs/app/guides/upgrading/codemods)
