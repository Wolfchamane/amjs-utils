/**
 * Defines a value as the generic source type or null.
 *
 * @param {any} T - Generic source type.
 *
 * @example
 * ```ts
 * import type { Nullable } from '@amjs/js-utils';
 *
 * type Sth = Nullable<string>; // typeof Sth = 'string | null'
 * ```
 */
export type Nullable<T> = T | null;
