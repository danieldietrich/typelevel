/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

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
