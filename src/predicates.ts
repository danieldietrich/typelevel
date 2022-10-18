/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

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

// returns true if T1 is exactly T2
export type Is<T1, T2> =
    (<T>() => T extends T2 ? true : false) extends (<T>() => T extends T1 ? true : false)
        ? true
        : false;

export type IsEmpty<T> =
    Is<T, any> extends true ? boolean :
        Is<T, unknown> extends true ? unknown :
            Is<T, never> extends true ? never :
                [T] extends [[]] ? true :
                    [(/* copy of objects/Keys */Or<Is<T, any>, Is<T, never>> extends true ? never : keyof T)] extends [never] ? true : false;

export type IsUniversal<T> =
    Or<Is<T, any>, Or<Is<T, unknown>, Is<T, never>>> extends true ? true : false;

export type Extends<A1, A2> =
    Is<A1, never> extends true ? true :
        Is<A2, never> extends true ? false :
            Is<A2, any> extends true ? true :
                Is<A2, unknown> extends true ? true :
                    Is<A1, any> extends true ? false :
                        Is<A1, unknown> extends true ? false :
                            A1 extends A2 ? true : false;
