import { capitalize } from './capitalize';
import { describe, test, expect } from 'vitest';

describe('capitalize', () => {
    test('Transforms a valid string first character into its capital', () => {
        expect(capitalize('hello')[0]).toEqual('H');
    });
});
