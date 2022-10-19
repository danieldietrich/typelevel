/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Is, Or } from "./predicates";
import { UnionToIntersection } from "./utilities";

/**
 * Syntactic sugar for Record<PropertyKey, unknown> and Record<PropertyKey, any>,
 * which represent a type with a set of properties.
 *
 * By default Obj strictly represents objects, i.e. it does not include classes,
 * arrays, functions and primitives.
 *
 * Obj = Obj<true> = Record<PropertyKey, unknown> does not match interfaces or
 * classes (but the empty class A {}) because they are possible target for
 * declaration merging, their properties are not fully known.
 *
 * Obj<false> = Record<PropertyKey, any> matches all structures (with and without
 * inferrable index signature). Caution: class and array types are matched by
 * Obj<false> but also primitive types!
 *
 * Let EmptyClass = class A {} and NonEmptyClass = class A { a: number }.
 * Let IsObj<T, Strict extends boolean> = T extends Obj<Strict> ? true : false.
 *
 * |  T               | IsObj<T, true> | IsObj<T, false> |
 * | ---------------- | -------------- | --------------- |
 * | any              | boolean        | boolean         |
 * | unknown          | false          | false           |
 * | never            | never¹⁾        | never¹⁾         |
 * | class A {}       | true           | true            |
 * | class A { k: V } | false          | true            |
 * | {}               | true           | true            |
 * | { k: V }         | true           | true            |
 * | []               | false          | true            |
 * | [number]         | false          | true            |
 * | () => void       | false          | true            |
 * | string           | false          | false           |
 * | number           | false          | false           |
 * | boolean          | false          | false           |
 * | symbol           | false          | false           |
 * | bigint           | false          | false           |
 * | null             | false          | false           |
 * | undefined        | false          | false           |
 * | void             | false          | false           |
 *
 * 1) never is the empty union and distributes over IsObj<T, Strict>.
 *    (never extends Obj ? true : false) is true.
 *
 * See https://github.com/microsoft/TypeScript/issues/42825#issuecomment-780873604
 */
export type Obj<Strict extends boolean = true> = Record<PropertyKey, (Strict extends true ? unknown : any)>;

/**
 * Good alternative to keyof T if users want to get rid of special handling of
 * universal types any/unknown/never at the use-site.
 *
 * @param T a type
 * @returns keyof T, any/unknown/never => never
 */
export type Keys<T> =
    Or<Is<T, any>, Is<T, never>> extends true ? never : keyof T;

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
export type Paths<T, Strict extends boolean = true, _P = TupledPaths<T, Strict>> =
    // TODO(@@dd): write `Exists<any | unknown | never | {}, T> extends true` instead
    Or<Is<T, {}>, Or<Is<T, any>, Or<Is<T, unknown>, Is<T, never>>>> extends true
        ? T
        : _P extends [string, unknown]
            ? { [K in `${_P[0]}`]: _P[1] }
            : never;

// currently symbol keys are not supported
type TupledPaths<T, Strict extends boolean = true, _K = Keys<T>> =
    T extends Obj<Strict>
        ? _K extends string | number
            ? Or<Is<T[_K], any>, Is<T[_K], never>> extends true
                ? [`${_K}`, T[_K]]
                : T[_K] extends Record<string | number, unknown>
                    ? TupledPaths<T[_K]> extends infer F
                        ? F extends [string, unknown]
                            ? [`${_K}.${F[0]}`, F[1]]
                            : never
                        : never
                    : [`${_K}`, T[_K]]
            : never
        : never;

// TODO(@@dd): test this for T in any | unknown | never
export type Filter<T, V, Condition extends boolean = true> =
    T extends any[] ? FilterArray<T, V, Condition> :
        T extends Obj ? FilterObj<T, V, Condition> :
            never;

// TODO(@@dd): test if [K in keyof T] works for T in any | unknown | never
type FilterObj<T, V, Condition extends boolean> = Pick<T, { [K in keyof T]-?: T[K] extends V
    ? Condition extends true ? K : never
    : Condition extends true ? never : K
}[Keys<T>]>;

type FilterArray<A extends any[], V, Condition extends boolean> =
    A extends [] ? [] :
        A extends [infer H, ...infer T]
            ? H extends V
                ? Condition extends true ? [H, ...FilterArray<T, V, Condition>] : FilterArray<T, V, Condition>
                : Condition extends true ? FilterArray<T, V, Condition> : [H, ...FilterArray<T, V, Condition>]
            : [];

// Map preserves union results
// TODO(@@dd): Map<T = any, R = unknown> = [unknown] extends [T] ? unknown : R;
export type Map<T = any, R = unknown> = [unknown] extends [T] ? unknown : R;

// FlatMap distributes a union and flattens the result
export type FlatMap<T = any, R = unknown> = Flatten<Map<T, R>>;

// Flattens union types
// TODO(@@dd): compare this with other semantics, like https://catchts.com/flatten-union
export type Flatten<T extends Map> = Join<UnionToIntersection<T>>;

// Merges all properties of an intersection type A & B
export type Join<T> = T extends Obj ? { [K in Keys<T>]:  T[K] } : T;
