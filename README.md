# React API Forge

[![npm version](https://badge.fury.io/js/react-api-forge.svg)](https://badge.fury.io/js/react-api-forge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue.svg)](https://www.typescriptlang.org/)
[![Production Deployment](https://github.com/xarlizard/react-api-forge/actions/workflows/deploy.yml/badge.svg?branch=main)](https://github.com/xarlizard/react-api-forge/actions/workflows/deploy.yml)
[![Coverage](https://codecov.io/gh/xarlizard/react-api-forge/branch/main/graph/badge.svg)](https://codecov.io/gh/xarlizard/react-api-forge)

A flexible and robust React hook factory for creating API hooks with consistent patterns. Build type-safe, reusable API hooks with built-in loading states, error handling, and request cancellation.

## ✨ Features

- 🎣 **Consistent API patterns** - Create uniform API hooks across your application
- 🔄 **Built-in state management** - Loading states, error handling, and response caching
- 🎯 **Full TypeScript support** - Type-safe hooks with intelligent autocompletion
- 🛑 **Request cancellation** - Automatic cleanup on component unmount
- 🔧 **Flexible configuration** - Path parameters, query parameters, and custom validation
- 📦 **Lightweight** - Minimal dependencies, built on Axios
- 🎨 **Callback support** - onSuccess and onError callbacks for custom handling
- ⚡ **Modern React** - Built for React 16.8+ with hooks

## 📦 Installation

### NPM

```bash
npm install react-api-forge
```

```bash
yarn add react-api-forge
```

```bash
pnpm add react-api-forge
```

### GitHub Packages

```bash
npm install @Xarlizard/react-api-forge
```

> **Note**: For GitHub Packages, you'll need to configure your `.npmrc` file. See [PUBLISHING.md](./PUBLISHING.md) for details.

## 🚀 Quick Start

```typescript
import { createApiHook } from "react-api-forge";

// Create a typed API hook with unified options array
const useGetUser = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId",
  // Path params are automatically extracted from endpoint
  options: [
    {
      key: "lang",
      location: "query",
      defaultValue: "en_US",
      // Optional (has defaultValue, so implicitly optional)
    },
  ],
});

// Use in your component
const UserProfile = ({ userId }) => {
  const { response, error, loading, fetchData } = useGetUser();

  useEffect(() => {
    fetchData({
      path: { userId },
      query: { lang: "es_ES" }
    });
  }, [userId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div>Hello, {response?.name}!</div>;
};

// Actual API call:
// https://api.example.com/users/:userId?lang=es_ES
```

## 📚 API Reference

### `createApiHook(config)`

Creates a custom API hook with the specified configuration.

#### Configuration Options

| Property            | Type                        | Required | Description                                              |
| ------------------- | --------------------------- | -------- | -------------------------------------------------------- |
| `method`            | `Method`                    | ✅       | HTTP method (GET, POST, PUT, DELETE, PATCH, etc.)        |
| `baseURL`           | `string`                    | ✅       | Base URL for the API endpoint                            |
| `endpoint`          | `string`                    | ✅       | Endpoint path (path params like `:userId` are auto-extracted) |
| `options`           | `ApiParam[]`                | ❌       | Array of parameter definitions (query, header, body only) |
| `headers`           | `object`                    | ❌       | Custom headers for requests                              |
| `validateResponse`  | `function`                  | ❌       | Function to validate response data                       |
| `transformResponse` | `function`                  | ❌       | Function to transform response data                      |
| `onError`           | `function`                  | ❌       | Global error handler function                            |
| `functionName`      | `string`                    | ❌       | Custom function name (auto-generated from method if not provided) |

##### `ApiParam` Interface

Each parameter in the `options` array is defined using the `ApiParam` interface:

| Property        | Type            | Required | Description                                                      |
| --------------- | --------------- | -------- | ---------------------------------------------------------------- |
| `key`           | `string`        | ✅       | Parameter name/key                                                |
| `location`      | `ParamLocation` | ✅       | Where the parameter is used: `"query"`, `"header"`, `"body"` (path params are auto-extracted from endpoint) |
| `required`      | `boolean`       | ❌       | Whether the parameter is required from the user's perspective. **Important:** If `defaultValue` is provided, this parameter is automatically optional (the `required` flag is ignored). The API will always receive a value (either user-provided or the default), but users don't need to provide it.<br/>- Options with `defaultValue` are optional (implicit) - `required` is ignored<br/>- Only specify `required: true` for options without `defaultValue` that must be provided |
| `defaultValue`  | `any`           | ❌       | Default value for the parameter. If provided, the option is automatically optional (users don't need to provide it), and the API will always receive a value (either user-provided or this default) |
| `valueType`     | `T`             | ❌       | Type hint for TypeScript inference (runtime ignored)             |

**Note:** Path parameters are automatically extracted from the endpoint string (e.g., `/users/:userId` extracts `userId`). You don't need to define them in the `options` array.

#### Returned Hook

The generated hook returns an object with:

| Property    | Type          | Description                                          |
| ----------- | ------------- | ---------------------------------------------------- |
| `response`  | `T \| null`   | The response data from the API call                  |
| `error`     | `any \| null` | Error information if the request failed              |
| `loading`   | `boolean`     | Loading state indicator                              |
| `fetchData` | `function`    | Function to trigger the API call (for GET requests)  |
| `postData`  | `function`    | Function to trigger the API call (for POST requests) |
| `putData`   | `function`    | Function to trigger the API call (for PUT requests)  |
| `patchData` | `function`    | Function to trigger the API call (for PATCH requests) |
| `deleteData`| `function`    | Function to trigger the API call (for DELETE requests) |

**Function Name Auto-Generation:**
- `GET` → `fetchData`
- `POST` → `postData`
- `PUT` → `putData`
- `PATCH` → `patchData`
- `DELETE` → `deleteData`

**Function Signature:**
```typescript
functionName(options: {
  path?: Record<string, any>;
  header?: Record<string, any>;
  body?: Record<string, any>;
  query?: Record<string, any>;
}, callbacks?: {
  onSuccess?: (data: T) => void;
  onError?: (error: any) => void;
}): void
```

## 📖 Examples

### GET Request with Path Parameters

```typescript
const useGetPost = createApiHook({
  method: "GET",
  baseURL: "https://jsonplaceholder.typicode.com",
  endpoint: "/posts/:postId",
  // Path params are automatically extracted from endpoint
});

// Usage
const { response, loading, error, fetchData } = useGetPost();

useEffect(() => {
  fetchData({
    path: { postId: "1" }
  });
}, []);
```

### POST Request with Callbacks

```typescript
const useCreateUser = createApiHook({
  method: "POST",
  baseURL: "https://api.example.com",
  endpoint: "/users",
  options: [
    {
      key: "name",
      location: "body",
      required: true,
    },
    {
      key: "email",
      location: "body",
      required: true,
    },
  ],
  // functionName is automatically "postData" for POST requests
});

// Usage
const { loading, error, postData } = useCreateUser();

const handleSubmit = () => {
  postData({
    body: {
      name: "John Doe",
      email: "john@example.com"
    }
  }, {
    onSuccess: (newUser) => {
      console.log("User created:", newUser);
      router.push(`/users/${newUser.id}`);
    },
    onError: (error) => {
      console.error("Failed to create user:", error);
      setFormError(error.message);
    },
  });
};
```

### GET Request with Query Parameters

```typescript
const useSearchUsers = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/search",
  options: [
    {
      key: "query",
      location: "query",
      // Optional (no defaultValue, no required: true)
    },
    {
      key: "limit",
      location: "query",
      defaultValue: 10,
      // Optional (has defaultValue, so implicitly optional)
    },
    {
      key: "offset",
      location: "query",
      defaultValue: 0,
      // Optional (has defaultValue, so implicitly optional)
    },
  ],
});

// Usage
const { response, fetchData } = useSearchUsers();

useEffect(() => {
  fetchData({
    query: {
      query: "React",
      limit: 20,
    }
  });
}, []);
```

### Typed Parameters with Type Safety

```typescript
import { createApiHook, param } from "react-api-forge";

type LanguageCode = "en_US" | "en_GR" | "es_ES";

const useGetUser = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId",
  // Path params are automatically extracted from endpoint
  options: [
    param<LanguageCode>({
      key: "lang",
      location: "query",
      defaultValue: "en_US",
      // Optional (has defaultValue, so implicitly optional)
    }),
  ],
});

// Usage - TypeScript will enforce correct types
fetchData({
  path: { userId: "123" },
  query: { lang: "en_GR" }
}); // ✅ Valid
fetchData({
  path: { userId: "123" },
  query: { lang: "fr_FR" }
}); // ❌ Type error
fetchData({
  path: { userId: "123" }
}); // ✅ Valid (lang uses default "en_US")
```

### Response Transformation

```typescript
const useGetUserProfile = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId/profile",
  // Path params are automatically extracted from endpoint
  transformResponse: (data) => ({
    ...data,
    fullName: `${data.firstName} ${data.lastName}`,
    avatar: data.avatarUrl || "/default-avatar.png",
  }),
  validateResponse: (data) => data && typeof data.firstName === "string",
});
```

### Error Handling

```typescript
const useApiCall = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/data",
  onError: (error) => {
    // Global error handling
    if (error.response?.status === 401) {
      // Redirect to login
      window.location.href = "/login";
    }
    return error.response?.data?.message || "An error occurred";
  },
});
```

## 🔧 Advanced Usage

### Custom Headers and Authentication

```typescript
const useAuthenticatedRequest = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/protected-data",
  headers: {
    Authorization: `Bearer ${getAuthToken()}`,
    "Content-Type": "application/json",
  },
});
```

### Multiple Path Parameters

```typescript
const useGetData = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId/posts/:postId",
  // Multiple path params are automatically extracted
});

// Usage
fetchData({
  path: {
    userId: "123",
    postId: "456"
  }
});
```

### Complex Example with Header Parameters

```typescript
const useAuthenticatedRequest = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/protected-data/:resourceId",
  // Path params are automatically extracted from endpoint
  options: [
    {
      key: "Authorization",
      location: "header",
      required: true,
      // Explicitly required (no defaultValue)
    },
    {
      key: "version",
      location: "query",
      defaultValue: "v1",
      // Optional (has defaultValue, so implicitly optional)
    },
  ],
});

// Usage
fetchData({
  path: {
    resourceId: "123"
  },
  header: {
    Authorization: `Bearer ${token}`
  },
  query: {
    version: "v2"
  }
});
```

## 🤝 TypeScript Support

React API Forge is built with TypeScript and provides full type safety:

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const useGetUser = createApiHook<User>({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId",
  // Path params are automatically extracted from endpoint
  options: [
    {
      key: "includeProfile",
      location: "query",
      // Optional (no defaultValue, no required: true)
    },
  ],
});

// TypeScript will enforce correct prop types
const { response } = useGetUser();
// response is typed as User | null

// Usage with grouped params
fetchData({
  path: { userId: "123" },
  query: { includeProfile: true }
});
```

## 🛠️ Requirements

- React 16.8.0 or higher
- Axios 0.21.0 or higher

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Axios](https://axios-http.com/) for HTTP requests
- Inspired by modern React patterns and hooks
- TypeScript support for better developer experience

---

Made with ❤️ by [Xarlizard](https://github.com/xarlizard)
