/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

/**
 * Represents a function type with a variable number of arguments and a return type.
 *
 * Examples:
 * • A function with exactly one parameter: Fn<[infer First], infer R>
 * • A function with one or more parameters: Fn<[infer First, ...infer Rest], infer R>
 *
 * @param A - the argument types
 * @param R - the return type
 */
export type Fn<T extends any[] = any[], R extends any = any> = (...args: T) => R;
