/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

/**
 * Represents a function type with a variable number of arguments and a return type.
 *
 * Examples:
 * • A function: Fn
 * • A function with exactly one parameter First and arbitrary return type: Fn<[infer First]>
 * • A function with at least one parameters First and a specific return type R: Fn<[infer First, ...infer Rest], infer R>
 *
 * @param A - an array of argument types, default any[]
 * @param R - the return type, default any
 */
export type Fn<A extends any[] = any[], R extends any = any> = (...args: A) => R;
