# Requirements Document

## Introduction

This document outlines the requirements for upgrading the Windows 95 emulator application from Next.js 15.1.0 to Next.js 16. The upgrade introduces significant changes including Turbopack as the default bundler, React Compiler support, middleware-to-proxy convention changes, and various API updates. The goal is to modernize the application while maintaining all existing functionality and ensuring compatibility with the new Next.js architecture.

## Glossary

- **Application**: The Windows 95 emulator web application built with Next.js
- **Turbopack**: The new default bundler for Next.js 16, replacing Webpack
- **React Compiler**: A stable feature in Next.js 16 that automatically memoizes components
- **Proxy Convention**: The new naming convention replacing "middleware" in Next.js 16
- **Cache Components**: The new caching mechanism replacing experimental.dynamicIO
- **Package Manager**: npm, the tool used to manage project dependencies
- **Build Process**: The compilation and bundling of the application for production
- **Development Server**: The local server used during development (next dev)

## Requirements

### Requirement 1

**User Story:** As a developer, I want to upgrade the Next.js framework to version 16, so that the application benefits from the latest performance improvements and features.

#### Acceptance Criteria

1. WHEN the upgrade command is executed, THEN the Application SHALL update Next.js to version 16 and all related dependencies to compatible versions
2. WHEN the package.json is updated, THEN the Application SHALL upgrade to React 19 and React-DOM 19 as required by Next.js 16
3. WHEN dependencies are installed, THEN the Application SHALL resolve all peer dependency conflicts successfully
4. WHEN the upgrade is complete, THEN the Application SHALL have eslint-config-next updated to version 16
5. WHEN TypeScript types are checked, THEN the Application SHALL have @types/react and @types/react-dom at compatible versions for React 19

### Requirement 2

**User Story:** As a developer, I want Turbopack to be the default bundler, so that I can benefit from faster build times and improved development experience.

#### Acceptance Criteria

1. WHEN the development server starts, THEN the Application SHALL use Turbopack without requiring explicit --turbopack flags
2. WHEN the build command runs, THEN the Application SHALL use Turbopack for production builds by default
3. WHEN Turbopack configuration is needed, THEN the Application SHALL place turbopack options at the top level of next.config.ts
4. WHEN the package.json scripts are reviewed, THEN the Application SHALL remove any explicit --turbopack flags from dev and build commands
5. WHEN module resolution issues occur, THEN the Application SHALL provide resolveAlias configuration for Node.js modules if needed

### Requirement 3

**User Story:** As a developer, I want to migrate from middleware to proxy convention, so that the application follows Next.js 16 naming standards.

#### Acceptance Criteria

1. WHEN middleware files exist, THEN the Application SHALL rename middleware.ts files to proxy.ts
2. WHEN middleware functions exist, THEN the Application SHALL rename the middleware named export to proxy
3. WHEN next.config.ts contains skipMiddlewareUrlNormalize, THEN the Application SHALL rename it to skipProxyUrlNormalize
4. WHEN the proxy configuration is reviewed, THEN the Application SHALL ensure the runtime is set to nodejs (not edge)
5. WHEN the migration is complete, THEN the Application SHALL have no references to the deprecated middleware naming

### Requirement 4

**User Story:** As a developer, I want to update async request APIs, so that the application correctly handles the new Promise-based params and headers.

#### Acceptance Criteria

1. WHEN Server Components access params, THEN the Application SHALL await the params object before accessing properties
2. WHEN Server Components access headers, THEN the Application SHALL await the headers() function call
3. WHEN Server Components access cookies, THEN the Application SHALL await the cookies() function call
4. WHEN Route Handlers receive params, THEN the Application SHALL await the params Promise in the segmentData argument
5. WHEN TypeScript types are defined for params, THEN the Application SHALL type params as Promise<{ [key: string]: string }>

### Requirement 5

**User Story:** As a developer, I want to update image configuration, so that the application handles the new Next.js 16 image defaults correctly.

