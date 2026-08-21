import { type XHR } from '../types';
import { JSONAdapter } from './json-adapter';
import { describe, test, expect, beforeEach } from 'vitest';
import { EMPTY_BODY_ERROR, XHR_FETCH_METHODS } from '../constants';

describe('JSONAdapter', () => {
    const hostname: string = 'example';
    const port: string = '3000';

    let sut: XHR;
    beforeEach(() => {
        sut = new JSONAdapter({ hostname, port });
    });

    test('"application/json" headers are set into request', async () => {
        await sut.fetch('/path');
        const config = sut.getPathRequest('/path');
        expect(config.request).not.toBeUndefined();
        expect(config.request?.headers.get('Accept')).toEqual('application/json');
        expect(config.request?.headers.get('Content-Type')).toEqual('application/json');
    });

    test('An error is returned if POST/PUT/PATCH request do not have a body', async () => {
        const error = await sut.fetch('/path', { method: XHR_FETCH_METHODS.POST });
        expect(error).toEqual(EMPTY_BODY_ERROR);
    });
});
