# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-07-11

### Added

- Initial release of react-api-forge
- `createApiHook` function for creating type-safe API hooks
- Built-in support for loading states and error handling
- Request cancellation on component unmount
- Path parameters with `:param` syntax support
- Query parameters configuration
- Custom headers support
- Response validation and transformation
- Callback support with `onSuccess` and `onError`
- TypeScript support with full type inference
- Support for both `fetchData` and `postData` function naming
- Comprehensive documentation and examples

### Features

- GET, POST, PUT, DELETE, and other HTTP methods
- Flexible endpoint configuration (string or function)
- Default props and required props validation
- Automatic request cancellation
- Custom error handling
- Response transformation
- Built on Axios for reliable HTTP requests

### Developer Experience

- Full TypeScript support
- Intelligent autocompletion
- Type-safe prop validation
- Consistent API patterns
- Minimal configuration required
