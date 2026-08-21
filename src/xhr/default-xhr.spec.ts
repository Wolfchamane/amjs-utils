import { type XHR, type XHRConfiguration, XHR_FETCH_METHODS } from './types';
import { DefaultXHR } from './default-xhr';
import { describe, test, expect, beforeEach } from 'vitest';
import { TRecord } from '@/types';

describe('DefaultXHR', () => {
    const hostname: string = 'example';
    const port: string = '3000';

    class MockAdapter extends DefaultXHR {
        constructor(config: XHRConfiguration) {
            super(config);
        }

        protected _serialize(_path: string, _headers?: TRecord<string>, _body?: unknown): Promise<void | Error> {
            return Promise.resolve();
        }

        protected _unSerialize<T = unknown>(_path: string): Promise<T | Error> {
            return Promise.resolve({} as T);
        }
    }

    let sut: XHR;
    beforeEach(() => {
        sut = new MockAdapter({ hostname, port });
    });

    test('Default request is performed as expected', async () => {
        await sut.fetch('/path');
        const config = sut.getPathRequest('/path');
        expect(config.request).not.toBeUndefined();
        expect(config.request?.method).toEqual(XHR_FETCH_METHODS.GET);
        expect(config.url).not.toBeUndefined();
        expect(config.url?.href).toEqual(`http://${hostname}:${port}/path`);
    });

    test('Params are added/replaced', async () => {
        await sut.fetch('/path/{id}', {
            params: { id: '1', key: 'value' }
        });
        const config = sut.getPathRequest('/path/{id}');
        expect(config.url).not.toBeUndefined();
        expect(config.url?.href).toEqual(`http://${hostname}:${port}/path/1?key=value`);
    });

    test('Any error is captured and returned', async () => {
        const response = await sut.fetch('/path/{id}', {
            params: { foo: 'value' }
        });
        expect(response).toBeInstanceOf(Error);
    });
});
