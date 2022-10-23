/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

/** ✅
 * Tuples to intersection
 *
 * [A, B] => A & B
 *
 * @param a tuple
 * @returns an intersection
 */
export type TupleToIntersection<T extends any[]> =
    UnionToIntersection<TupleToUnion<T>>;

/** ✅
 * Tuple to union
 *
 * [A, B] => A | B
 *
 * @param a tuple
 * @returns an union
 */
export type TupleToUnion<T extends any[]> =
    T[number];

/** ✅
 * Union to intersection
 *
 * A | B => A & B
 *
 * @param a union
 * @returns an intersection
 */
export type UnionToIntersection<U> =
    (U extends any ? (arg: U) => void : never) extends ((arg: infer I) => void)
        ? I
        : never;

/** ✅
 * Union to tuple. Use this with caution, the order of the tuple
 * elements is not predictable.
 *
 * A | B => [A, B] or [B, A]
 *
 * @param a union
 * @returns a tuple
 */
export type UnionToTuple<T> =
    [T] extends [never]
        ? []
        : [...UnionToTuple<Exclude<T, LastOf<T> >>, LastOf<T>];

type LastOf<T> =
    UnionToIntersection<T extends any ? () => T : never> extends () => infer R
        ? R
        : never;
