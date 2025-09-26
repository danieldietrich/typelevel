/******************************************************************************
 * Copyright 2025 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { UnionToTuple } from "./utilities";

/**
 * Logical and.
 *
 * @param C1 a boolean condition
 * @param C2 a boolean condition
 * @returns false, if one of C1, C2 is false, otherwise true or boolean
 */
export type And<C1 extends boolean, C2 extends boolean> =
    C1 extends true ? C2 : false;

/**
 * Logical or.
 *
 * @param C1 a boolean condition
 * @param C2 a boolean condition
 * @returns false, if both C1, C2 are false, otherwise true or boolean
 */
export type Or<C1 extends boolean, C2 extends boolean> =
    C1 extends true ? true : C2;

/**
 * Logical not.
 *
 * @param C a boolean condition
 * @returns true if C is false vice versa, boolean if C is boolean
 */
export type Not<C extends boolean> =
    C extends true ? false : true;

/**
 * returns true if T1 equals T2
 */
export type Equals<T1, T2> =
    And<Extends<T1, T2>, Extends<T2, T1>> extends true
        ? true
        : false;

/**
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

/**
 * Returns true if T1 is exactly T2. Does not distribute unions.
 *
 * See also Equals.
 *
 * @param T1 a type
 * @param T2 a type
 * @returns true, if T1 is exacly T2
 */
// returns true if T1 is exactly T2
export type Is<T1, T2> =
    (<T>() => T extends T2 ? true : false) extends (<T>() => T extends T1 ? true : false)
        ? true
        : false;

/**
 * Checks if any element in the union U is assignable to T.
 *
 * @param T a union type
 * @param U the union to check against
 * @returns true if any element of the union U is assignable to T
 */
export type IsIn<T, U> =
    Exists<T, UnionToTuple<U>>;

type Exists<T, U extends any[]> =
    U extends [infer Head, ...infer Tail]
        ? T extends Head ? true : Exists<T, Tail>
        : false;

/**
 * Checks if each element in the union U is assignable to T.
 *
 * @param T a union type
 * @param U the union to check against
 * @returns true if each element of the union U assignable to T
 */
export type IsEach<T, U> =
    AllOf<T, UnionToTuple<U>>;

type AllOf<T, U extends any[]> =
    U extends [infer Head, ...infer Tail]
        ? T extends Head ? AllOf<T, Tail> : false
        : true;

/**
 * Checks if an object is empty. Arrays, classes and functions are not supported.
 *
 * | T               | IsEmpty<T> |
 * | =============== | ========== |
 * | any             | boolean    |
 * | unknown         | never      |
 * | never           | never      |
 * | --------------- | ---------- |
 * | {}              | true       |
 * | { a: 1 }        | false      |
 * | []              | true       |
 * | [1]             | false      |
 * | () => void      | true       |
 * | class {}        | true       |
 * | class { _ = 1 } | false      |
 * | --------------- | --------- |
 * | <otherwise>     | never     |
 *
 * @param T a type
 * @returns true, if T is empty, otherwise false
 */
export type IsEmpty<T> =
    T extends object
        ? T extends []
            ? true
            : [keyof T] extends [never]
                ? true
                : false
        : never;

/**
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
