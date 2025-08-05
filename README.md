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

// Create a typed API hook
const useGetUser = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId",
  requiredProps: ["userId"],
  defaultProps: {
    lang: "en_US",
  },
  pathParams: ["userId"],
  queryParams: ["lang"],
});

// Use in your component
const UserProfile = ({ userId }) => {
  const { response, error, loading, fetchData } = useGetUser();

  useEffect(() => {
    fetchData({ userId, lang: "es_ES" });
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
| `method`            | `Method`                    | ✅       | HTTP method (GET, POST, PUT, DELETE, etc.)               |
| `baseURL`           | `string`                    | ✅       | Base URL for the API endpoint                            |
| `endpoint`          | `string \| function`        | ✅       | Endpoint path or function that returns path              |
| `requiredProps`     | `array`                     | ❌       | Array of required property names                         |
| `defaultProps`      | `object`                    | ❌       | Default values for properties                            |
| `pathParams`        | `array`                     | ❌       | Array of path parameter names (for `:param` replacement) |
| `queryParams`       | `array`                     | ❌       | Array of query parameter names                           |
| `headers`           | `object`                    | ❌       | Custom headers for requests                              |
| `validateResponse`  | `function`                  | ❌       | Function to validate response data                       |
| `transformResponse` | `function`                  | ❌       | Function to transform response data                      |
| `onError`           | `function`                  | ❌       | Global error handler function                            |
| `functionName`      | `'fetchData' \| 'postData'` | ❌       | Name of the function returned by hook                    |

#### Returned Hook

The generated hook returns an object with:

| Property    | Type          | Description                                          |
| ----------- | ------------- | ---------------------------------------------------- |
| `response`  | `T \| null`   | The response data from the API call                  |
| `error`     | `any \| null` | Error information if the request failed              |
| `loading`   | `boolean`     | Loading state indicator                              |
| `fetchData` | `function`    | Function to trigger the API call (for GET requests)  |
| `postData`  | `function`    | Function to trigger the API call (for POST requests) |

## 📖 Examples

### GET Request with Path Parameters

```typescript
const useGetPost = createApiHook({
  method: "GET",
  baseURL: "https://jsonplaceholder.typicode.com",
  endpoint: "/posts/:postId",
  requiredProps: ["postId"],
  pathParams: ["postId"],
});

// Usage
const { response, loading, error, fetchData } = useGetPost();

useEffect(() => {
  fetchData({ postId: "1" });
}, []);
```

### POST Request with Callbacks

```typescript
const useCreateUser = createApiHook({
  method: "POST",
  baseURL: "https://api.example.com",
  endpoint: "/users",
  requiredProps: ["name", "email"],
  functionName: "postData", // Returns postData instead of fetchData
});

// Usage
const { loading, error, postData } = useCreateUser();

const handleSubmit = (userData) => {
  postData(userData, {
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

### Dynamic Endpoint with Query Parameters

```typescript
const useSearchUsers = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: ({ category }) =>
    category ? `/users/search/${category}` : "/users/search",
  defaultProps: {
    limit: 10,
    offset: 0,
  },
  queryParams: ["query", "limit", "offset"],
});

// Usage
const { response, fetchData } = useSearchUsers();

useEffect(() => {
  fetchData({
    category: "developers",
    query: "React",
    limit: 20,
  });
}, []);
```

### Response Transformation

```typescript
const useGetUserProfile = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId/profile",
  pathParams: ["userId"],
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

### Conditional Endpoints

```typescript
const useGetData = createApiHook({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: ({ userId, isAdmin }) =>
    isAdmin ? `/admin/users/${userId}` : `/users/${userId}`,
  requiredProps: ["userId"],
  pathParams: ["userId"],
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

interface GetUserProps {
  userId: string;
  includeProfile?: boolean;
}

const useGetUser = createApiHook<GetUserProps, User>({
  method: "GET",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId",
  requiredProps: ["userId"],
  pathParams: ["userId"],
  queryParams: ["includeProfile"],
});

// TypeScript will enforce correct prop types
const { response } = useGetUser();
// response is typed as User | null
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
