/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { UnionToIntersection } from "./utilities";

export type Obj = Record<PropertyKey, unknown>;

export type IsEmpty<T> =
    [T] extends [[]] ? true :
        [Keys<T>] extends [never] ? true : false;

// returns a union of keys of T.
// good alternative to keyof T if users want to get rid of special handling of T in any | never at the use-site.
export type Keys<T> =
    Or<Is<T, any>, Is<T, never>> extends true ? never : keyof T;

// returns the property values of the first level
export type Values<T> = T[keyof T];

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

// predicates

// returns true if T1 is exactly T2
export type Is<T1, T2> =
    (<T>() => T extends T2 ? true : false) extends (<T>() => T extends T1 ? true : false)
        ? true
        : false;

export type Extends<A1, A2> =
    Is<A1, never> extends true ? true :
        Is<A2, never> extends true ? false :
            Is<A2, any> extends true ? true :
                Is<A2, unknown> extends true ? true :
                    Is<A1, any> extends true ? false :
                        Is<A1, unknown> extends true ? false :
                            A1 extends A2 ? true : false;

// logical and
export type And<C1 extends boolean, C2 extends boolean> =
    C1 extends true
        ? C2 extends true
            ? true
            : false
        : false;

// logical or
export type Or<C1 extends boolean, C2 extends boolean> =
    C1 extends true
        ? true
        : C2 extends true
            ? true
            : false;

// logical not
export type Not<C extends boolean> =
    C extends true ? false : true;
