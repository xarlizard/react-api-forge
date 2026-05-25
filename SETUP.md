# Development Setup

## Prerequisites

- Bun 1.0+ (replaces npm/Node.js for this project)
- Git

## Getting Started

```bash
git clone https://github.com/xarlizard/react-api-forge.git
cd react-api-forge
bun install
```

## Scripts

```bash
bun run build      # Build the package
bun run test       # Run tests
bun run lint       # Lint code
bun run typecheck  # Type checking
bun run dev        # Run all checks
```

## Publishing

### NPM

1. Set up your NPM token in GitHub secrets as `NPM_TOKEN`
2. Create a GitHub release to trigger automated publishing

### Manual Release

```bash
bun run release:ps        # Patch version
bun run release:ps:minor  # Minor version
bun run release:ps:major  # Major version
```

## Testing

Basic tests are included. Add more tests in `src/__tests__/`.

## Building

The package builds to both CommonJS and ES modules in the `dist/` directory.
