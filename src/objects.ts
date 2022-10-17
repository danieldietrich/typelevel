/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { UnionToIntersection } from "./utilities";

export type IsEmpty<T> = [keyof T] extends [never] ? true : false;

export type Obj = Record<PropertyKey, unknown>;

export type Paths<T, P = TupledPaths<T>> =
    P extends [string, unknown]
        ? { [K in `${P[0]}`]: P[1] }
        : never;

// currently symbol keys are not supported
type TupledPaths<T, K = keyof T> =
    T extends Obj
        ? K extends string | number
            ? T[K] extends Record<string | number, unknown>
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
export type Join<T> = T extends Obj ? { [K in keyof T]:  T[K] } : T;

export type Filter<T, V, Condition extends boolean = true> =
    T extends any[] ? FilterArray<T, V, Condition> :
        T extends Obj ? FilterObj<T, V, Condition> :
            never;

type FilterObj<T, V, Condition> = Pick<T, { [K in keyof T]-?: T[K] extends V
    ? Condition extends true ? K : never
    : Condition extends true ? never : K
}[keyof T]>;

type FilterArray<A extends any[], V, Condition extends boolean = true> =
    A extends [] ? [] :
        A extends [infer H, ...infer T]
            ? H extends V
                ? Condition extends true ? [H, ...FilterArray<T, V>] : FilterArray<T, V>
                : Condition extends true ? FilterArray<T, V> : [H, ...FilterArray<T, V>]
            : [];

// returns the property values of the first level
export type Values<T> = T[keyof T];
