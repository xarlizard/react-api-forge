# React API Forge Examples

This directory contains example implementations using react-api-forge.

## Basic GET Request

```typescript
import { createApiHook } from "react-api-forge";

export const useGetUser = createApiHook({
  method: "GET",
  baseURL: "https://jsonplaceholder.typicode.com",
  endpoint: "/users/:userId",
  requiredProps: ["userId"],
  pathParams: ["userId"],
});

// Usage in component:
// const { response, loading, error, fetchData } = useGetUser();
// useEffect(() => { fetchData({ userId: "1" }); }, []);
```

## POST Request with Callbacks

```typescript
import { createApiHook } from "react-api-forge";

export const useCreateUser = createApiHook({
  method: "POST",
  baseURL: "https://jsonplaceholder.typicode.com",
  endpoint: "/users",
  requiredProps: ["name", "email"],
  functionName: "postData",
});

// Usage in component:
// const { loading, error, postData } = useCreateUser();
// const handleSubmit = (userData) => {
//   postData(userData, {
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
  defaultProps: {
    _limit: 10,
    _page: 1,
  },
  queryParams: ["q", "_limit", "_page", "userId"],
});

// Usage:
// fetchData({ q: "search term", _limit: 20, userId: "1" });
// Generates: /posts?q=search%20term&_limit=20&_page=1&userId=1
```

For more examples, check the [main README](../README.md).
