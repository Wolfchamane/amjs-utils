/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Nil } from '../types';

/**
 * Returns the string representation of the {value}.
 *
 * @example
 * ```ts
 * import { stringify } from '@amjs/js-utils';
 * console.log(stringify({ key: 'value' })); // '{"key":"value"}'
 * ```
 *
 * @throws  Error       If values equals 'null' or 'undefined'
 * @param   {any}       value To transform
 * @return  {String}    String representation of {value}
 */
export function stringify(value: Nil<any>): string {
    if (value === null || value === undefined) {
        throw new Error('@amjs/utils > stringify > cannot convert to string null or undefined value');
    } else if (typeof value === 'object') {
        value = JSON.stringify(value);
    } else {
        value = value.toString();
    }

    return value;
}
/* eslint-enable @typescript-eslint/no-explicit-any */
