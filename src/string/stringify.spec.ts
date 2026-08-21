import { stringify } from './stringify';
import { describe, test, expect } from 'vitest';

describe('stringify', () => {
    test('Throws an error if argument cannot turn into text', () => {
        expect(() => stringify(null)).toThrow();
        expect(() => stringify(undefined)).toThrow();
    });

    test('Transforms any value into its string version', () => {
        [1, 0.05, -1, true, false, {}, [], '', 'text'].forEach(value => {
            expect(stringify(value)).toEqual(typeof value === 'object' ? JSON.stringify(value) : value.toString());
        });
    });
});
