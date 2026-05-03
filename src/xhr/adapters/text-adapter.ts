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
 * Adaptor for any `'text/plain'` AJAX Http Request.
 * @see https://github.com/Wolfchamane/amjs-js-utils/blob/master/examples/xhr/main.ts
 */
export class TextAdapter extends DefaultXHR {
    /**
     * @override
     */
    protected _serialize(headers?: Record<string, string>, body?: any): Promise<void | Error> {
        return new Promise(resolve => {
            this._log(this.LOG_INFO, false, `Serializing request for text`);
            if (this.request && this.url) {
                const textHeaders: Record<string, string> = Object.assign({}, headers || {}, {
                    Accept: 'text/plain',
                    'Content-Type': 'text/plain'
                });

                Object.keys(textHeaders).forEach((key: string) => {
                    this.request?.headers.set(key, textHeaders[key]);
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

                this._log(this.LOG_DETAIL, false, `Request override to: %o`, this.request);
                resolve();
            } else {
                throw SERIALIZE_EMPTY_REQUEST_ERROR;
            }
        });
    }

    /**
     * @override
     */
    protected async _unSerialize(): Promise<string | Error> {
        this._log(this.LOG_INFO, false, `unSerializing request for text/plain`);
        if (this.response && this.response.ok) {
            return await this.response.text();
        } else {
            throw UNSERIALIZE_EMPTY_REQUEST_ERROR;
        }
    }
}
/* eslint-enable @typescript-eslint/no-explicit-any */
