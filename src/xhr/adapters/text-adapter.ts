import { DefaultXHR } from '../default-xhr';
import { type PathRequestConfig, XHR_FETCH_METHODS } from '../types';
import { EMPTY_BODY_ERROR, UNSERIALIZE_EMPTY_REQUEST_ERROR, SERIALIZE_EMPTY_REQUEST_ERROR } from '../constants';
import { TRecord } from '../../types';

/**
 * Adaptor for any `'text/plain'` AJAX Http Request.
 * @see https://github.com/Wolfchamane/amjs-js-utils/blob/master/examples/xhr/main.ts
 */
export class TextAdapter extends DefaultXHR {
    /**
     * @override
     */
    protected _serialize(path: string, headers?: TRecord<string>, body?: any): Promise<void | Error> {
        return new Promise(resolve => {
            this._log(this.LOG_INFO, false, `Serializing request for text`);
            const config: PathRequestConfig | undefined = this.getPathRequest(path);
            if (config && config.request && config.url) {
                const textHeaders: TRecord<string> = Object.assign({}, headers || {}, {
                    Accept: 'text/plain',
                    'Content-Type': 'text/plain'
                });

                Object.keys(textHeaders).forEach((key: string) => {
                    config.request?.headers.set(key, textHeaders[key]);
                });

                const isModifyingRequest: boolean =
                    [`${XHR_FETCH_METHODS.PATCH}`, `${XHR_FETCH_METHODS.PUT}`, `${XHR_FETCH_METHODS.POST}`].includes(
                        `${config.request.method}`
                    ) && !!body;
                if (isModifyingRequest) {
                    config.request = new Request(config.url, {
                        method: config.request.method,
                        headers: config.request.headers,
                        body: JSON.stringify(body)
                    }) as Request;
                } else {
                    throw EMPTY_BODY_ERROR;
                }

                this._log(this.LOG_DETAIL, false, `Request override to: %o`, config);
                this._setPathRequest(path, config);
                resolve();
            } else {
                throw SERIALIZE_EMPTY_REQUEST_ERROR;
            }
        });
    }

    /**
     * @override
     */
    protected async _unSerialize<T = string>(path: string): Promise<T | Error> {
        this._log(this.LOG_INFO, false, `unSerializing request for text/plain`);
        const config: PathRequestConfig | undefined = this.getPathRequest(path);
        if (config && config.response && config.response.ok) {
            return (await config.response.text()) as T;
        } else {
            throw UNSERIALIZE_EMPTY_REQUEST_ERROR;
        }
    }
}
