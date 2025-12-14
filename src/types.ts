import { Method } from 'axios';

export type ParamLocation = 'query' | 'header' | 'body';

export interface ApiParam<T = unknown> {
  key: string;
  location: ParamLocation;
  /**
   * Whether the parameter is required from the user's perspective.
   * 
   * **Note:** If `defaultValue` is provided, this parameter is automatically optional
   * (the `required` flag is ignored). The API will always receive a value (either
   * user-provided or the default), but users don't need to provide it.
   * 
   * - Options with `defaultValue` are optional (implicit) - `required` is ignored
   * - Only specify `required: true` for options without `defaultValue` that must be provided
   */
  required?: boolean;
  defaultValue?: T;
  valueType?: T; // used only for inference, not runtime
}

export interface ApiHookConfig<TData = any> {
  method: Method;
  baseURL: string;
  endpoint: string;
  options?: ApiParam[];
  headers?: Record<string, string>;
  validateResponse?: (data: any) => boolean;
  transformResponse?: (data: any) => TData;
  onError?: (error: any) => any;
  functionName?: string;
}

export interface ApiCallOptions {
  path?: Record<string, any>;
  header?: Record<string, any>;
  body?: Record<string, any>;
  query?: Record<string, any>;
}

export type ApiHookFunction<TData = any> = (options: ApiCallOptions, callbacks?: { onSuccess?: (data: TData) => void; onError?: (error: any) => void }) => void;

export interface ApiHookResult<TData = any> {
  response: TData | null;
  error: any | null;
  loading: boolean;
  fetchData?: ApiHookFunction<TData>;
  postData?: ApiHookFunction<TData>;
  putData?: ApiHookFunction<TData>;
  patchData?: ApiHookFunction<TData>;
  deleteData?: ApiHookFunction<TData>;
}

