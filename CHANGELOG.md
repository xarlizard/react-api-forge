# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-12-14

### ⚠️ Breaking Changes

- **Removed legacy API support** - The deprecated `requiredProps`, `defaultProps`, `pathParams`, and `queryParams` options have been completely removed. You must use the unified `options` array instead.
- **Path params are now auto-extracted** - Path parameters are automatically extracted from the endpoint string (e.g., `/users/:userId`). You no longer need to define them.
- **Function names are auto-generated** - Function names are now automatically generated from the HTTP method:
  - `GET` → `fetchData`
  - `POST` → `postData`
  - `PUT` → `putData`
  - `PATCH` → `patchData`
  - `DELETE` → `deleteData`
- **New function signature** - Functions now accept grouped parameters:
  ```typescript
  fetchData({
    path: { userId: "123" },
    header: { Authorization: "Bearer token" },
    body: { name: "John" },
    query: { lang: "en" }
  })
  ```
- **Endpoint is now string only** - The `endpoint` property no longer accepts functions, only strings.

### Added

- **Unified `options` array configuration** - New unified way to define API parameters using a single `options` array
- `ParamLocation` type with support for `"query"`, `"header"`, and `"body"` locations (path params are auto-extracted)
- `ApiParam<T>` interface for type-safe parameter definitions
- `param<T>()` helper function for improved TypeScript type inference
- Support for header parameters via the options array
- Support for body parameters via the options array
- **Automatic path parameter extraction** - Path params are automatically extracted from endpoint strings (e.g., `/users/:userId`)
- **Automatic function name generation** - Function names are auto-generated from HTTP methods
- **Grouped parameter structure** - Parameters are now passed grouped by location (`path`, `header`, `body`, `query`)
- **Simplified parameter requirements** - Options with `defaultValue` are always optional (implicit), reducing boilerplate

### Changed

- Improved type inference for parameter values using the `valueType` property in `ApiParam`
- Better organization of parameter configuration - each parameter is now defined once with all its properties
- Function calls now use grouped parameters for better clarity and organization

### Example Migration

**Before (v1.x):**
```typescript
const useGetUser = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId",
  requiredProps: ["userId"],
  defaultProps: { lang: "en_US" },
  pathParams: ["userId"],
  queryParams: ["lang"],
});

// Usage
fetchData({ userId: "123", lang: "es_ES" });
```

**After (v2.0.0):**
```typescript
const useGetUser = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId",
  // Path params are automatically extracted from endpoint
  options: [
    { key: "lang", location: "query", defaultValue: "en_US" },
  ],
});

// Usage with grouped params
fetchData({
  path: { userId: "123" },
  query: { lang: "es_ES" }
});
```

**Key Changes:**
- Path params are automatically extracted from endpoint - no need to define them
- Function names are auto-generated (GET→`fetchData`, POST→`postData`, etc.)
- Parameters are grouped by location in function calls
- Options with `defaultValue` are optional (implicit)

## [1.0.2] - 2025-08-05

### Added
- Workflow for Deploy, and updated the Publish workflow
- Dependabot yml
- Templates for pull requests and issues
- Updated some dependencies

## [1.0.1] - 2025-07-11

### Changed

- Updated minimum Axios version from `>=0.21.0` to `^1.10.0` for better security and performance
- Updated minimum React version from `>=16.8.0` to `^19.1.0` for latest features and improvements
- Added Axios as both dependency and peerDependency for optimal user experience
- Improved dependency management to prevent version conflicts

### Fixed

- Resolved potential React hook conflicts by optimizing dependency structure
- Enhanced npm linking compatibility for local development

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
