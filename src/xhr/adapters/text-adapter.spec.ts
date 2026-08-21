import type { XHR } from '../types';
import { TextAdapter } from './text-adapter';
import { describe, test, expect, beforeEach } from 'vitest';
import { XHR_FETCH_METHODS, EMPTY_BODY_ERROR } from '../constants';

describe('TextAdapter', () => {
    const hostname: string = 'example';
    const port: string = '3000';
    const responseOk = { status: 'ok' };

    let sut: XHR;
    beforeEach(() => {
        sut = new TextAdapter({ hostname, port });
    });

    test('"text/plain" headers are set into request', async () => {
        await sut.fetch('/path');
        const config = sut.getPathRequest('/path');
        expect(config.request).not.toBeUndefined();
        expect(config.request?.headers.get('Accept')).toEqual('text/plain');
        expect(config.request?.headers.get('Content-Type')).toEqual('text/plain');
    });

    test('An error is returned if POST/PUT/PATCH request do not have a body', async () => {
        const response = await sut.fetch('/path', {
            method: XHR_FETCH_METHODS.POST
        });
        expect(response).toEqual(EMPTY_BODY_ERROR);
    });
});
