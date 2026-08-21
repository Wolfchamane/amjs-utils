/* eslint-disable @typescript-eslint/no-explicit-any */
import { Factory, type FactoryInstance } from './factory';
import { describe, test, expect } from 'vitest';

class MyClass {
    config: any;

    constructor(config: any) {
        this.config = config;
    }
}

class OtherClass {}

describe('Factory', () => {
    const registryName = 'my-class';

    const fi: FactoryInstance = Factory.i();
    test('By default, FactoryInstance is empty', () => {
        expect(fi.has(registryName)).toBeFalsy();
        expect(fi.list().length).toEqual(0);
    });

    test('Allows a class constructor registration', () => {
        fi.register(registryName, MyClass);
        expect(fi.has(registryName)).toBeTruthy();
        expect(fi.list()).toEqual([registryName]);
    });

    test('Allows to create singletons of registered class', async () => {
        const sut = await fi.create(registryName, 'value');
        expect(sut).toBeInstanceOf(MyClass);
        expect(sut.config).toEqual('value');
    });

    test('Does not overrides a registered class', async () => {
        fi.register(registryName, OtherClass);
        const sut = await fi.create(registryName);
        expect(sut).toBeInstanceOf(MyClass);
        expect(sut).not.toBeInstanceOf(OtherClass);
    });

    test('Returns undefined when creating a non-registered class', async () => {
        const sut = await fi.create('other-class');
        expect(sut).toBeUndefined();
    });

    test('Allows to remove a registered class', () => {
        expect(fi.has(registryName)).toBeTruthy();
        fi.remove(registryName);
        expect(fi.has(registryName)).toBeFalsy();
    });
});
/* eslint-enable @typescript-eslint/no-explicit-any */
