# Release Checklist

Before publishing a new version:

- [ ] All tests pass (`npm test`)
- [ ] Code builds successfully (`npm run build`)
- [ ] TypeScript compiles without errors (`npm run typecheck`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Version number updated in `package.json`
- [ ] `CHANGELOG.md` updated with new changes
- [ ] README updated if needed
- [ ] All changes committed and pushed to main branch

## Publishing Steps

1. Run full check: `npm run dev`
2. Create release: `npm run release:ps`
3. Push changes: `git push && git push --tags`
4. Create GitHub release with tag
5. Verify package published to NPM and GitHub Packages

## Post-Release

- [ ] Verify package installs correctly
- [ ] Check package page on npmjs.com
- [ ] Update any dependent projects
- [ ] Announce release if needed
