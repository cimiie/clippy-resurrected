# Deployment Guide - Next.js 16 Upgrade

## AWS Amplify Compatibility

### Next.js 16 Support

**Status:** ✅ AWS Amplify supports Next.js 16

AWS Amplify Hosting supports Next.js 16 with the following features:
- Server-Side Rendering (SSR)
- Static Site Generation (SSG)
- Incremental Static Regeneration (ISR)
- API Routes
- Image Optimization
- Turbopack builds

### Build Configuration

**Amplify Build Settings:**

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### Environment Variables

**Required Environment Variables:**
- None for basic deployment
- Add AWS Bedrock credentials when Clippy feature is implemented:
  - `AWS_REGION`
  - `AWS_ACCESS_KEY_ID` (use Amplify secrets)
  - `AWS_SECRET_ACCESS_KEY` (use Amplify secrets)

**Next.js 16 Specific:**
- No special environment variables needed for Turbopack
- React Compiler works automatically in production builds

### Node.js Version

**Recommended:** Node.js 18.x or 20.x

Update in Amplify Console:
1. Go to App Settings → Build Settings
2. Set Build image: Amazon Linux 2023
3. Node.js version will be automatically detected from package.json engines field

**Optional - Add to package.json:**
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

## Pre-Deployment Checklist

### Code Verification
- [x] All tests pass (`npm run test`)
- [x] Production build succeeds (`npm run build`)
- [x] No TypeScript errors
- [x] No ESLint errors
- [x] All dependencies updated to compatible versions

### Configuration Verification
- [x] next.config.ts is valid
- [x] React Compiler enabled
- [x] Turbopack configuration correct
- [x] Environment variables documented

### Performance Verification
- [x] Build time acceptable (~5 seconds)
- [x] Bundle size reasonable
- [x] No performance regressions

## Deployment Steps

### 1. Staging Deployment (Recommended)

**Create a Staging Branch:**
```bash
git checkout -b staging
git push origin staging
```

**Configure Amplify:**
1. In Amplify Console, add a new branch
2. Select `staging` branch
3. Deploy and test

**Verify Staging:**
- [ ] Application loads correctly
- [ ] All routes work
- [ ] Static assets serve correctly
- [ ] No console errors
- [ ] Performance is acceptable

### 2. Production Deployment

**Merge to Main:**
```bash
git checkout main
git merge staging
git push origin main
```

**Amplify Auto-Deploy:**
- Amplify will automatically detect the push
- Build will start automatically
- Monitor build logs for any issues

**Post-Deployment Verification:**
- [ ] Application loads on production URL
- [ ] All features work correctly
- [ ] No errors in browser console
- [ ] Performance metrics acceptable
- [ ] SSL certificate valid

## Monitoring

### Build Logs

Monitor Amplify build logs for:
- Successful npm install
- Successful build completion
- No warnings or errors
- Turbopack usage confirmation

### Application Monitoring

**Key Metrics to Monitor:**
- Page load times
- Error rates
- Build success rate
- Deployment frequency

**Tools:**
- AWS CloudWatch (automatic with Amplify)
- Browser DevTools (manual testing)
- Amplify Console metrics

### Expected Build Output

```
✓ Compiled successfully
✓ Finished TypeScript
✓ Collecting page data
✓ Generating static pages
✓ Finalizing page optimization
```

## Rollback Procedure

### Quick Rollback (Amplify Console)

1. **Via Amplify Console:**
   - Go to App → Hosting → Deployments
   - Find previous successful deployment
   - Click "Redeploy this version"

2. **Verify Rollback:**
   - Check application loads correctly
   - Verify functionality restored
   - Monitor error rates

### Git-Based Rollback

```bash
# Find the commit before upgrade
git log --oneline

# Revert to previous commit
git revert <commit-hash>

# Or reset to previous commit (use with caution)
git reset --hard <commit-hash>

# Force push (only if necessary)
git push origin main --force
```

### Manual Rollback

1. **Restore Dependencies:**
   ```bash
   git checkout <previous-commit> package.json package-lock.json
   npm ci
   ```

2. **Restore Configuration:**
   ```bash
   git checkout <previous-commit> next.config.ts
   ```

3. **Test Locally:**
   ```bash
   npm run build
   npm run test
   ```

4. **Deploy:**
   ```bash
   git add .
   git commit -m "Rollback Next.js 16 upgrade"
   git push origin main
   ```

## Troubleshooting

### Build Failures

**Issue:** Build fails in Amplify
**Solution:**
1. Check build logs for specific error
2. Verify Node.js version compatibility
3. Clear Amplify cache and rebuild
4. Check for missing environment variables

**Issue:** Turbopack errors
**Solution:**
1. Verify next.config.ts syntax
2. Check for incompatible plugins
3. Review Turbopack documentation

### Runtime Errors

**Issue:** Application doesn't load
**Solution:**
1. Check browser console for errors
2. Verify all routes are accessible
3. Check CloudWatch logs for server errors
4. Verify environment variables are set

**Issue:** Performance degradation
**Solution:**
1. Check bundle size
2. Verify React Compiler is enabled
3. Review CloudWatch metrics
4. Test with different network conditions

### Deployment Issues

**Issue:** Deployment stuck or slow
**Solution:**
1. Check Amplify service status
2. Verify build configuration
3. Clear cache and retry
4. Contact AWS support if persistent

## Next Steps After Deployment

### Immediate Actions
1. Monitor application for 24-48 hours
2. Check error rates and performance metrics
3. Gather user feedback
4. Document any issues encountered

### Future Improvements
1. Enable additional Turbopack optimizations
2. Configure custom caching strategies
3. Implement performance monitoring
4. Set up automated testing in CI/CD

## Support Resources

- [AWS Amplify Documentation](https://docs.amplify.aws/)
- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Next.js 16 Upgrade Guide](https://nextjs.org/docs/app/guides/upgrading/version-16)
- [Turbopack Documentation](https://nextjs.org/docs/app/api-reference/turbopack)

## Conclusion

The application is ready for deployment to AWS Amplify with Next.js 16. All compatibility checks have passed, and rollback procedures are documented. Monitor the deployment closely and follow the verification steps to ensure a smooth transition.
