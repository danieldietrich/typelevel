/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Fn } from "./functions";
import { Is, Or, UnionToIntersection } from "./utilities";

export type IsEmpty<T> = [keyof T] extends [never] ? true : false;

export type Obj = Record<PropertyKey, unknown>;

export type Paths<T, P = TupledPaths<T>> =
    IsEmpty<T> extends true ? {} :
        Flatten<UnionToIntersection<P extends [string, unknown]
            ? { [K in `${P[0]}`]: P[1] }
            : never
        >>;

// currently symbol keys are not supported
type TupledPaths<T, K = keyof T> =
    T extends Obj
        ? K extends string | number
            ? Is<T[K], never> extends true
                ? [`${K}`, never]
                : Is<T[K], {}> extends true
                    ? [`${K}`, {}]
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
export type Flatten<T extends Map> = Union<UnionToIntersection<T>>;

// Merges all properties of an intersection type A & B
export type Union<T> = T extends Obj ? { [K in keyof T]:  T[K] } : T;

export type Filter<T, V> =
    T extends any[] ? FilterArray<T, V> :
        T extends Obj ? FilterObj<T, V> :
            never;

export type FilterNot<T, V> =
    T extends any[] ? FilterNotArray<T, V> :
        T extends Obj ? FilterNotObj<T, V> :
            never;

type FilterObj<T, V> = Pick<T, { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T]>;

type FilterNotObj<T, V> = Pick<T, { [K in keyof T]-?: T[K] extends V ? never : K }[keyof T]>;

type FilterArray<A extends any[], V> =
    A extends [] ? [] :
        A extends [infer H, ...infer T]
            ? H extends V
                ? [H, ...FilterArray<T, V>]
                : FilterArray<T, V>
            : [];

type FilterNotArray<A extends any[], V> =
    A extends [] ? [] :
        A extends [infer H, ...infer T]
            ? H extends V
                ? FilterNotArray<T, V>
                : [H, ...FilterNotArray<T, V>]
            : [];

export type Merge<S, T> =
    Is<S, T> extends true ? S : // identity
        Is<T, void> extends true ? S : // if target expects nothing it is ok to provide something
            Or<Is<S, never>, Is<T, never>> extends true ? never :
                Is<S, unknown> extends true ? unknown : Is<T, unknown> extends true ? S :
                    Is<S, any> extends true ? any : Is<T, any> extends true ? S :
                        S extends any[] ? (T extends any[] ? MergeArrays<S, T> : (S extends T ? S : never)) :
                            S extends Fn ? (T extends Fn ? MergeFunctions<S, T> : (S extends T ? S : never)) :
                                S extends Obj ? (T extends Obj ? MergeObjects<S, T> : (S extends T ? S : never)) :
                                    S extends T ? S : never;

// Consumers of T expect a certain abount of elements.
// It is required that S has at less or equal elements as T.
// It is sufficient, if elements of S extend elements of T.
type MergeArrays<S extends any[], T extends any[]> =
    S extends [infer HeadS, ...infer TailS]
        ? T extends [infer HeadT, ...infer TailT]
            ? [Merge<HeadS, HeadT>, ...MergeArrays<TailS, TailT>]
            : [never] // T = [], users which expect T don't provide more elements required by S
        : []; // S = [], S ignores additions elements required by users of T

type MergeFunctions<S extends Fn, T extends Fn> =
    S extends (...args: infer ArgsS) => infer ResS
        ? T extends (...args: infer ArgsT) => infer ResT
            ? Merge<ArgsS, ArgsT> extends infer A
                ? A extends any[] ? (...args: A) => Merge<ResS, ResT> : never
                : never
            : never
        : never;

type MergeObjects<S, T> =
    Flatten<{
        [K in keyof S | keyof T]: K extends keyof S
            ? (K extends keyof T ? Merge<S[K], T[K]> : S[K])
            : (K extends keyof T ? T[K] : never)
    }>;
