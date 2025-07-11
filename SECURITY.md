# Security Policy

## Supported Versions

We actively support the following versions of React API Forge with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take security seriously and appreciate your efforts to responsibly disclose security vulnerabilities.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by:

1. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature
2. **Direct Message**: Contact [@xarlizard](https://github.com/xarlizard) directly

### What to Include

When reporting a vulnerability, please include:

- **Description**: A clear description of the vulnerability
- **Impact**: What could happen if this vulnerability is exploited
- **Reproduction**: Step-by-step instructions to reproduce the issue
- **Environment**: React version, browser, and React API Forge version
- **Code Sample**: Minimal code example demonstrating the issue (if applicable)

### Response Timeline

We aim to respond to security reports within:

- **Initial Response**: 48 hours
- **Status Update**: 7 days
- **Resolution**: 30 days (for confirmed vulnerabilities)

### Security Considerations for Users

When using React API Forge in your applications:

#### API Security Best Practices

1. **Authentication Tokens**:

   ```typescript
   // ✅ Good - Secure token handling
   const useSecureApi = createApiHook({
     method: "GET",
     baseURL: "https://api.example.com",
     endpoint: "/protected",
     headers: {
       Authorization: () => `Bearer ${getTokenSecurely()}`, // Dynamic token
     },
   });

   // ❌ Avoid - Hardcoded sensitive data
   const useUnsafeApi = createApiHook({
     headers: {
       Authorization: "Bearer hardcoded-token", // Don't do this
     },
   });
   ```

2. **Input Validation**:

   ```typescript
   // ✅ Good - Validate and sanitize inputs
   const useUserApi = createApiHook({
     method: "GET",
     baseURL: "https://api.example.com",
     endpoint: "/users/:userId",
     validateResponse: (data) => {
       return (
         data && typeof data.id === "number" && typeof data.name === "string"
       );
     },
   });
   ```

3. **Error Handling**:

   ```typescript
   // ✅ Good - Don't expose sensitive error details
   const useApi = createApiHook({
     method: "GET",
     baseURL: "https://api.example.com",
     endpoint: "/data",
     onError: (error) => {
       // Log full error for debugging (server-side only)
       console.error("API Error:", error);

       // Return sanitized error message to user
       return "Something went wrong. Please try again.";
     },
   });
   ```

#### Common Security Pitfalls

- **XSS Prevention**: Always sanitize data received from APIs before rendering
- **CSRF Protection**: Use proper CSRF tokens with state-changing requests
- **Data Exposure**: Avoid logging sensitive data in error messages
- **URL Parameters**: Be cautious with sensitive data in URL parameters

#### Dependencies

React API Forge depends on:

- **Axios**: We monitor Axios security advisories and update when necessary
- **React**: Follow React security best practices in your applications

### Scope

This security policy covers:

- The React API Forge library code
- Build and release processes
- Documentation and examples

This policy does not cover:

- Your application's implementation using React API Forge
- Third-party services you connect to via the hooks
- Security issues in React, Axios, or other dependencies (report to respective projects)

### Recognition

We appreciate security researchers and will acknowledge your contribution (with your permission) in:

- Security advisory credits
- CHANGELOG.md mentions
- Hall of fame (if we create one)

Thank you for helping keep React API Forge and our community safe!
