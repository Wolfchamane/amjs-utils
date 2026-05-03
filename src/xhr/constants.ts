import type { XHRDebugLevel, XHRFetchMethod } from '@/xhr/types';

export enum XHR_FETCH_METHODS {
    OPTIONS = 'OPTIONS',
    HEAD = 'HEAD',
    GET = 'GET',
    PATCH = 'PATCH',
    PUT = 'PUT',
    POST = 'POST',
    DELETE = 'DELETE',
    CONNECT = 'CONNECT',
    TRACE = 'TRACE'
}

export enum XHR_DEBUG_LEVELS {
    QUIET = 'quiet',
    ERROR = 'error',
    WARNING = 'warning',
    LOG = 'log',
    DETAILS = 'details'
}

export const EMPTY_BODY_ERROR: Error = new Error('Cannot serialize empty body request');
export const SERIALIZE_EMPTY_REQUEST_ERROR: Error = new Error('Cannot serialized undefined request');
export const UNSERIALIZE_EMPTY_REQUEST_ERROR: Error = new Error('Cannot unSerialize empty or failed response');
