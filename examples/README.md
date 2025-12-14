# React API Forge Examples

This directory contains example implementations using react-api-forge.

## Basic GET Request

```typescript
import { createApiHook } from "react-api-forge";

export const useGetUser = createApiHook({
  method: "GET",
  baseURL: "https://jsonplaceholder.typicode.com",
  endpoint: "/users/:userId",
  // Path params are automatically extracted from endpoint
});

// Usage in component:
// const { response, loading, error, fetchData } = useGetUser();
// useEffect(() => {
//   fetchData({
//     path: { userId: "1" }
//   });
// }, []);
```

## POST Request with Callbacks

```typescript
import { createApiHook } from "react-api-forge";

export const useCreateUser = createApiHook({
  method: "POST",
  baseURL: "https://jsonplaceholder.typicode.com",
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

// Usage in component:
// const { loading, error, postData } = useCreateUser();
// const handleSubmit = () => {
//   postData({
//     body: {
//       name: "John Doe",
//       email: "john@example.com"
//     }
//   }, {
//     onSuccess: (user) => console.log("Created:", user),
//     onError: (err) => console.error("Error:", err)
//   });
// };
```

## Search with Query Parameters

```typescript
import { createApiHook } from "react-api-forge";

export const useSearchPosts = createApiHook({
  method: "GET",
  baseURL: "https://jsonplaceholder.typicode.com",
  endpoint: "/posts",
  options: [
    {
      key: "q",
      location: "query",
      // Optional (no defaultValue, no required: true)
    },
    {
      key: "_limit",
      location: "query",
      defaultValue: 10,
      // Optional (has defaultValue, so implicitly optional)
    },
    {
      key: "_page",
      location: "query",
      defaultValue: 1,
      // Optional (has defaultValue, so implicitly optional)
    },
    {
      key: "userId",
      location: "query",
      required: true,
      // Required (explicitly required, no defaultValue)
    },
  ],
});

// Usage:
// fetchData({
//   query: {
//     q: "search term",
//     _limit: 20,
//     userId: "1"
//   }
// });
// Generates: /posts?q=search%20term&_limit=20&_page=1&userId=1
```

## Typed Parameters with Helper Function

```typescript
import { createApiHook, param } from "react-api-forge";

type LanguageCode = "en_US" | "en_GR" | "es_ES";

export const useGetUser = createApiHook({
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

// Usage:
// fetchData({
//   path: { userId: "123" },
//   query: { lang: "en_GR" }
// }); // ✅ Type-safe
// fetchData({
//   path: { userId: "123" },
//   query: { lang: "fr_FR" }
// }); // ❌ Type error
```

## Complex Example with Multiple Param Types

```typescript
import { createApiHook } from "react-api-forge";

export const useUpdateUser = createApiHook({
  method: "PUT",
  baseURL: "https://api.example.com",
  endpoint: "/users/:userId",
  // Path params are automatically extracted from endpoint
  options: [
    {
      key: "Authorization",
      location: "header",
      required: true,
      // Explicitly required (no defaultValue)
    },
    {
      key: "name",
      location: "body",
      required: true,
      // Explicitly required (no defaultValue)
    },
    {
      key: "email",
      location: "body",
      // Optional (no defaultValue, no required: true)
    },
    {
      key: "version",
      location: "query",
      defaultValue: "v1",
      // Optional (has defaultValue, so implicitly optional)
    },
  ],
  // functionName is automatically "putData" for PUT requests
});

// Usage:
// putData({
//   path: {
//     userId: "123",
//   },
//   header: {
//     Authorization: "Bearer token123",
//   },
//   body: {
//     name: "John Doe",
//     email: "john@example.com",
//   },
//   query: {
//     version: "v2",
//   },
// });
```

For more examples, check the [main README](../README.md).
