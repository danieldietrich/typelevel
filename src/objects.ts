/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Is, Or } from "./predicates";
import { UnionToIntersection } from "./utilities";

/**
 * A type with a set of properties PropertyKey of type unknown.
 * Classes, arrays, functions and primitives are not of this
 */
export type Obj = Record<PropertyKey, unknown>;

/**
 * Good alternative to keyof T if users want to get rid of special handling of T in any | never at the use-site.
 * @param T a type
 * @returns keyof T, never if any/unknown/never
 */
export type Keys<T> =
    Or<Is<T, any>, Is<T, never>> extends true ? never : keyof T;

/**
 * Syntactic sugar for T[keyof T].
 * @returns T[keyof T], [any, unknown, never] => [any, never, never]
 */
/xport type Values<T> = T[keyof T];

// deep-flattens the keys
export type Paths<T, P = TupledPaths<T>> =
    // TODO(@@dd): write `Exists<any | unknown | never | {}, T> extends true` instead
    Or<Is<T, {}>, Or<Is<T, any>, Or<Is<T, unknown>, Is<T, never>>>> extends true
        ? T
        : P extends [string, unknown]
            ? { [K in `${P[0]}`]: P[1] }
            : never;

// currently symbol keys are not supported
type TupledPaths<T, K = Keys<T>> =
    T extends Obj
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

// Map preserves union results
export type Map<T = any, R = unknown> = [unknown] extends [T] ? unknown : R;

// FlatMap distributes a union and flattens the result
export type FlatMap<T = any, R = unknown> = Flatten<Map<T, R>>;

// Flattens union types
export type Flatten<T extends Map> = Join<UnionToIntersection<T>>;

// Merges all properties of an intersection type A & B
export type Join<T> = T extends Obj ? { [K in Keys<T>]:  T[K] } : T;

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
