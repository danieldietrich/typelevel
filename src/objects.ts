/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Is, IsUniversal, Or } from "./predicates";
import { UnionToIntersection } from "./utilities";

/**
 * Obj represents a type with a set of properties. Obj is syntactic sugar for
 * Record<PropertyKey, unknown> (Strict = true) and
 * Record<PropertyKey, any> (Strict = false).
 *
 * By default Obj strictly represents objects and does not include classes,
 * arrays, functions and primitives. We introduce the concept of strictness
 * to allow for more flexible representations of objects. Idiomatic types
 * that act on objects have a Strict parameter that is delegated to Obj.
 *
 * Obj = Obj<true> = Record<PropertyKey, unknown> does not match interfaces or
 * classes (but the empty class A {}) because they are possible target for
 * declaration merging, their properties are not fully known.
 *
 * Obj<false> = Record<PropertyKey, any> = object matches all structures, with
 * and without inferrable index signature.
 *
 * Let EmptyClass = class A {} and NonEmptyClass = class A { a: number }.
 * Let IsObj<T, Strict extends boolean> = T extends Obj<Strict> ? true : false.
 * Then the following holds:
 *
 * |  T               | IsObj<T>       | IsObj<T, false> |
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
export type Obj<Strict extends boolean = true> =
    Record<PropertyKey, (Strict extends true ? unknown : any)>;

/**
 * Good alternative to keyof T if users want to get rid of special handling of
 * universal types any/unknown/never at the use-site.
 *
 * @param T a type
 * @returns keyof T, any/unknown/never => never
 */
export type Keys<T> =
    IsUniversal<T> extends true ? never : keyof T;

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
export type Paths<T, Strict extends boolean = true> = _Paths<T, Strict>;

// don't expose calculated parameter P as public API
type _Paths<T, Strict extends boolean, P = TupledPaths<T, Strict>> =
    Or<Is<T, {}>, Or<Is<T, any>, Or<Is<T, unknown>, Is<T, never>>>> extends true
        ? T
        : P extends [string, unknown]
            ? { [K in `${P[0]}`]: P[1] }
            : never;

// currently symbol keys are not supported
type TupledPaths<T, Strict extends boolean = true, K = Keys<T>> =
    T extends Obj<Strict>
        ? K extends string | number
            ? Or<Is<T[K], any>, Is<T[K], never>> extends true
                ? [`${K}`, T[K]]
                : T[K] extends Record<string | number, unknown>
                    ? TupledPaths<T[K]> extends infer F
                        ? F extends [string, unknown]
                            ? [`${K}.${F[0]}`, F[1]]
                            : never
                        : never
                    : [`${K}`, T[K]]
            : never
        : never;

// Default if T is undefined, otherwise T
export type Default<T, Default> = Is<T, undefined> extends true ? ([Default] extends [Default] ? true : false) : T;

// TODO(@@dd): test this for T in any | unknown | never
export type Filter<T, V, Options extends FilterOptions = {
    condition: false
}> =
    T extends any[] ? FilterArray<T, V, Default<Options['condition'], true>> :
        T extends Obj<Default<Options['strict'], true>> ? FilterObj<T, V, Default<Options['condition'], true>> :
            never;

export type FilterOptions = {
    condition?: boolean;
    relation?: 'extends' | 'super' | 'is';
    strict?: boolean;
}

type O = undefined | number;

// TODO(@@dd): test if [K in keyof T] works for T in any | unknown | never
type FilterObj<T, V, Condition extends boolean> =
    Pick<T, {
        [K in keyof T]-?: T[K] extends V
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
export type Map<T = any, R = unknown> =
    [unknown] extends [T] ? unknown : R;

// FlatMap distributes a union and flattens the result
export type FlatMap<T = any, R = unknown> =
    Flatten<Map<T, R>>;

// Flattens union types
// TODO(@@dd): compare this with other semantics, like https://catchts.com/flatten-union
export type Flatten<T extends Map> =
    Join<UnionToIntersection<T>>;

/**
 * Merges all properties of an intersection type A & B if T extends Obj<Strict>.
 * This type does not differ from the built-in type "A & B" in any way,
 * except for the Strict mode.
 *
 * A use case of Join is to flatten an intersection type of objects for display
 * purposes.
 *
 * @param T a non-empty union of intersections
 * @param Strict only objects of type Obj<Strict> are merged
 * @returns a non-empty union of objects
 */
export type Join<T, Strict extends boolean = true> =
    T extends Obj<Strict> ? { [K in Keys<T>]:  T[K] } : T;
