import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';

export interface ApiHookConfig<TProps extends Record<string, any>> {
  method: HttpMethod;
  urlConstructor: (props: TProps) => string;
  requiredProps?: Array<keyof TProps>;
  defaultProps?: Partial<TProps>;
  baseURL?: string;
  validateProps?: (props: TProps) => string | null;
  transformResponse?: (data: any) => any;
  axiosConfig?: Omit<AxiosRequestConfig, 'url' | 'method' | 'baseURL'>;
}

export interface ApiHookResult<TData = any, TError = any> {
  data: TData | null;
  error: TError | null;
  loading: boolean;
  refetch: () => Promise<void>;
}

export interface ApiHookInstance<TProps extends Record<string, any>, TData = any, TError = any> {
  (props: TProps): ApiHookResult<TData, TError>;
}

export interface ApiResponse<T = any> extends AxiosResponse<T> { }
