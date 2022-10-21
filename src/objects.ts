/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { IsUniversal } from "./predicates";

/** ✅
 * Combines all properties of an intersection type A & B.
 * Combine does not differ from the built-in type A & B.
 *
 * Combine distributes union types.
 *
 * @param T a union of intersections
 * @returns a union of combined types
 */
export type Combine<T> = { [K in (keyof T)]: T[K] };

/** ✅
 * Obj represents a type with a set of properties. Obj is syntactic sugar for
 * Record<PropertyKey, unknown>, while the TS build-it object has the form
 * Record<PropertyKey, any>.
 *
 * Obj does not match interfaces or classes because they are possible target
 * for declaration merging, their properties are not fully known.
 *
 * |  T                 | T extends Obj  | T extends object  |
 * | ================== | ============== | ================= |
 * | any                | boolean        | boolean           |
 * | unknown            | false          | false             |
 * | never              | true           | true              |
 * | ------------------ | -------------- | ----------------- |
 * | interface {}       | false          | true              |
 * | interface { k: V } | false          | true              |
 * | class {}           | false          | true              |
 * | class { k: V }     | false          | true              |
 * | {}                 | true           | true              |
 * | { k: V }           | true           | true              |
 * | []                 | false          | true              |
 * | [number]           | false          | true              |
 * | () => void         | false          | true              |
 * | ------------------ | -------------- | ----------------- |
 * | string             | false          | false             |
 * | number             | false          | false             |
 * | boolean            | false          | false             |
 * | symbol             | false          | false             |
 * | bigint             | false          | false             |
 * | null               | false          | false             |
 * | undefined          | false          | false             |
 * | void               | false          | false             |
 *
 * See https://github.com/microsoft/TypeScript/issues/42825#issuecomment-780873604
 */
export type Obj = Record<PropertyKey, unknown>;

/** ✅
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

/** ✅
 * Syntactic sugar for T[keyof T].
 *
 * Values does not distribute union types.
 *
 * @param T a type
 * @returns T[keyof T], where Values<any> = any, Values<unknown> = Values<never> = never
 */
export type Values<T> = T[keyof T];

/** ✅
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
 * |  T                  | Paths<T>                 |
 * | =================== | ======================== |
 * | any                 | { [x: string]: any }     |
 * | unknown             | never                    |
 * | never               | never                    |
 * | ------------------- | ------------------------ |
 * | {}                  | {}                       |
 * | { a: { b: 1 } }     | { 'a.b': 1 }             |
 * | { a: 1 } | { b: 2 } | { 'a': 1 } | { 'b': 2 }  |
 * | ------------------- | ------------------------ |
 * | <arrays>            | never                    |
 * | <classes>           | never                    |
 * | <interfaces>        | never                    |
 * | <functions>         | never                    |
 * | <other-types>       | never                    |
 *
 * Paths distributes union types.
 *
 * @param T a union type
 * @returns a union of flattened objects
 */
export type Paths<T> =
        T extends Obj
            ? { [K in `${TupledPaths<T>[0]}`]: TupledPaths<T>[1] }
            : never;

// currently symbol keys are not supported
type TupledPaths<T extends Obj, K extends string | number = Exclude<keyof T, symbol>, V = T[K]> =
            IsUniversal<V> extends true
                ? [`${K}`, V]
                : V extends Obj
                    ? [`${K}.${TupledPaths<V>[0]}`, TupledPaths<V>[1]]
                    : [`${K}`, V];

// TODO(@@dd): test this for T in any | unknown | never
// C = Condition
// See also https://www.typescriptlang.org/docs/handbook/utility-types.html#extracttype-union
export type Filter<T, V, C extends boolean = true> =
    T extends any[] ? FilterArray<T, V, C> :
        T extends Obj ? FilterObj<T, V, C> :
            never;

// TODO(@@dd): test if [K in keyof T] works for T in any | unknown | never
type FilterObj<T, V, C extends boolean> =
    Pick<T, {
        [K in keyof T]-?: T[K] extends V
            ? C extends true ? K : never
            : C extends true ? never : K
    }[keyof T]>;

type FilterArray<A, V, C extends boolean> =
    A extends [] ? [] :
        A extends [infer H, ...infer T]
            ? H extends V
                ? C extends true ? [H, ...FilterArray<T, V, C>] : FilterArray<T, V, C>
                : C extends true ? FilterArray<T, V, C> : [H, ...FilterArray<T, V, C>]
            : [];
