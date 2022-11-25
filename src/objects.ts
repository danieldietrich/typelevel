/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Extends, Is, IsUniversal, Or } from "./predicates";
import { UnionToIntersection } from "./utilities";

/**
 * Combines all properties of an intersection type A & B.
 *
 * Combine<{ a: number } & { b: string }> = { a: number, b: string }
 *
 * Combine distributes union types.
 *
 * @param T a union of intersections
 * @returns a union of combined types
 */
export type Combine<T> = { [K in (keyof T)]: T[K] };

/**
 * Obj represents an object literal type. Obj is syntactic sugar for
 * Record<PropertyKey, unknown>.
 *
 * TypeScript has the following built-in types to match objects:
 *
 * • Record<PropertyKey, unknown> any object literal type { ... } with an index structure
 * • Record<PropertyKey, any> like Record<PropertyKey, unknown> but also interfaces, classes, arrays and functions
 * • Object any value (primitive, non-primitive)
 * • object any non-primitive type, same as Record<PropertyKey, any> but no index structure
 * • {} empty object, any non-nullish value
 *
 * Obj does not match interfaces or classes because they are possible target
 * for declaration merging, their properties are not fully known.
 *
 * | T                  | T extends Obj = Record<PropertyKey, unknown> | T extends Record<PropertyKey, any> | T extends object  | T extends Object  | T extends {} |
 * | ------------------ | ------- | ------- | ------- | ------- | ------- |
 * | any                | boolean | boolean | boolean | boolean | boolean |
 * | unknown            | false   | false   | false   | false   | false   |
 * | never              | true    | true    | true    | true    | true    |
 * | {}                 | true    | true    | true    | true    | true    |
 * | { k: V }           | true    | true    | true    | true    | true    |
 * | interface {}       | false   | true    | true    | true    | true    |
 * | interface { k: V } | false   | true    | true    | true    | true    |
 * | class {}           | false   | true    | true    | true    | true    |
 * | class { k: V }     | false   | true    | true    | true    | true    |
 * | []                 | false   | true    | true    | true    | true    |
 * | [number]           | false   | true    | true    | true    | true    |
 * | () => void         | false   | true    | true    | true    | true    |
 * | string             | false   | false   | false   | true    | true    |
 * | number             | false   | false   | false   | true    | true    |
 * | boolean            | false   | false   | false   | true    | true    |
 * | symbol             | false   | false   | false   | true    | true    |
 * | bigint             | false   | false   | false   | true    | true    |
 * | null               | false   | false   | false   | false   | false   |
 * | undefined          | false   | false   | false   | false   | false   |
 * | void               | false   | false   | false   | false   | false   |
 *
 * See https://github.com/microsoft/TypeScript/issues/42825#issuecomment-780873604
 */
export type Obj = Record<PropertyKey, unknown>;

/**
 * Convenience type alias for keyof T, with a fix for one common mistake:
 *
 *    { [x in keyof any]: any }
 *  = { [x: string]: any }
 * != { [x: string]: any; [x: number]: any; [x: symbol]: never }
 *  = { [_ in (keyof any)]: any }
 *  = { [_ in Keys<T>]: any }
 *
 * Keys does not distribute union types.
 *
 * @param T a type
 * @returns keyof T
 */
export type Keys<T> = keyof T;

/**
 * Syntactic sugar for T[keyof T].
 *
 * Values does not distribute union types.
 *
 * @param T a type
 * @returns T[keyof T], where Values<any> = any, Values<unknown> = Values<never> = never
 */
export type Values<T> = T[keyof T];

