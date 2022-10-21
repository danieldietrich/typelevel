/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Is, IsUniversal, Or } from "./predicates";

/**
 * Combines all properties of an intersection type T = A & B if T extends Obj.
 * This type does not differ from the built-in type "A & B" in any way.
 *
 * A use case of Combine is to flatten an intersection type of objects for
 * display purposes.
 *
 * @param T a non-empty union of intersections
 * @returns a non-empty union of objects
 */
export type Combine<T> = { [K in (keyof T)]: T[K] };

/**
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

/**
 * Convenience type alias for keyof T, with a fix for one common mistake:
 *
 *    { [x in keyof any]: any }
 *  = { [x: string]: any }
 * != { [x: string]: any; [x: number]: any; [x: symbol]: never }
 *  = { [_ in (keyof any)]: any }
 *  = { [_ in Keys<T>]: any }
 *
 * @param T a type
 * @returns keyof T
 */
export type Keys<T> = keyof T;

/**
 * Syntactic sugar for T[keyof T].
 *
 * @param T a type
 * @returns T[keyof T], any/unknown/never => any/never/never
 */
export type Values<T> = T[keyof T];

/**
 * Deep-flattens object keys by recursively traversing the object structure
 * and concatenating all keys with '.'.
 *
 * { a: { b: { c: number } } } => { 'a.b.c': number }
 *
 * Paths intentionally only traverses objects defined by the type Obj.
 * Interfaces, classes and arrays are not traversed.
 *
 * @param T a type
 * @returns a flattened object. any/unknown/never => any/unknown/never
 */
export type Paths<T> = _Paths<T>;

// don't expose calculated parameter P as public API
type _Paths<T, P = TupledPaths<T>> =
    Or<Is<T, {}>, IsUniversal<T>> extends true
        ? T
        : P extends [string, unknown]
            ? { [K in `${P[0]}`]: P[1] }
            : never;

// currently symbol keys are not supported
type TupledPaths<T, K = keyof T> =
    T extends Obj
        ? K extends string | number
            ? IsUniversal<T[K]> extends true
                ? [`${K}`, T[K]]
                : T[K] extends Obj
                    ? TupledPaths<T[K]> extends infer F
                        ? F extends [string, unknown]
                            ? [`${K}.${F[0]}`, F[1]]
                            : never
                        : never
                    : [`${K}`, T[K]]
            : never
        : never;

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