#### Acceptance Criteria

1. WHEN the image configuration is reviewed, THEN the Application SHALL add 16px to imageSizes array if 16px images are needed
2. WHEN image quality settings are checked, THEN the Application SHALL configure custom qualities array if multiple quality levels are required
3. WHEN minimumCacheTTL is evaluated, THEN the Application SHALL set it to 60 seconds if the previous behavior is desired
4. WHEN maximumRedirects is reviewed, THEN the Application SHALL configure it explicitly if more than 3 redirects are needed
5. WHEN local images with query strings are used, THEN the Application SHALL configure localPatterns in the images configuration

### Requirement 6

**User Story:** As a developer, I want to update the Next.js configuration file, so that it uses the new Next.js 16 configuration structure.

#### Acceptance Criteria

1. WHEN experimental.dynamicIO exists, THEN the Application SHALL replace it with cacheComponents configuration
2. WHEN serverRuntimeConfig or publicRuntimeConfig exist, THEN the Application SHALL migrate to direct environment variable access
3. WHEN experimental.bundlePagesExternals exists, THEN the Application SHALL rename it to bundlePagesRouterDependencies
4. WHEN experimental.serverComponentsExternalPackages exists, THEN the Application SHALL rename it to serverExternalPackages
5. WHEN the configuration is complete, THEN the Application SHALL have a valid NextConfig type definition

### Requirement 7

**User Story:** As a developer, I want to enable React Compiler support, so that the application benefits from automatic component memoization.

#### Acceptance Criteria

1. WHEN React Compiler is enabled, THEN the Application SHALL add reactCompiler: true to next.config.ts
2. WHEN babel-plugin-react-compiler is needed, THEN the Application SHALL install it as a dev dependency
3. WHEN the React Compiler is active, THEN the Application SHALL automatically memoize components to reduce re-renders
4. WHEN the build process runs, THEN the Application SHALL compile successfully with React Compiler enabled
5. WHEN runtime behavior is tested, THEN the Application SHALL maintain all existing functionality with React Compiler active

### Requirement 8

**User Story:** As a developer, I want to update caching APIs, so that the application uses the stable cacheLife and cacheTag imports.

#### Acceptance Criteria

1. WHEN caching imports are reviewed, THEN the Application SHALL import cacheLife and cacheTag from 'next/cache' without unstable_ prefix
2. WHEN revalidateTag is used, THEN the Application SHALL pass a cacheLife profile as the second argument if needed
3. WHEN updateTag is used in Server Actions, THEN the Application SHALL ensure it provides read-your-writes semantics
4. WHEN refresh() is called, THEN the Application SHALL ensure it refreshes the client router appropriately
5. WHEN cache configuration is complete, THEN the Application SHALL use only stable caching APIs

### Requirement 9

**User Story:** As a developer, I want to verify the build and development processes, so that I can confirm the upgrade was successful.

#### Acceptance Criteria

1. WHEN the development server starts, THEN the Application SHALL run without errors or warnings
2. WHEN the production build executes, THEN the Application SHALL compile successfully without errors
3. WHEN the application runs in development, THEN the Application SHALL display all pages and features correctly
4. WHEN the application runs in production mode, THEN the Application SHALL serve all routes and assets correctly
5. WHEN tests are executed, THEN the Application SHALL pass all existing test suites

### Requirement 10

**User Story:** As a developer, I want to remove deprecated features, so that the application only uses supported Next.js 16 APIs.

#### Acceptance Criteria

1. WHEN next/legacy/image imports exist, THEN the Application SHALL replace them with next/image imports
2. WHEN AMP configuration exists, THEN the Application SHALL remove amp-related config and imports
3. WHEN next lint is used, THEN the Application SHALL migrate to ESLint CLI if the command is deprecated
4. WHEN image.domains configuration exists, THEN the Application SHALL migrate to image.remotePatterns
5. WHEN deprecated APIs are removed, THEN the Application SHALL have no references to unsupported features
