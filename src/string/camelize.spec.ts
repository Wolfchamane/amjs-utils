import { camelize } from './camelize';
import { describe, test, expect } from 'vitest';

describe('camelize', () => {
    test('Converts an string into its camel-case version', () => {
        expect(camelize('hello world')).toEqual('helloWorld');
    });
});
