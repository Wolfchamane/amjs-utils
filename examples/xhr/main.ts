/**
 * This file contains some snippets showing different examples on how to use any available
 * XHR adapter classes from '@amjs/js-utils'.
 *
 * @NOTICE: Read descriptions of each block paying attention!
 * @NOTICE: For the following examples I will `JSONAdapter` as `Adapter`
 */

import { type XHR, XHR_FETCH_METHODS, XHR_DEBUG_LEVELS, JSONAdapter as Adapter } from '../../src/xhr'; // your code will be "from '@amjs/js-utils';"

const hostname: string = 'localhost';

/**
 * 1. Default 'GET' Ajax HTTP Request
 */
(async () => {
    const instance: XHR = new Adapter({ hostname });
    await instance.fetch('/path');
    const config = instance.getPathRequest('/path');
    console.log('[%s] %s', config?.request?.method, config?.url); // [GET] http://localhost/path
})();

/**
 * 2. Replace in path-params.
 * In path-params must be wrapped, i.e. `/path/{param1}/sub-path/{param2}`
 * Or can be prefixed with a semicolon, i.e: `/path/:param1/sub-path/:param2
 */
(async () => {
    const instance: XHR = new Adapter({ hostname });
    await instance.fetch('/path/{param}', { params: { param: 'value' } });
    const config = instance.getPathRequest('/path');
    console.log('[%s] %s', config?.request?.method, config?.url); // [GET] http://localhost/path/value
})();

/**
 * 3. Add additional query params.
 * All params that are not replaced in path will be added as additional query params.
 */
(async () => {
    const instance: XHR = new Adapter({ hostname });
    await instance.fetch('/path', { params: { param: 'value' } });
    const config = instance.getPathRequest('/path');
    console.log('[%s] %s', config?.request?.method, config?.url); // [GET] http://localhost/path?param=value
})();

/**
 * 4. Make a 'POST', 'PUT' or 'PATCH' request.
 * See documentation to obtain info about other methods to use.
 * 'POST', 'PUT' and 'PATH' request will mandatory require to send a {body}.
 */
(async () => {
    const instance: XHR = new Adapter({ hostname });
    await instance.fetch('/path', {
        method: XHR_FETCH_METHODS.POST, // Define the method to use
        body: { key: 'value' } // Include the body to be sent
    });
    const config = instance.getPathRequest('/path');
    console.log('[%s] %s %o', config?.request?.method, config?.url, config?.request?.body);
    // [POST] http://localhost/path { key: 'value' }
})();

/**
 * 5. Specify a hostname port
 */
(async () => {
    const port: string = '3000';
    const instance: XHR = new Adapter({ hostname, port });
    await instance.fetch('/path');
    const config = instance.getPathRequest('/path');
    console.log('[%s] %s', config?.request?.method, config?.url); // [GET] http://localhost:3000/path
})();

/**
 * 6. Specify different debug level traces
 * Logs will be generated at console.
 * Default log level is `QUIET`, for development I do suggest to use `DETAILS`,
 * for pre-production or QA environments `ERROR` and `QUIET` for production ones.
 */
(async () => {
    const debug = XHR_DEBUG_LEVELS.DETAILS;
    const instance: XHR = new Adapter({ hostname, debug });
    await instance.fetch('/path');
    const config = instance.getPathRequest('/path');
    console.log('[%s] %s', config?.request?.method, config?.url); // [GET] http://localhost/path
})();

/**
 * 7. Abort an ongoing request
 */
(async () => {
    const instance: XHR = new Adapter({ hostname });
    instance.fetch('/path');
    instance.abort('/path');
})();

/**
 * 8. Secure protocol.
 * I will suggest to enable secure request for any environment different to development or local.
 */
(async () => {
    const instance: XHR = new Adapter({ hostname, secure: true });
    await instance.fetch('/path');
    const config = instance.getPathRequest('/path');
    console.log('[%s] %s', config?.request?.method, config?.url); // [GET] https://localhost/path
})();

/**
 * 9. Define a custom adapter.
 *
 * You can define your own adapter extending one of available adapters in the library.
 * Use custom adapters to modify request (_serialize) before they are launched
 * and evaluate responses (_unSerialize) in closed environments or for specific APIs.
 *
 * For example, let say your API requires a specific 'X-USER-ID' header, or that
 * returns an error object description in the response when it fails even if the request was OK.
 * Or that you need to log the request into a third-party endpoint.
 */
(async () => {
    class MyAdapter extends Adapter {
        protected _serialize(path: string, headers?: Record<string, string>, body?: unknown): Promise<void | Error> {
            // Do here whatever your adapter needs to do BEFORE performing the request
            return super._serialize(path, headers, body);
        }

        protected async _unSerialize<TResponse = unknown>(path: string): Promise<TResponse> {
            // Do here whatever your adapter needs to do AFTER performing the request
            return super._unSerialize<TResponse>(path);
        }
    }

    const instance: XHR = new MyAdapter({ hostname });
    await instance.fetch('/path');
})();
