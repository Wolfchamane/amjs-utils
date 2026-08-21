import type { TRecord } from '../types';

export interface PathRequestConfig {
    /**
     * To control request
     * @property    controller
     * @type        {AbortController|undefined}
     * @protected
     */
    controller?: AbortController;

    /**
     * To be performed
     * @property    request
     * @type        {Request|undefined}
     * @protected
     */
    request?: Request;

    /**
     * Obtained from request
     * @property    response
     * @type        {Response|undefined}
     * @protected
     */
    response?: Response;

    /**
     * Fetched
     * @property    url
     * @type        {URL|undefined}
     * @protected
     */
    url?: URL;
}

export type XHRDebugLevel = 'quiet' | 'error' | 'warning' | 'log' | 'details';
export type XHRFetchMethod =
    | 'OPTIONS'
    | 'HEAD'
    | 'GET'
    | 'PATCH'
    | 'PUT'
    | 'POST'
    | 'DELETE'
    | 'CONNECT'
    | 'TRACE'
    | 'QUERY';

export enum XHR_FETCH_METHODS {
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
    GET = 'GET',
    PATCH = 'PATCH',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE',
    CONNECT = 'CONNECT',
    TRACE = 'TRACE',
    QUERY = 'QUERY'
}

export enum XHR_DEBUG_LEVELS {
    QUIET = 'quiet',
    ERROR = 'error',
    WARNING = 'warning',
    LOG = 'log',
    DETAILS = 'details'
}

export interface XHRFetchOptions<TBody = unknown> {
    method?: XHRFetchMethod;
    headers?: TRecord<string>;
    params?: TRecord;
    body?: TBody;
}

export interface XHR {
    fetch<TResponse, TBody>(path: string, options?: XHRFetchOptions<TBody>): Promise<TResponse | Error>;
    abort(reason?: string): void;
    reset(): void;
    getPathRequest(path: string): PathRequestConfig | undefined;
}

export interface XHRConfiguration {
    hostname: string;
    port?: string;
    debug?: XHRDebugLevel;
    secure?: boolean;
}
