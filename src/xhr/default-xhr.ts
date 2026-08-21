import {
    type XHR,
    type XHRFetchOptions,
    type XHRConfiguration,
    type XHRDebugLevel,
    type PathRequestConfig,
    XHR_DEBUG_LEVELS,
    XHR_FETCH_METHODS
} from './types';
import { MISSING_REQUEST_CONFIG_ERROR } from './constants';
import type { TRecord } from '../types';

/**
 * Default class for any AJAX Http Requests
 */
export class DefaultXHR implements XHR {
    protected LOG_ERROR: string = 'error';
    protected LOG_WARNING: string = 'warn';
    protected LOG_INFO: string = 'log';
    protected LOG_GROUP: string = 'group';
    protected LOG_GROUP_END: string = 'groupEnd';
    protected LOG_DETAIL: string = 'info';
    protected LOG_TIME: string = 'time';
    protected LOG_TIME_END: string = 'timeEnd';

    /**
     * Level of detail for logs of this class
     * @property    debug
     * @type        XHRDebugLevel
     * @protected
     */
    protected debug: XHRDebugLevel;

    /**
     * Flags if request to bound hostname should be secure (https) or not.
     * @property    secure
     * @type        boolean
     * @protected
     */
    protected secure: boolean;

    /**
     * To be requested
     * @property    hostname
     * @type        string
     * @protected
     */
    protected hostname: string;

    /**
     * To be fetched
     * @property    port
     * @type        {string|undefined}
     * @protected
     */
    protected port: undefined | string;

    /**
     * Map a request configuration to a path
     * @private
     */
    protected _pathRequestMap: Map<string, PathRequestConfig>;

    /**
     * @param {XHRConfiguration} config  Class configuration
     */
    constructor(config: XHRConfiguration) {
        const { hostname, port, debug, secure } = config;
        this.hostname = hostname;
        this.port = port;
        this.debug = debug || XHR_DEBUG_LEVELS.QUIET;
        this.secure = secure || false;
        this._pathRequestMap = new Map();
    }

    /**
     * Returns whether log level meets class debug level or not
     * @param   {string}    level   Specific log level for a single message
     * @private
     * @return  {Boolean}   `true` if {level} meets class debug level
     */
    private _isTraceableLevel(level: string): boolean {
        const logLevelsToNumber: Record<string, number> = {
            [this.LOG_ERROR]: 0,
            [this.LOG_WARNING]: 1,
            [this.LOG_INFO]: 2,
            [this.LOG_GROUP]: 2,
            [this.LOG_GROUP_END]: 2,
            [this.LOG_DETAIL]: 3,
            [this.LOG_TIME]: 3,
            [this.LOG_TIME_END]: 3
        };

        const xhrDebugLevelToNumber: Record<string, number> = {
            [XHR_DEBUG_LEVELS.ERROR]: 0,
            [XHR_DEBUG_LEVELS.WARNING]: 1,
            [XHR_DEBUG_LEVELS.LOG]: 2,
            [XHR_DEBUG_LEVELS.DETAILS]: 3
        };

        return logLevelsToNumber[level] <= xhrDebugLevelToNumber[this.debug];
    }

    /**
     * Obtains the request configuration for a specific client path
     * @param {string}  path Which configuration will be obtained
     * @return {PathRequestConfig|undefined}
     * @protected
     */
    getPathRequest(path: string): PathRequestConfig | undefined {
        return this._pathRequestMap.get(path);
    }

    /**
     * Adds or updates a request configuration of a specific path of the client
     * @param {string}  path To register o update
     * @param {Partial<PathRequestConfig>}  config  Request configuration
     * @protected
     */
    protected _setPathRequest(path: string, config: Partial<PathRequestConfig>): void {
        this._pathRequestMap.set(path, config);
    }

