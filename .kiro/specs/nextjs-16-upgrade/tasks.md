# Implementation Plan

- [x] 1. Backup and prepare for upgrade





  - Create git branch for upgrade work
  - Document current package versions
  - Backup package-lock.json
  - _Requirements: 1.1_

- [x] 2. Update core dependencies to Next.js 16




- [x] 2.1 Update Next.js and related packages



  - Run `npm install next@latest react@latest react-dom@latest eslint-config-next@latest`
  - Verify package.json has Next.js 16.x
  - Verify React 19.x is installed (required by Next.js 16)
  - Verify eslint-config-next is version 16
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 2.2 Update TypeScript types


  - Update @types/react and @types/react-dom to compatible versions
  - Run `npm install` to resolve dependencies
  - _Requirements: 1.5_

- [x] 2.3 Verify dependency installation


  - Check that npm install completes without peer dependency errors
  - Review package-lock.json for correct versions
  - _Requirements: 1.3_

- [ ]* 2.4 Write property test for stable caching API usage
  - **Property 4: Stable caching APIs are used**
  - **Validates: Requirements 8.1, 8.5**

- [x] 3. Update Next.js configuration file




- [x] 3.1 Update next.config.ts structure


  - Move any experimental.turbopack config to top-level turbopack
  - Replace experimental.dynamicIO with cacheComponents (if exists)
  - Replace skipMiddlewareUrlNormalize with skipProxyUrlNormalize (if exists)
  - Replace experimental.bundlePagesExternals with bundlePagesRouterDependencies (if exists)
  - Replace experimental.serverComponentsExternalPackages with serverExternalPackages (if exists)
  - _Requirements: 2.3, 6.1, 6.3, 6.4_

- [x] 3.2 Enable React Compiler


  - Add `reactCompiler: true` to next.config.ts
  - Install babel-plugin-react-compiler as dev dependency if needed
  - _Requirements: 7.1, 7.2_

- [x] 3.3 Update image configuration if needed


  - Review if 16px images are needed and add to imageSizes
  - Configure custom qualities array if needed
  - Set minimumCacheTTL if previous behavior desired
  - Configure maximumRedirects if needed
  - Add localPatterns for images with query strings if needed
  - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_

- [x] 3.4 Remove deprecated configuration


  - Remove serverRuntimeConfig and publicRuntimeConfig if they exist
  - Remove any AMP-related configuration
  - Remove image.domains and migrate to image.remotePatterns if needed
  - _Requirements: 6.2, 10.2, 10.4_

- [x] 3.5 Verify configuration type-checks


  - Run TypeScript compiler to check next.config.ts
  - Fix any type errors
  - _Requirements: 6.5_

- [x] 4. Update package.json scripts




- [x] 4.1 Remove Turbopack flags from scripts


  - Remove --turbopack flags from dev and build scripts
  - Verify scripts are clean
  - _Requirements: 2.4_

- [ ]* 4.2 Write unit tests for configuration
  - Test that next.config.ts has correct structure
  - Test that deprecated options are removed
  - Test that package.json scripts are correct
  - _Requirements: 2.3, 2.4, 6.5_

- [x] 5. Migrate middleware to proxy convention





- [x] 5.1 Check for middleware files


  - Search for middleware.ts or middleware.js files
  - Document locations if found
  - _Requirements: 3.1_


- [x] 5.2 Rename middleware files and functions

  - Rename middleware.ts to proxy.ts (if exists)
  - Rename middleware function export to proxy
  - Update any imports or references
  - _Requirements: 3.1, 3.2_


- [x] 5.3 Update proxy configuration

  - Ensure runtime is set to nodejs (not edge) if specified
  - Update any middleware-related config references
  - _Requirements: 3.3, 3.4_


- [x] 5.4 Verify no middleware references remain

  - Search codebase for "middleware" references
  - Update or remove deprecated references
  - _Requirements: 3.5_

- [x] 6. Update async request APIs in Server Components





- [x] 6.1 Update params access in Server Components


  - Find all Server Components that use params
  - Update params type to Promise<{ [key: string]: string }>
  - Add await before accessing params properties
  - _Requirements: 4.1_


- [x] 6.2 Update params access in Route Handlers

  - Find all Route Handlers that use params
  - Update params type in segmentData to Promise
  - Add await before accessing params properties
  - _Requirements: 4.4_

- [x] 6.3 Update headers() and cookies() calls


  - Find all uses of headers() from 'next/headers'
  - Add await before headers() calls
  - Find all uses of cookies() from 'next/headers'
  - Add await before cookies() calls
  - _Requirements: 4.2, 4.3_

- [x] 6.4 Update TypeScript types for params


  - Update all params type definitions to be Promise-wrapped
  - Verify TypeScript compilation succeeds
  - _Requirements: 4.5_

