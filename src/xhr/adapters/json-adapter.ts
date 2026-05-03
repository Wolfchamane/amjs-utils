/* eslint-disable @typescript-eslint/no-explicit-any */
import { DefaultXHR } from '../default-xhr';
import type { XHRFetchMethod } from '../types';
import {
    XHR_FETCH_METHODS,
    EMPTY_BODY_ERROR,
    UNSERIALIZE_EMPTY_REQUEST_ERROR,
    SERIALIZE_EMPTY_REQUEST_ERROR
} from '../constants';

/**
 * Adaptor for any `'application/json'` AJAX Http Request.
 * @see https://github.com/Wolfchamane/amjs-js-utils/blob/master/examples/xhr/main.ts
 */
export class JSONAdapter extends DefaultXHR {
    /**
     * @override
     */
    protected _serialize(headers?: Record<string, string>, body?: any): Promise<void | Error> {
        return new Promise(resolve => {
            this._log(this.LOG_INFO, false, `Serializing request for JSON`);
            if (this.request && this.url) {
                const jsonHeaders: Record<string, string> = Object.assign({}, headers || {}, {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                });

                Object.keys(jsonHeaders).forEach((key: string) => {
                    this.request?.headers.set(key, jsonHeaders[key]);
                });

                const isModifyingRequest: boolean =
                    [XHR_FETCH_METHODS.PATCH, XHR_FETCH_METHODS.PUT, XHR_FETCH_METHODS.POST].includes(
                        this.request?.method as XHRFetchMethod
                    ) && !!body;
                if (isModifyingRequest) {
                    this.request = new Request(this.url, {
                        method: this.request?.method,
                        headers: this.request?.headers,
                        body: JSON.stringify(body)
                    }) as Request;
                } else {
                    throw EMPTY_BODY_ERROR;
                }

                this._log(this.LOG_DETAIL, false, `Override request to: %o`, this.request);
                resolve();
            } else {
                throw SERIALIZE_EMPTY_REQUEST_ERROR;
            }
        });
    }

    /**
     * @override
     * @protected
     */
    protected async _unSerialize<T>(): Promise<T | Error> {
        this._log(this.LOG_INFO, false, `unSerializing request for JSON`);
        if (this.response && this.response.ok) {
            return (await this.response.json()) as T;
        } else {
            throw UNSERIALIZE_EMPTY_REQUEST_ERROR;
        }
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
