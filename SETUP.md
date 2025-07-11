# Development Setup

## Prerequisites

- Node.js 18+
- npm or yarn
- Git

## Getting Started

```bash
git clone https://github.com/xarlizard/react-api-forge.git
cd react-api-forge
npm install
```

## Scripts

```bash
npm run build      # Build the package
npm run test       # Run tests
npm run lint       # Lint code
npm run typecheck  # Type checking
npm run dev        # Run all checks
```

## Publishing

### NPM

1. Set up your NPM token in GitHub secrets as `NPM_TOKEN`
2. Create a GitHub release to trigger automated publishing

### Manual Release

```bash
npm run release:ps        # Patch version
npm run release:ps:minor  # Minor version
npm run release:ps:major  # Major version
```

## Testing

Basic tests are included. Add more tests in `src/__tests__/`.

## Building

The package builds to both CommonJS and ES modules in the `dist/` directory.
