import { useState, useEffect, useCallback, useRef } from 'react';
import axios, { AxiosInstance, AxiosRequestConfig, Method } from 'axios';

export interface ApiHookConfig<TProps extends Record<string, any>, TData = any> {
  method: Method;
  baseURL: string;
  endpoint: string | ((props: TProps) => string);
  requiredProps?: (keyof TProps)[];
  defaultProps?: Partial<TProps>;
  headers?: Record<string, string>;
  queryParams?: (keyof TProps)[];
  pathParams?: (keyof TProps)[];
  validateResponse?: (data: any) => boolean;
  transformResponse?: (data: any) => TData;
  onError?: (error: any) => any;
  functionName?: 'fetchData' | 'postData';
}

export interface ApiHookResult<TData = any> {
  response: TData | null;
  error: any | null;
  loading: boolean;
  fetchData?: (props: any, callbacks?: { onSuccess?: (data: TData) => void; onError?: (error: any) => void }) => void;
  postData?: (props: any, callbacks?: { onSuccess?: (data: TData) => void; onError?: (error: any) => void }) => void;
}

export const createApiHook = <TProps extends Record<string, any>, TData = any>(
  config: ApiHookConfig<TProps, TData>
) => {
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

    const validateProps = (props: Partial<TProps>): props is TProps => {
      if (!config.requiredProps) return true;

      return config.requiredProps.every((prop) => {
        const value = props[prop];
        return value !== undefined && value !== null && value !== '';
      });
    }; const buildUrl = (props: TProps): string => {
      let url = typeof config.endpoint === 'function'
        ? config.endpoint(props)
        : config.endpoint;

      // Replace path parameters in the endpoint
      if (config.pathParams) {
        config.pathParams.forEach((param) => {
          const value = props[param];
          if (value !== undefined && value !== null) {
            const replacement = String(value);
            url = url.replace(`:${String(param)}`, replacement);
          }
        });
      }

      return url;
    };

    const buildQueryParams = (props: TProps): Record<string, any> => {
      const queryParams: Record<string, any> = {};

      if (config.queryParams) {
        config.queryParams.forEach((param) => {
          const value = props[param];
          if (value !== undefined && value !== null && value !== '') {
            queryParams[String(param)] = value;
          }
        });
      }

      return queryParams;
    }; const fetchData = useCallback(
      (props: Partial<TProps> = {}, callbacks?: { onSuccess?: (data: TData) => void; onError?: (error: any) => void }) => {
        setLoading(true);
        setError(null);

        // Merge with default props
        const finalProps = {
          ...config.defaultProps,
          ...props,
        } as TProps;

        // Validate required props
        if (!validateProps(finalProps)) {
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

        const url = buildUrl(finalProps);
        const queryParams = buildQueryParams(finalProps);

        const requestConfig: AxiosRequestConfig = {
          url,
          method: config.method,
          signal: controllerRef.current.signal,
        };

        // Add query parameters for GET requests
        if (config.method === 'GET') {
          requestConfig.params = queryParams;
        } else {
          // For POST/PUT/PATCH, send all non-path params as data, query params as params
          const bodyData: Record<string, any> = {};
          const pathParamKeys = config.pathParams || [];
          const queryParamKeys = config.queryParams || [];

          Object.keys(finalProps).forEach((key) => {
            if (!pathParamKeys.includes(key as keyof TProps) &&
              !queryParamKeys.includes(key as keyof TProps)) {
              bodyData[key] = finalProps[key as keyof TProps];
            }
          });

          requestConfig.data = bodyData;
          if (Object.keys(queryParams).length > 0) {
            requestConfig.params = queryParams;
          }
        } clientRef.current(requestConfig)
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
    ); const functionName = config.functionName || (config.method === 'POST' ? 'postData' : 'fetchData');

    const result: ApiHookResult<TData> = {
      response,
      error,
      loading,
    };

    if (functionName === 'postData') {
      result.postData = fetchData;
    } else {
      result.fetchData = fetchData;
    }

    return result;
  };
};

export default createApiHook;