    /**
     * Performs a `console.log`
     * @see   https://developer.mozilla.org/en/docs/Web/API/console
     * @param {string}              level   Specific level of a single log message
     * @param {undefined|boolean}   force   Whether log must be forced or not
     * @param {undefined|string}    message To be logged
     * @param {unknown[]}           args    Rest of arguments
     * @protected
     */
    protected _log(level: string, force?: boolean, message?: string, ...args: unknown[]) {
        if (force || (this.debug !== XHR_DEBUG_LEVELS.QUIET && this._isTraceableLevel(level))) {
            const log: string | undefined = [this.LOG_TIME, this.LOG_TIME_END].includes(level)
                ? message
                : `[${new Date().toISOString()}][${level}] ${message}`;
            // @ts-expect-error console method
            console[level](log, ...args);
        }
    }

    /**
     * Serializes a request.
     * @notice Must be override by adapter classes
     * @param   {string}                              _path    Of the request
     * @param   {undefined|Record<string, string>}    _headers Set of request headers
     * @param   {undefined|unknown}                   _body    To be sent as part of the request
     * @return  {Promise<void|Error>}                 An `Error` if request cannot be serialized.
     * @protected
     */
    protected _serialize(_path: string, _headers?: Record<string, string>, _body?: unknown): Promise<void | Error> {
        this._log(this.LOG_WARNING, true, '_serialize method must be override!');

        return Promise.resolve();
    }

    /**
     * des-Serializes a request.
     * @notice Must be override by adapter classes
     * @protected
     * @param   {string}                    _path Of the request
     * @return  {Promise<unknown|Error>}    Returns the expected type associated with the fetch or an Error
     */
    protected _unSerialize<T = unknown>(_path: string): Promise<T | Error> {
        this._log(this.LOG_WARNING, true, '_unSerialize method must be override!');

        return Promise.resolve({} as T);
    }

    /**
     * Builds request {AbortController}
     * @private
     */
    private _buildController(): AbortController {
        return new AbortController();
    }

    /**
     * Builds base URL to be fetched
     * @param   {string}            path    To be fetched
     * @return  {string}            Based URL formed with {protocol}://{hostname}{:port?}
     * @private
     */
    private _buildBaseURL(path: string): string {
        this._log(this.LOG_INFO, false, 'Building base URL');
        const protocol: string = this.secure ? 'https' : 'http';
        this._log(this.LOG_DETAIL, false, `Using ${protocol} protocol`);
        let url: string = [protocol, [this.hostname, this.port].filter(Boolean).join(':')].join('://');

        if (path.startsWith('/')) {
            path = path.substring(1);
        }

        url = [url, path].join('/');

        this._log(this.LOG_DETAIL, false, `Base URL is "${url}"`);
        return url;
    }

    /**
     * Replaces parameters in URL path.
     * URL in-path parameters can be wrapped using brackets, i.e: `/path/{param}`.
     * Or they can be prefixed using semicolons, i.e.: `/path/:param`.
     *
     * @param   {string}                url     To evaluate
     * @param   {Record<string, any>}   params  To replace at URL.
     * @throws  {Error}                 If a parameter is not found within {params} record
     * @return  {string}                URL with all parameters in path replaced
     * @private
     */
    private _replacePathQueryParams(url: string, params: TRecord<string>): string {
        this._log(this.LOG_INFO, false, 'Replacing path query params');
        const paramInPathPattern: RegExp = /(([:{])[a-zA-Z-]+}?)/g;
        if (paramInPathPattern.test(url)) {
            url = url.replace(paramInPathPattern, (match: string): string => {
                const key: string = match.replace(/\W/g, '');
                const value: string = params[key];

                if (value) {
                    delete params[key];
                    this._log(this.LOG_DETAIL, false, `Replacing URL in-path parameter "${key}" with "${value}"`);
                } else {
                    throw new Error(`Value for ${key} path param not found!`);
                }

                return value;
            });
        }

        return url;
    }

