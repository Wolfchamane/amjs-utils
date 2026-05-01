import type { Nullable } from './nullable';

/**
 * Defines a value as either the generic source type, null or undefined.
 *
 * @param {any} T - Generic source type.
 *
 * @example
 * ```ts
 * import type { Nil } from '@amjs/js-utils';
 *
 * type Sth = Nil<string>; // typeof Sth = 'string | null | undefined'
 * ```
 */
export type Nil<T> = Nullable<T> | undefined;
