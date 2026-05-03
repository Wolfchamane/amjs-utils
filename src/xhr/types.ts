/* eslint-disable @typescript-eslint/no-explicit-any */
export type XHRDebugLevel = 'quiet' | 'error' | 'warning' | 'log' | 'details';
export type XHRFetchMethod = 'OPTIONS' | 'HEAD' | 'GET' | 'PATCH' | 'PUT' | 'POST' | 'DELETE' | 'CONNECT' | 'TRACE';

export interface XHRFetchOptions {
    method?: XHRFetchMethod;
    headers?: Record<string, string>;
    params?: Record<string, any>;
    body?: any;
}

export interface XHR {
    buildRequest(path: string, options: XHRFetchOptions): void;
    fetch<T>(path: string, options?: XHRFetchOptions): Promise<T | any>;
    abort(reason?: string): void;
    reset(): void;
}

export interface XHRConfiguration {
    hostname: string;
    port?: string;
    debug?: XHRDebugLevel;
    secure?: boolean;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
