/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from 'typelevel-assert';
import { describe, it } from 'vitest'
import { MergeArray } from '../src/arrays';
import { Fn } from '../src/functions';
import { Is } from '../src';

describe('type MergeArray', () => {

    it('should merge empty array', () => {
        assertType<Is<MergeArray<[]>, never>>();
    });

    it('should merge array with one element', () => {
        assertType<Is<MergeArray<[{ a: () => 1 }]>, { a: () => 1 }>>();
    });

    it('should merge array with two elements', () => {
        assertType<Is<MergeArray<[{ a: () => 1 }, { b: () => true }]>, { a: () => 1, b: () => true }>>();
    });

    it('should merge array with three elements', () => {
        class A { }
        class B extends A {
            b = 1
        }
        type Input = [
            { a: () => A, b: () => boolean, c: () => number, d: () => 'a' },
            { b: () => true, d: () => string },
            { a: () => B, c: () => 1 }
        ];
        type Actual = MergeArray<Input>;
        type Expected = {
            a: () => B,
            b: () => true,
            c: () => 1,
            d: () => never
        };
        assertType<Is<Actual, Expected>>();
    });

    it('should deep merge array with three elements', () => {
        class A { }
        class B extends A {
            b = 1
        }
        type Input = [
            { a: { b: { c: () => A }, d: Fn }, e: () => number },
            { a: { d: () => void } },
            { a: { b: { c: () => B } } },
            { e: () => 1 }
        ];
        type Expected = {
            a: {
                b: {
                    c: () => B
                },
                d: () => void
            },
            e: () => 1
        };
        assertType<Is<MergeArray<Input>, Expected>>();
    });

});