    /**
     * Adds additional query parameters to URL
     * @param   {string}                url     To be edited
     * @param   {Record<string, any>}   params  Remaining parameters to use as query parameters
     * @return  {string}                URL with query parameters
     * @private
     */
    private _addQueryParams(url: string, params: TRecord<string>): string {
        this._log(this.LOG_INFO, false, 'Adding additional query params');

        return [url, new URLSearchParams(params).toString()].join('?');
    }

    /**
     * Builds request URL to be fetched
     * @param   {string}                        path    To be fetched
     * @param   {undefined|Record<string, any>} params  To replace or add to end URL
     * @private
     */
    private _buildRequestURL(path: string, params?: TRecord): URL {
        this._log(this.LOG_INFO, false, 'Building request URL');
        let url: string | URL = this._buildBaseURL(path);

        if (params) {
            const paramsCopy = JSON.parse(JSON.stringify(params ?? {}));
            url = this._replacePathQueryParams(url, paramsCopy);
            url = this._addQueryParams(url, paramsCopy);
        }

        url = new URL(url);
        this._log(this.LOG_DETAIL, false, `URL set to: %o`, url);

        return url;
    }

    /**
     * Builds the {Request} object to be used
     * @param   {string}            path    To be fetched
     * @param   {XHRFetchOptions}   To built the request
     */
    buildRequest(path: string, { params, method }: XHRFetchOptions): void {
        this._log(this.LOG_INFO, false, 'Building request info object');
        const controller: AbortController = this._buildController();
        const url: URL = this._buildRequestURL(path, params);
        const request = new Request(url, {
            method: method || XHR_FETCH_METHODS.GET,
            signal: controller.signal
        }) as Request;

        this._setPathRequest(path, {
            controller,
            url,
            request
        });

        this._log(this.LOG_DETAIL, false, `Request info object set to: %o`, request);
    }

    /**
     * Performs an AJAX Http Request
     * @param   {string}          path    To be fetched
     * @param   {XHRFetchOptions} options Configures a single AJAX request
     */
    async fetch<TResponse = unknown, TBody = unknown>(
        path: string,
        options?: XHRFetchOptions<TBody>
    ): Promise<TResponse | Error> {
        let result: TResponse | Error;
        try {
            const { params, method, headers, body } = options || {};
            this._log(this.LOG_GROUP, false, `Request to "${path}"`);
            this.buildRequest(path, { params, method });
            await this._serialize(path, headers, body);
            this._log(this.LOG_DETAIL, false, 'Request start!');
            this._log(this.LOG_TIME, false, 'Duration');
            const config: PathRequestConfig | undefined = this.getPathRequest(path);
            if (config) {
                const response = await fetch(config.request as Request);
                this._setPathRequest(path, { ...config, response });
                this._log(this.LOG_TIME_END, false, 'Duration');
                this._log(this.LOG_DETAIL, false, 'Request end!');
                result = await this._unSerialize<TResponse>(path);
            } else {
                throw MISSING_REQUEST_CONFIG_ERROR;
            }
        } catch (e: unknown) {
            this._log(this.LOG_ERROR, false, (e as Error).message);
            result = e as Error;
        } finally {
            // @ts-expect-error use result
            this._log(this.LOG_DETAIL, false, `Result: %o`, result);
            this._log(this.LOG_GROUP_END);
        }

        return result;
    }

    /**
     * Aborts current request
     * @param {string}              path request to be aborted
     * @param {undefined|string}    reason To abort request
     */
    abort(path: string, reason?: string) {
        const config: PathRequestConfig | undefined = this.getPathRequest(path);
        if (config && config.controller) {
            this._log(this.LOG_INFO, false, `Aborting request to ${config.url?.href}`);
            config.controller.abort(reason);
        }
    }

    /**
     * Resets instance to its default status
     */
    reset(): void {
        this._pathRequestMap = new Map();
    }
}
