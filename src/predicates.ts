/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { UnionToTuple } from "./utilities";

/** ✅
 * Logical and.
 *
 * @param C1 a boolean condition
 * @param C2 a boolean condition
 * @returns false, if one of C1, C2 is false, otherwise true or boolean
 */
export type And<C1 extends boolean, C2 extends boolean> =
    C1 extends true ? C2 : false;

/** ✅
 * Logical or.
 *
 * @param C1 a boolean condition
 * @param C2 a boolean condition
 * @returns false, if both C1, C2 are false, otherwise true or boolean
 */
export type Or<C1 extends boolean, C2 extends boolean> =
    C1 extends true ? true : C2;

/** ✅
 * Logical not.
 *
 * @param C a boolean condition
 * @returns true if C is false vice versa, boolean if C is boolean
 */
export type Not<C extends boolean> =
    C extends true ? false : true;

// returns true if T1 equals T2
export type Equals<T1, T2> =
    And<Extends<T1, T2>, Extends<T2, T1>> extends true
        ? true
        : false;

/** ✅
 * Syntactic sugar for A1 extends A2 ? true : false.
 *
 * Extends does not distribute union types, i.e. Extends<A, never> = true.
 * Note: the result would be never, if Extends distributed the second
 * argument never.
 *
 * @param T1 a type
 * @param T2 another type
 * @return true if T1 extends T2, false otherwise
 */
export type Extends<T1, T2> =
    [T1] extends [T2] ? true : false;

// returns true if T1 is exactly T2
export type Is<T1, T2> =
    (<T>() => T extends T2 ? true : false) extends (<T>() => T extends T1 ? true : false)
        ? true
        : false;

/** TODO(@@dd): remove Strict
 * Checks if (all properties of) T exists in _any_ element of the union
 * U = U_1 | ... | U_n, for n >= 0.
 * If Strict = true, then Is<U_k, T> is used for comparison, by default
 * Extends<U_k, T> is used, for k = 1, ..., n.
 *
 * T extends U_1 | U_2 is defined to be true if T extends U_1 or T extends U_2.
 * IsIn<T, U_1 | U_2> differs to T extends U_1 | U_2 in the following way:
 *
 * • Is<U_1, T> or Is<U_2, T> if Strict = true
 * • Extends<U_1, T> or Extends<U_2, T> if Strict = false
 *
 * Example use cases:
 *
 * • IsIn<T, U_1 | U_2 | U_3> is equivalent to
 *   Or<Extends<U_1, T>, Or<Extends<U_2, T>, Extends<U_3, T>>>
 * • IsIn<T, U_1 | U_2 | U_3, true> is equivalent to
 *   Or<Is<U_1, T>, Or<Is<U_2, T>, Is<U_3, T>>>
 * • Does not work for universal types, e.g.
 *   IsIn<T, any | unknown | never, true> fails and
 *   IsIn<any | unknown | never, T, true> fails.
 *   See IsUniveral<T> for a predicate that checks for universal types.
 *
 * @param T a non-empty union type
 * @param U the union to check against
 * @returns true if any element of the union U contains T
 */
export type IsIn<T, U, Strict extends boolean = false> =
    Exists<T, UnionToTuple<U>, Strict>;

type Exists<T, U extends any[], Strict extends boolean> =
    U extends [infer Head, ...infer Tail]
        ? Strict extends true ? Is<Head, T> : Extends<Head, T> extends true ? true : Exists<T, Tail, Strict>
        : false;

/** TODO(@@dd): remove Strict
 * Checks if (all properties of) T exists in _all_ elements of the union
 * U = U_1 | ... | U_n, for n >= 0.
 * If Strict = true, then Is<U_k, T> is used for comparison, by default
 * Extends<U_k, T> is used, for k = 1, ..., n.
 *
 * IsEeach<T, U_1 | U_2> checks:
 *
 * • Is<U_1, T> and Is<U_2, T> if Strict = true
 * • Extends<U_1, T> and Extends<U_2, T> if Strict = false
 *
 * Example use cases:
 *
 * • IsIn<T, U_1 | U_2 | U_3> is equivalent to
 *   And<Extends<U_1, T>, And<Extends<U_2, T>, Extends<U_3, T>>>
 * • IsIn<T, U_1 | U_2 | U_3, true> is equivalent to
 *   And<Is<U_1, T>, And<Is<U_2, T>, Is<U_3, T>>>
 *
 * @param T a non-empty union type
 * @param U the union to check against
 * @returns true if all elements of the union U contain T
 */
export type IsEach<T, U, Strict extends boolean = false> =
    AllOf<T, UnionToTuple<U>, Strict>;

type AllOf<T, U extends any[], Strict extends boolean> =
    U extends [infer Head, ...infer Tail]
        ? Strict extends true ? Is<Head, T> : Extends<Head, T> extends true ? AllOf<T, Tail, Strict> : false
        : true;

// TODO(@@dd): remove special handling of any | unknown | never
export type IsEmpty<T> =
    Is<T, any> extends true ? boolean :
        Is<T, unknown> extends true ? unknown :
            Is<T, never> extends true ? never :
                Is<T, []> extends true ? true :
                    Is<(/* copy of objects/Keys */IsUniversal<T> extends true ? never : keyof T), never>;

/** ✅
 * Checks if a given type is in any | unknown | never.
 *
 * IsUniversal does not distribute union types.
 *
 * @param T a type
 * @return true, if T is in any | unknown | never, false otherwise.
 */
export type IsUniversal<T> =
    [unknown] extends [T]
        ? true // covers any and unknown
        : [T] extends [never]
            ? true
            : false;