/**
 * Deep-flattens object keys by recursively traversing the type structure and
 * concatenating all keys with dot '.'.
 *
 * { a: { b: { c: number } } } => { 'a.b.c': number }
 *
 * Paths intentionally only traverses types of shape Obj = Record<PropertyKey, unknown>.
 * Interfaces, classes and arrays are seen as leafs. Currently Paths uses
 * string literal types under the hood to concatenate keys. This is why only
 * keys in string | number are supported, symbols are ignored.
 *
 * | T                    | Paths<T> = Paths<T, true> | Paths<T, false>          |
 * | -------------------- | ------------------------- | ------------------------ |
 * | any                  | { [x: string]: any }      | { [x: string]: any }     |
 * | unknown              | never                     | never                    |
 * | never                | never                     | never                    |
 * | {}                   | {}                        | {}                       |
 * | { a: { b: 1 } }      | { 'a.b': 1 }              | { 'a.b': 1 }             |
 * | { a: 1 } \| { b: 2 } | { 'a': 1 } \| { 'b': 2 }  | { 'a': 1 } \| { 'b': 2 } |
 * | arrays               | never                     | supported                |
 * | classes              | never                     | supported                |
 * | interfaces           | never                     | supported                |
 * | functions            | never                     | supported                |
 * | other-types          | never                     | never                    |
 *
 * Paths distributes union types.
 *
 * @param T a union type
 * @param Options a PathsOptions type
 * @returns a union of flattened objects
 */
export type Paths<T, Options extends PathsOptions = { Strict: true }> =
    Or<Is<T, {}>, IsUniversal<T>> extends true
        ? T
        : T extends Record<PropertyKey, Options['Strict'] extends true ? unknown : any>
            ? Combine<UnionToIntersection<_Paths<T, Options>>>
            : never;

/**
 * Options for Paths.
 */
export type PathsOptions = {
    Strict?: boolean  // descends only into Obj types when true (default: true)
};

type _Paths<T, Options extends PathsOptions> =
    TupledPaths<T, Options> extends infer P
        ? P extends [string, unknown]
            ? { [K in `${P[0]}`]: P[1] }
            : never
        : never;

// currently symbol keys are not supported
type TupledPaths<T, Options extends PathsOptions, K = Keys<T>> =
    T extends Record<PropertyKey, Options['Strict'] extends true ? unknown : any>
        ? K extends string | number
            ? IsUniversal<T[K]> extends true
                ? [`${K}`, T[K]]
                : T[K] extends Record<string | number, unknown>
                    ? TupledPaths<T[K], Options> extends infer F
                        ? F extends [string, unknown]
                            ? [`${K}.${F[0]}`, F[1]]
                            : never
                        : never
                    : [`${K}`, T[K]]
            : never
        : never;

/**
 * Filters arrays and objects of type T by comparing their values with the given
 * union type V. A value is part of the result, if it is assignable to V.
 *
 * | T        |  V       | Filter<T, V>                 |
 * | -------- | -------- | ---------------------------- |
 * | { a: 1 } | any      | T                            |
 * | { a: 1 } | unknown  | T                            |
 * | { a: 1 } | never    | {}                           |
 * | [1]      | any      | T                            |
 * | [1]      | unknown  | T                            |
 * | [1]      | never    | []                           |
 * | A \| B   | V        | Filter<A, V> \| Filter<B, V> |
 *
 * @param T a union of arrays and objects (distributed)
 * @param V a union of types that will be compared to the values of T (non-distributed)
 * @param Options a FilterOptions type
 * @returrns a filtered version of T or never
 */
export type Filter<T, V, Options extends FilterOptions = { Cond: true }> =
    T extends any[] ? FilterArray<T, V, Options> :
        T extends Record<PropertyKey, any> ? FilterObj<T, V, Options> :
            never;

/**
 * Options for Filter.
 */
export type FilterOptions = {
    Cond?: boolean // a boolean condition which negates the filter, if false (default: true)
};

type FilterObj<T, V, Options extends FilterOptions> =
    Pick<T, {
        [K in keyof T]-?: Extends<T[K], V> extends true
            ? Options['Cond'] extends true ? K : never
            : Options['Cond'] extends true ? never : K
    }[keyof T]>;

type FilterArray<A, V, Options extends FilterOptions> =
    A extends [] ? [] :
        A extends [infer H, ...infer T]
            ? Extends<H, V> extends true
                ? Options['Cond'] extends true ? [H, ...FilterArray<T, V, Options>] : FilterArray<T, V, Options>
                : Options['Cond'] extends true ? FilterArray<T, V, Options> : [H, ...FilterArray<T, V, Options>]
            : [];
