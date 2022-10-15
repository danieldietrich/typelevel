/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

// returns true if T1 is exactly T2
export type Is<T1, T2> =
    (<T>() => T extends T2 ? true : false) extends (<T>() => T extends T1 ? true : false)
        ? true
        : false;

// returns true if T1 is a subtype of T2 (read: T1 is assignable to T2)
export type Extends<A1, A2> =
    [A1] extends [never] ? true :
        [A2] extends [never] ? false :
            [any] extends [A2] ? true :
                [unknown] extends [A2] ? true :
                    [any] extends [A1] ? false :
                        [unknown] extends [A1] ? false :
                            A1 extends A2 ? true : false;

// logical and
export type And<C1 extends boolean, C2 extends boolean> =
    C1 extends true
        ? C2 extends true
            ? true
            : false
        : false;

// logical or
export type Or<C1 extends boolean, C2 extends boolean> =
    C1 extends true
        ? true
        : C2 extends true
            ? true
            : false;

// logical not
export type Not<C extends boolean> =
    C extends true ? false : true;

// [A, B] => A & B
export type TupleToIntersection<T extends any[]> =
    UnionToIntersection<TupleToUnion<T>>;

// [A, B] => A | B
export type TupleToUnion<T extends any[]> =
    T[number];

// A | B => A & B
export type UnionToIntersection<U> =
    (U extends any ? (arg: U) => void : never) extends ((arg: infer I) => void)
        ? I
        : never;

// A | B => [A, B]
export type UnionToTuple<T, L = LastOf<T>> =
    [T] extends [never]
        ? []
        : [...UnionToTuple<Exclude<T, L>>, L];

type LastOf<T> =
    UnionToIntersection<T extends any ? () => T : never> extends () => infer R
        ? R
        : never;
