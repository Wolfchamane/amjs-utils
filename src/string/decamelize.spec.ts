import { decamelize } from './decamelize';
import { describe, test, expect } from 'vitest';

describe('decamelize', () => {
    test('Transforms a camelCase text into a word-separated text', () => {
        expect(decamelize('helloWorld', '-')).toEqual('hello-World');
    });
});