- [ ]* 6.5 Write property test for async params consistency
  - **Property 1: Async params are consistently awaited**
  - **Validates: Requirements 4.1, 4.4**

- [ ]* 6.6 Write property test for async request APIs consistency
  - **Property 2: Async request APIs are consistently awaited**
  - **Validates: Requirements 4.2, 4.3**

- [ ]* 6.7 Write property test for params type consistency
  - **Property 3: Params types are Promise-wrapped**
  - **Validates: Requirements 4.5**

- [x] 7. Update caching API imports





- [x] 7.1 Update cache imports to stable APIs


  - Find all imports from 'next/cache'
  - Remove unstable_ prefix from cacheLife and cacheTag imports
  - Update any usage of these APIs
  - _Requirements: 8.1_


- [x] 7.2 Verify stable caching APIs are used

  - Search for any remaining unstable_ prefixed cache APIs
  - Update or remove them
  - _Requirements: 8.5_

- [x] 8. Remove deprecated API usage





- [x] 8.1 Update legacy image imports


  - Search for 'next/legacy/image' imports
  - Replace with 'next/image' imports
  - _Requirements: 10.1_

- [x] 8.2 Remove AMP-related code


  - Search for AMP imports and configuration
  - Remove useAmp hook usage
  - Remove AMP page config exports
  - _Requirements: 10.2_

- [x] 8.3 Update ESLint configuration if needed


  - Check if 'next lint' is deprecated
  - Migrate to ESLint CLI if needed using codemod
  - Update package.json scripts
  - _Requirements: 10.3_

- [x] 8.4 Verify no deprecated APIs remain


  - Search codebase for known deprecated patterns
  - Update or remove any found
  - _Requirements: 10.5_

- [ ]* 8.5 Write property test for deprecated API removal
  - **Property 5: Deprecated APIs are removed**
  - **Validates: Requirements 10.1, 10.2, 10.5**

- [x] 9. Checkpoint - Verify build and development server





  - Ensure all tests pass, ask the user if questions arise.

- [x] 10. Test development server






- [x] 10.1 Start development server

  - Run `npm run dev`
  - Verify server starts without errors
  - Check console output for Turbopack usage
  - _Requirements: 2.1, 9.1_


- [x] 10.2 Test hot reload functionality

  - Make a small code change
  - Verify hot reload works correctly
  - Check that changes appear in browser
  - _Requirements: 2.1_

- [x] 10.3 Verify application functionality in dev


  - Load application in browser
  - Test main features (Windows 95 UI, Clippy, Minesweeper)
  - Check for console errors or warnings
  - _Requirements: 9.3_

- [ ]* 10.4 Write unit tests for dev server verification
  - Test that dev server starts successfully
  - Test that Turbopack is used by default
  - _Requirements: 2.1, 9.1_

- [x] 11. Test production build




- [x] 11.1 Run production build


  - Run `npm run build`
  - Verify build completes without errors
  - Check build output for Turbopack usage
  - _Requirements: 2.2, 7.4, 9.2_

- [x] 11.2 Start production server


  - Run `npm run start`
  - Verify server starts successfully
  - _Requirements: 9.4_

- [x] 11.3 Test production application


  - Load application in browser
  - Test all routes and features
  - Verify assets are served correctly
  - _Requirements: 9.4_

- [ ]* 11.4 Write unit tests for build verification
  - Test that build completes successfully
  - Test that Turbopack is used for builds
  - _Requirements: 2.2, 9.2_

- [x] 12. Run existing test suite






- [x] 12.1 Execute all tests

  - Run `npm run test`
  - Verify all tests pass
  - Check for any new test failures
  - _Requirements: 7.5, 9.5_


- [x] 12.2 Run test coverage

  - Run `npm run test:coverage`
  - Verify coverage is maintained
  - Check for any coverage gaps
  - _Requirements: 9.5_


- [x] 12.3 Update tests if needed

  - Fix any failing tests due to async API changes
  - Update test utilities for new patterns
  - _Requirements: 7.5, 9.5_

- [x] 13. Final verification and documentation





- [x] 13.1 Manual testing


  - Perform comprehensive manual testing
  - Test all application features
  - Verify Windows 95 UI, Clippy, and apps work correctly
  - _Requirements: 9.3, 9.4_

- [x] 13.2 Performance verification


  - Measure and compare build times
  - Check hot reload speed
  - Verify page load times
  - _Requirements: 2.1, 2.2_

- [x] 13.3 Document changes


  - Update README if needed
  - Document any configuration changes
  - Note any breaking changes or issues encountered
  - _Requirements: All_

- [x] 13.4 Prepare for deployment


  - Verify AWS Amplify compatibility
  - Test deployment to staging if available
  - Document rollback procedure
  - _Requirements: All_

- [x] 14. Final Checkpoint - Ensure all tests pass





  - Ensure all tests pass, ask the user if questions arise.
