# Publishing

This package is published to NPM as `react-api-forge` and to GitHub Packages as `@Xarlizard/react-api-forge`.

## Installation

### NPM

```bash
npm install react-api-forge
```

### GitHub Packages

First, configure your `.npmrc`:

```
@Xarlizard:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=YOUR_GITHUB_TOKEN
```

Then install:

```bash
npm install @Xarlizard/react-api-forge
```

## Release Process

Releases are automated via GitHub Actions when you create a GitHub release.

### Manual Release

```bash
npm run release:ps        # Patch version (1.0.0 → 1.0.1)
npm run release:ps:minor  # Minor version (1.0.0 → 1.1.0)
npm run release:ps:major  # Major version (1.0.0 → 2.0.0)
```

## Setup

To enable publishing, add your NPM token to GitHub repository secrets:

1. Go to your repository settings
2. Navigate to Secrets and variables → Actions
3. Add `NPM_TOKEN` with your NPM automation token
