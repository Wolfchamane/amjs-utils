import { uuid } from './uuid';
import { describe, test, expect } from 'vitest';

describe('uuid', () => {
    test('Returns an string', () => expect(typeof uuid()).toEqual('string'));

    test('String has this pattern "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"', () => {
        const pattern: RegExp = /[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-4[a-zA-Z0-9]{3}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}/;
        expect(pattern.test(uuid())).toBeTruthy();
    });
});
