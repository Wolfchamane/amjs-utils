import { dotProp } from './dot-prop';
import { describe, test, expect } from 'vitest';

describe('dotProp', () => {
    const objectRef = {
        key: { param: 'one' },
        other: { param: 'two' }
    };

    test('dotProp(objectRef, \'key.param\') should return "one"', () =>
        expect(dotProp(objectRef, 'key.param')).toEqual(objectRef.key.param));

    test("dotProp(objectRef, 'other.param', 'three') should return \"three\" and modify object", () => {
        expect(dotProp(objectRef, 'other.param', 'three')).toEqual('three');
        expect(objectRef.other.param).toEqual('three');
    });
});
