/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
import type { XHR, XHRConfiguration } from './types';
import { DefaultXHR } from './default-xhr';
import { describe, test, expect, beforeEach } from 'vitest';
import { XHR_FETCH_METHODS } from './constants';

describe('DefaultXHR', () => {
    const hostname: string = 'example';
    const port: string = '3000';

    class MockAdapter extends DefaultXHR {
        constructor(config: XHRConfiguration) {
            super(config);
        }

        protected _serialize(headers?: Record<string, string>, body?: any): Promise<void | Error> {
            return Promise.resolve();
        }

        protected _unSerialize(): Promise<any | Error> {
            return Promise.resolve();
        }
    }

    let sut: XHR;
    beforeEach(() => {
        sut = new MockAdapter({ hostname, port });
    });

    test('Default request is performed as expected', async () => {
        await sut.fetch('/path');
        expect(sut.request).not.toBeUndefined();
        expect(sut.request?.method).toEqual(XHR_FETCH_METHODS.GET);
        expect(sut.url).not.toBeUndefined();
        expect(sut.url?.href).toEqual(`http://${hostname}:${port}/path`);
    });

    test('Params are added/replaced', async () => {
        await sut.fetch('/path/{id}', {
            params: { id: '1', key: 'value' }
        });
        expect(sut.url).not.toBeUndefined();
        expect(sut.url?.href).toEqual(`http://${hostname}:${port}/path/1?key=value`);
    });

    test('Any error is captured and returned', async () => {
        const response = await sut.fetch('/path/{id}', {
            params: { foo: 'value' }
        });
        expect(response).toBeInstanceOf(Error);
    });
});
/* eslint-enable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
