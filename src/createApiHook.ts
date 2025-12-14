import { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';
import type {
  ParamLocation,
  ApiParam,
  ApiHookConfig,
  ApiCallOptions,
  ApiHookResult,
} from './types';

// Helper function for better type inference
export function param<T>(p: ApiParam<T>): ApiParam<T> {
  return p;
}

// Extract path parameters from endpoint string (e.g., "/users/:userId" -> ["userId"])
function extractPathParams(endpoint: string): string[] {
  const matches = endpoint.matchAll(/:(\w+)/g);
  return Array.from(matches, (match) => match[1]);
}

// Generate function name from HTTP method
function getFunctionName(method: Method, customName?: string): string {
  if (customName) return customName;
  
  const methodLower = method.toLowerCase();
  switch (methodLower) {
    case 'get':
      return 'fetchData';
    case 'post':
      return 'postData';
    case 'put':
      return 'putData';
    case 'patch':
      return 'patchData';
    case 'delete':
      return 'deleteData';
    default:
      return 'fetchData';
  }
}

// Types are exported from ./types.ts

export const createApiHook = <TData = any>(
  config: ApiHookConfig<TData>
) => {
  // Extract path params from endpoint automatically
  const pathParams = extractPathParams(config.endpoint);
  
  // Derive configuration from options array (path params are not in options array)
  const queryParams = (config.options || [])
    .filter((p) => p.location === 'query')
    .map((p) => p.key);
  const headerParams = (config.options || [])
    .filter((p) => p.location === 'header')
    .map((p) => p.key);
  const bodyParams = (config.options || [])
    .filter((p) => p.location === 'body')
    .map((p) => p.key);
  
  // Required params logic:
  // - Path params are always required (implicit)
  // - Options with defaultValue are optional (implicit)
  // - Only options with required: true and no defaultValue need explicit requirement
  const requiredQueryParams = (config.options || [])
    .filter((p) => p.location === 'query' && p.required === true && p.defaultValue === undefined)
    .map((p) => p.key);
  const requiredHeaderParams = (config.options || [])
    .filter((p) => p.location === 'header' && p.required === true && p.defaultValue === undefined)
    .map((p) => p.key);
  const requiredBodyParams = (config.options || [])
    .filter((p) => p.location === 'body' && p.required === true && p.defaultValue === undefined)
    .map((p) => p.key);
  
  // Default values by location
  const defaultQueryValues = Object.fromEntries(
    (config.options || [])
      .filter((p) => p.location === 'query' && p.defaultValue !== undefined)
      .map((p) => [p.key, p.defaultValue])
  );
  const defaultHeaderValues = Object.fromEntries(
    (config.options || [])
      .filter((p) => p.location === 'header' && p.defaultValue !== undefined)
      .map((p) => [p.key, p.defaultValue])
  );
  const defaultBodyValues = Object.fromEntries(
    (config.options || [])
      .filter((p) => p.location === 'body' && p.defaultValue !== undefined)
      .map((p) => [p.key, p.defaultValue])
  );
  
  const functionName = getFunctionName(config.method, config.functionName);

  return (): ApiHookResult<TData> => {
    const [response, setResponse] = useState<TData | null>(null);
    const [error, setError] = useState<any | null>(null);
    const [loading, setLoading] = useState(false);

    const controllerRef = useRef<AbortController | null>(null);
    const clientRef = useRef<AxiosInstance>(
      axios.create({
        baseURL: config.baseURL,
        headers: config.headers || {},
      })
    );

    useEffect(() => {
      return () => {
        controllerRef.current?.abort();
      };
    }, []);

    const validateParams = (options: ApiCallOptions): boolean => {
      // Validate path params (always required)
      if (pathParams.length > 0) {
        const path = options.path || {};
        const missingPathParams = pathParams.filter((key) => {
          const value = path[key];
          return value === undefined || value === null || value === '';
        });
        if (missingPathParams.length > 0) {
          return false;
        }
      }

      // Validate required query params
      const query = { ...defaultQueryValues, ...(options.query || {}) };
      const missingQueryParams = requiredQueryParams.filter((key) => {
        const value = query[key];
        return value === undefined || value === null || value === '';
      });
      if (missingQueryParams.length > 0) {
        return false;
      }

      // Validate required header params
      const header = { ...defaultHeaderValues, ...(options.header || {}) };
      const missingHeaderParams = requiredHeaderParams.filter((key) => {
        const value = header[key];
        return value === undefined || value === null || value === '';
      });
      if (missingHeaderParams.length > 0) {
        return false;
      }

      // Validate required body params
      const body = { ...defaultBodyValues, ...(options.body || {}) };
      const missingBodyParams = requiredBodyParams.filter((key) => {
        const value = body[key];
        return value === undefined || value === null || value === '';
      });
      if (missingBodyParams.length > 0) {
        return false;
      }

      return true;
    };

    const buildUrl = (pathOptions: Record<string, any>): string => {
      let url = config.endpoint;

      // Replace path parameters in the endpoint
      pathParams.forEach((key) => {
        const value = pathOptions[key];
        if (value !== undefined && value !== null) {
          const replacement = String(value);
          url = url.replace(`:${key}`, replacement);
        }
      });

      return url;
    };

    const buildQueryParams = (queryOptions: Record<string, any>): Record<string, any> => {
      const merged = { ...defaultQueryValues, ...queryOptions };
      const result: Record<string, any> = {};

      queryParams.forEach((key) => {
        const value = merged[key];
        if (value !== undefined && value !== null && value !== '') {
          result[key] = value;
        }
      });

      return result;
    };

    const buildHeaders = (headerOptions: Record<string, any>): Record<string, string> => {
      const headers: Record<string, string> = { ...(config.headers || {}) };
      const merged = { ...defaultHeaderValues, ...headerOptions };

      headerParams.forEach((key) => {
        const value = merged[key];
        if (value !== undefined && value !== null && value !== '') {
          headers[key] = String(value);
        }
      });

      return headers;
    };

    const buildBody = (bodyOptions: Record<string, any>): Record<string, any> => {
      const merged = { ...defaultBodyValues, ...bodyOptions };
      const result: Record<string, any> = {};

      bodyParams.forEach((key) => {
        const value = merged[key];
        if (value !== undefined && value !== null) {
          result[key] = value;
        }
      });

      return result;
    };

    const executeRequest = useCallback(
      (options: ApiCallOptions = {}, callbacks?: { onSuccess?: (data: TData) => void; onError?: (error: any) => void }) => {
        setLoading(true);
        setError(null);

        // Validate required params
        if (!validateParams(options)) {
          const error = new Error('Missing required parameters');
          setError(error);
          setLoading(false);

          // Call onError callback if provided
          if (callbacks?.onError) {
            callbacks.onError(error);
          }
          return;
        }

        // Cancel previous request
        controllerRef.current?.abort();
        controllerRef.current = new AbortController();

        const url = buildUrl(options.path || {});
        const queryParamsObj = buildQueryParams(options.query || {});
        const headers = buildHeaders(options.header || {});
        const bodyData = buildBody(options.body || {});

        const requestConfig: AxiosRequestConfig = {
          url,
          method: config.method,
          signal: controllerRef.current.signal,
          headers,
        };

        // Add query parameters
        if (Object.keys(queryParamsObj).length > 0) {
          requestConfig.params = queryParamsObj;
        }

        // Add body data for non-GET requests
        if (config.method !== 'GET' && Object.keys(bodyData).length > 0) {
          requestConfig.data = bodyData;
        }

        clientRef.current(requestConfig)
          .then((result) => {
            const data = result.data;

            // Validate response if validator provided
            if (config.validateResponse && !config.validateResponse(data)) {
              throw new Error('Invalid response data');
            }

            // Transform response if transformer provided
            const transformedData = config.transformResponse
              ? config.transformResponse(data)
              : data;

            setResponse(transformedData);

            // Call onSuccess callback if provided
            if (callbacks?.onSuccess) {
              callbacks.onSuccess(transformedData);
            }
          })
          .catch((err) => {
            const errorResult = config.onError
              ? config.onError(err)
              : err.response?.data?.message || err.message;

            setError(errorResult);

            // Call onError callback if provided
            if (callbacks?.onError) {
              callbacks.onError(errorResult);
            }
          })
          .finally(() => {
            setLoading(false);
          });
      },
      []
    );

    const result: ApiHookResult<TData> = {
      response,
      error,
      loading,
    };

    // Assign the function with the appropriate name
    (result as any)[functionName] = executeRequest;

    return result;
  };
};

export default createApiHook;
