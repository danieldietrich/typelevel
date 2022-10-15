/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

// a function
export type Fn<T extends any[] = any[], R extends any = any> = (...args: T) => R;

// a function with exactly one argument
export type Fn1<T = any, R = any> = (args0: T, ...args: any[]) => R;
