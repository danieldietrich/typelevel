/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from 'typelevel-assert';
import { describe, it } from 'vitest'
import { Extends, Fn, Is, Obj } from '../src';

describe('type Extends', () => {

    const emptyObj = {};

    type EmptyObj = typeof emptyObj;

    function fn() {
        return undefined;
    }

    class A {
        a = 1;
    }

    it('should recognize the identity', () => {
        assertType<Is<Extends<any, any>, true>>();
        assertType<Is<Extends<never, never>, true>>();
        assertType<Is<Extends<unknown, unknown>, true>>();
        assertType<Is<Extends<void, void>, true>>();
        assertType<Is<Extends<undefined, undefined>, true>>();
        assertType<Is<Extends<null, null>, true>>();
        assertType<Is<Extends<boolean, boolean>, true>>();
        assertType<Is<Extends<number, number>, true>>();
        assertType<Is<Extends<string, string>, true>>();
        assertType<Is<Extends<symbol, symbol>, true>>();
        assertType<Is<Extends<any[], any[]>, true>>();
        assertType<Is<Extends<Fn, Fn>, true>>();
        assertType<Is<Extends<Obj, Obj>, true>>();
        assertType<Is<Extends<A, A>, true>>();
    });

    it('should recognize that never extends everything', () => {
        assertType<Is<Extends<never, never>, true>>();
        assertType<Is<Extends<never, any>, true>>();
        assertType<Is<Extends<never, unknown>, true>>();
        assertType<Is<Extends<never, 1>, true>>();
    });

    it('should recognize that nothing but itself extends never', () => {
        assertType<Is<Extends<never, never>, true>>();
        assertType<Is<Extends<any, never>, false>>();
        assertType<Is<Extends<unknown, never>, false>>();
        assertType<Is<Extends<1, never>, false>>();
    });

    it('should recognize that any extends nothing but itself and unknown', () => {
        assertType<Is<Extends<any, any>, true>>();
        assertType<Is<Extends<any, never>, false>>();
        assertType<Is<Extends<any, unknown>, true>>();
        assertType<Is<Extends<any, 1>, false>>();
    });

    it('should recognize that unknown extends nothing but itself and any', () => {
        assertType<Is<Extends<unknown, unknown>, true>>();
        assertType<Is<Extends<unknown, never>, false>>();
        assertType<Is<Extends<unknown, any>, true>>();
        assertType<Is<Extends<unknown, 1>, false>>();
    });

    it('should recognize that everything extends any', () => {
        assertType<Is<Extends<never, any>, true>>();
        assertType<Is<Extends<unknown, any>, true>>();
        assertType<Is<Extends<1, any>, true>>();
    });

    it('should recognize that everything extends unknown', () => {
        assertType<Is<Extends<any, unknown>, true>>();
        assertType<Is<Extends<never, unknown>, true>>();
        assertType<Is<Extends<1, unknown>, true>>();
    });

    it('should work for numbers', () => {
        assertType<Is<Extends<1, number>, true>>();
        assertType<Is<Extends<number, 1>, false>>();
    });

    it('should work for functions', () => {
        assertType<Is<Extends<() => any, Fn>, true>>();
        assertType<Is<Extends<() => void, Fn>, true>>();
        assertType<Is<Extends<(...args: any[]) => any, Fn>, true>>();
        assertType<Is<Extends<typeof fn, Fn>, true>>();

        assertType<Is<Extends<unknown, Fn>, false>>();
        assertType<Is<Extends<void, Fn>, false>>();
        assertType<Is<Extends<undefined, Fn>, false>>();
        assertType<Is<Extends<null, Fn>, false>>();
        assertType<Is<Extends<boolean, Fn>, false>>();
        assertType<Is<Extends<number, Fn>, false>>();
        assertType<Is<Extends<string, Fn>, false>>();
        assertType<Is<Extends<any[], Fn>, false>>();
        assertType<Is<Extends<Record<string, unknown>, Fn>, false>>();
        assertType<Is<Extends<A, Fn>, false>>();
    });

    it('should work for arrays', () => {
        assertType<Is<Extends<any[], any[]>, true>>();
        assertType<Is<Extends<[], []>, true>>();
        assertType<Is<Extends<any[], []>, false>>();
        assertType<Is<Extends<[], any[]>, true>>();
        assertType<Is<Extends<[], [any]>, false>>();
        assertType<Is<Extends<[any], any[]>, true>>();
        assertType<Is<Extends<[any], []>, false>>();

        assertType<Is<Extends<[1], [number]>, true>>();
        assertType<Is<Extends<[number], [1]>, false>>();
        assertType<Is<Extends<[1], [1]>, true>>();
        assertType<Is<Extends<[1], [2]>, false>>();

        assertType<Is<Extends<[1, ""], [number, string]>, true>>();
        assertType<Is<Extends<[1, ""], [number, any]>, true>>();
        assertType<Is<Extends<[1, ""], [number, never]>, false>>();
        assertType<Is<Extends<[number, string], [1, ""]>, false>>();
        assertType<Is<Extends<[number, any], [1, ""]>, false>>();
        assertType<Is<Extends<[number, never], [1, ""]>, false>>();
    });

    it('should work for objects', () => {
        assertType<Is<Extends<A, EmptyObj>, true>>();
        assertType<Is<Extends<EmptyObj, A>, false>>();

        assertType<Is<Extends<A, Record<string, any>>, true>>();
        assertType<Is<Extends<Record<string, any>, A>, false>>();

        assertType<Is<Extends<A, unknown>, true>>();
        assertType<Is<Extends<unknown, A>, false>>();

        assertType<Is<Extends<EmptyObj, { a: 1 }>, false>>();
        assertType<Is<Extends<{ a: 1 }, EmptyObj>, true>>();
        assertType<Is<Extends<{ a: 1 }, { a: number }>, true>>();
        assertType<Is<Extends<{ a: 1 }, { a: string }>, false>>();
    });

});
