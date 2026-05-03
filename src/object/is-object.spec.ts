import { isObject } from './is-object';
import { describe, test, expect } from 'vitest';

describe('isObject', () => {
    [
        { value: null, expected: false },
        { value: undefined, expected: false },
        { value: 1, expected: false },
        { value: -0, expected: false },
        { value: true, expected: false },
        { value: false, expected: false },
        { value: [], expected: false },
        { value: '', expected: false },
        { value: 'text', expected: false },
        { value: {}, expected: true }
    ].forEach(({ value, expected }) => {
        test(`For "${JSON.stringify(value)}" returns "${expected}"`, () => expect(isObject(value)).toEqual(expected));
    });
});
