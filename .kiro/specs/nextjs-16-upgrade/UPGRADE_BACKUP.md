# Next.js 16 Upgrade - Backup Documentation

**Date**: November 24, 2025
**Branch**: nextjs-16-upgrade

## Current Package Versions (Before Upgrade)

### Core Dependencies
- **next**: ^15.1.0
- **react**: ^18.3.1
- **react-dom**: ^18.3.1
- **react95**: ^4.0.0

### Dev Dependencies
- **@commitlint/cli**: ^20.1.0
- **@commitlint/config-conventional**: ^20.0.0
- **@testing-library/jest-dom**: ^6.6.3
- **@testing-library/react**: ^16.0.1
- **@types/node**: ^22.10.2
- **@types/react**: ^18.3.18
- **@types/react-dom**: ^18.3.5
- **@vitejs/plugin-react**: ^4.3.4
- **@vitest/coverage-v8**: ^2.1.8
- **@vitest/ui**: ^2.1.8
- **eslint**: ^9.17.0
- **eslint-config-next**: ^15.1.0
- **husky**: ^9.1.7
- **jsdom**: ^25.0.1
- **prettier**: ^3.4.2
- **typescript**: ^5.7.2
- **vitest**: ^2.1.8

## Backup Files
- **package-lock.json.backup**: Created backup of package-lock.json

## Rollback Instructions

If the upgrade needs to be rolled back:

1. Restore package.json:
   ```cmd
   git checkout main -- package.json
   ```

2. Restore package-lock.json:
   ```cmd
   copy package-lock.json.backup package-lock.json
   ```

3. Reinstall dependencies:
   ```cmd
   npm ci
   ```

4. Rebuild the application:
   ```cmd
   npm run build
   ```

## Notes
- Current Next.js version: 15.1.0
- Target Next.js version: 16.x
- React version will be maintained at 18.3.1
- TypeScript version will be maintained at 5.7.2
