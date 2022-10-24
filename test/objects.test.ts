/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from "typelevel-assert";
import { Combine, Equals, Filter, Is, Keys, Not, Obj, Paths, Values } from "../src";

{ // Obj

    interface EmptyInterface {}
    interface NonEmptyInterface { a: number }

    class EmptyClass {}
    class NonEmptyClass { a: number }

    assertType<Is<any extends Obj ? true : false, boolean>>();
    assertType<Is<unknown extends Obj ? true : false, false>>();
    assertType<Is<never extends Obj ? true : false, true>>();
    assertType<Is<EmptyInterface extends Obj ? true : false, false>>();
    assertType<Is<NonEmptyInterface extends Obj ? true : false, false>>();
    assertType<Is<EmptyClass extends Obj ? true : false, false>>();
    assertType<Is<NonEmptyClass extends Obj ? true : false, false>>();
    assertType<Is<{} extends Obj ? true : false, true>>();
    assertType<Is<{ a: number } extends Obj ? true : false, true>>();
    assertType<Is<[] extends Obj ? true : false, false>>();
    assertType<Is<[number] extends Obj ? true : false, false>>();
    assertType<Is<(() => void) extends Obj ? true : false, false>>();
    assertType<Is<string extends Obj ? true : false, false>>();
    assertType<Is<number extends Obj ? true : false, false>>();
    assertType<Is<boolean extends Obj ? true : false, false>>();
    assertType<Is<symbol extends Obj ? true : false, false>>();
    assertType<Is<bigint extends Obj ? true : false, false>>();
    assertType<Is<null extends Obj ? true : false, false>>();
    assertType<Is<undefined extends Obj ? true : false, false>>();
    assertType<Is<void extends Obj ? true : false, false>>();
}

{ // Keys

    { // Keys<any> should behave like keyof any
        type Actual = Keys<any>;
        type Expected = string | number | symbol
        assertType<Is<keyof any, Expected>>();
        assertType<Is<Actual, Expected>>();
    }

    { // Keys<unknown> should behave like keyof unknown
        type Actual = Keys<unknown>;
        type Expected = never;
        assertType<Is<keyof unknown, Expected>>();
        assertType<Is<Actual, Expected>>();
    }

    { // Keys<never> should behave like keyof never
        type Actual = Keys<never>;
        type Expected = string | number | symbol
        assertType<Is<keyof never, Expected>>();
        assertType<Is<Actual, Expected>>();
    }

    { // Key should not distribute union types
        type Actual = Keys<{ a: { b: 1 } } | { b: { c: 2 } }>;
        type Expected = never;
        assertType<Equals<Actual, Expected>>();
    }

}

{ // Values

    { // Values<any> should behave like any[keyof any]
        type Actual = Values<any>;
        type Expected = any;
        assertType<Is<any[keyof any], Expected>>();
        assertType<Is<Actual, Expected>>();
    }

    { // Values<unknown> should behave like unknown[keyof unknown]
        type Actual = Values<unknown>;
        type Expected = never;
        assertType<Is<unknown[keyof unknown], Expected>>();
        assertType<Is<Actual, Expected>>();
    }

    { // Values<never> should behave like never[keyof never]
        type Actual = Values<never>;
        type Expected = never
        assertType<Is<never[keyof never], Expected>>();
        assertType<Is<Actual, Expected>>();
    }

    { // Values should not distribute union types
        type Actual = Values<{ a: { b: 1 } } | { b: { c: 2 } }>;
        type Expected = never;
        assertType<Equals<Actual, Expected>>();
    }

}

{ // Combine

    { // Combine should handle universal types
        assertType<Is<Combine<any>, { [x in (string | number | symbol)]: any }>>();
        assertType<Is<Combine<unknown>, {}>>();
        assertType<Is<Combine<never>, never>>();
        assertType<Is<Combine<{}>, {}>>();
    }

    { // Combine should handle a union of primitive intersections
        type Actual = Combine<number & 1 | string & 'a'>;
        type Expected = 1 | 'a';
        assertType<Is<Actual, Expected>>();
    }

    { // Combine should fulfill prerequisite Is<{ a: 1 } & { b: 2 }, { a: 1, b: 2 }> extends false
        type Actual = { a: 1 } & { b: 2 };
        type Expected = { a: 1, b: 2 };
        // @ts-expect-error
        assertType<Is<Actual, Expected>>();
    }

    { // Combine should handle intersection
        type Actual = Combine<{ a: 1 } & { b: 2 }>;
        type Expected = { a: 1, b: 2 };
        assertType<Is<Actual, Expected>>();
    }

    { // Combine should distribute union types
        type Actual = Combine<{ a: 1 } & { b: 1 } | { a: 2 } & { c: 2 }>;
        type Expected = Combine<{ a: 1 } & { b: 1}> | Combine<{ a: 2 } & { c: 2 }>;
        assertType<Equals<Actual, Expected>>();
    }

}

{ // Paths

    { // Paths should work for universal types T = any | unknown | never
        assertType<Is<Paths<any>, { [x: string]: any }>>();
        assertType<Is<Paths<never>, never>>();
        assertType<Is<Paths<unknown>, never>>();
    }

    { // Paths should handle primitive types
        assertType<Is<Paths<boolean>, never>>();
        assertType<Is<Paths<number>, never>>();
        assertType<Is<Paths<string>, never>>();
        assertType<Is<Paths<null>, never>>();
        assertType<Is<Paths<undefined>, never>>();
        assertType<Is<Paths<void>, never>>();
    }

    { // Paths should handle classes and interfaces
        class A { a: number }
        interface B { b: boolean }
        assertType<Is<Paths<A>, never>>();
        assertType<Is<Paths<B>, never>>();
    }

    { // Paths should work for type T = {}
        type Actual = Paths<{}>;
        type Expected = {};
        assertType<Is<Actual, Expected>>();
    }

    { // Paths should work if a property value is never
        type Actual = Paths<{
            b: never;
        }>;
        type Expected = {
            b: never
        };
        assertType<Is<Actual, Expected>>();
    }

    { // Paths should handle any
        type T = {
            _: any;
        };
        type Actual = Paths<T>;
        type Expected = T;
        assertType<Is<Actual, Expected>>();
    }

    { // Paths should handle unknown
        type T = {
            _: unknown;
        };
        type Actual = Paths<T>;
        type Expected = T;
        assertType<Is<Actual, Expected>>();
    }

    { // Paths should handle never
        type T = {
            _: never;
        };
        type Actual = Paths<T>;
        type Expected = T;
        assertType<Is<Actual, Expected>>();
    }

    { // Paths should distribute
        type Actual = Paths<{ a: { b: 1 } } | { b: { c: 2 } }>;
        type Expected = { 'a.b': 1 } | { 'b.c': 2 };
        assertType<Equals<Actual, Expected>>();
    }

    { // Should compute correct paths
        type Actual = Paths<{
            b: {
                c: {
                    d: never;
                };
                e: {
                    f: never;
                };
            };
        }>;
        type Expected = {
            'b.c.d': never,
            'b.e.f': never
        };
        assertType<Is<Actual, Expected>>();

    }

}

{ // Filter

    type O = { a: 1, b: '', c: true };
    type A = [1, '', true];

    { // Filter should work for objects and universal selectors any | unknown | never
        assertType<Is<Filter<O, any>, O>>();
        assertType<Is<Filter<O, unknown>, O>>();
        assertType<Is<Filter<O, never>, {}>>();
    }

    { // Filter should work for objects and primitive selectors
        assertType<Is<Filter<O, number>, { a: 1 }>>();
        assertType<Is<Filter<O, string>, { b: '' }>>();
        assertType<Is<Filter<O, boolean>, { c: true }>>();
    }

    { // Filter should work for arrays and universal selectors any | unknown | never
        assertType<Is<Filter<A, any>, A>>();
        assertType<Is<Filter<A, unknown>, A>>();
        assertType<Is<Filter<A, never>, []>>();
    }

    { // Filter should work for arrays and primitive selectors
        assertType<Is<Filter<A, number>, [1]>>();
        assertType<Is<Filter<A, string>, ['']>>();
        assertType<Is<Filter<A, boolean>, [true]>>();
    }

    { // Filter should distribute objects
        type Actual = Filter<{ a: 1 } | { b: '' }, number>;
        type Expected = Filter<{ a: 1 }, number> | Filter<{ b: '' }, number>;
        assertType<Equals<Actual, Expected>>();
    }

    { // Filter should distribute arrays
        type Actual = Filter<[1] | [''], number>;
        type Expected = Filter<[1], number> | Filter<[''], number>;
        assertType<Equals<Actual, Expected>>();
    }

    { // Filter should distribute a mixture of objects and arrays
        type Actual = Filter<{ a: 1 } | [1] | { b: '' } | [''], number>;
        type Expected = { a: 1 } | [1] | {} | [];
        assertType<Equals<Actual, Expected>>();
    }

    { // Filter should distribute a union of selectors and combine their results when filtering an object
        type Actual = Filter<O, number | string>;
        type Expected = Filter<O, number> & Filter<O, string>; // obj is a monoid wrt combine '&'
        assertType<Equals<Actual, Expected>>();
        assertType<Is<Filter<O, number>, { a: 1 }>>();
        assertType<Is<Filter<O, string>, { b: '' }>>();
        assertType<Is<Filter<O, number | string>, { a: 1, b: '' }>>();
    }

    { // Filter should distribute a union of selectors and combine their results when filtering an array
        type Actual = Filter<A, number | string>;
        type Expected = [...Filter<A, number>, ...Filter<A, string>]; // array is a monoid wrt concat
        assertType<Equals<Actual, Expected>>();
        assertType<Is<Filter<A, number>, [1]>>();
        assertType<Is<Filter<A, string>, ['']>>();
        assertType<Is<Filter<A, number | string>, [1, '']>>();
    }

    { // Filter should not distribute object union values
        type UV = {
            a: number | string
        }
        type Actual = Filter<UV, number | string>;
        type Expected = Filter<UV, number> | Filter<UV, string>;
        assertType<Not<Equals<Actual, Expected>>>();
        assertType<Is<Filter<UV, number>, {}>>();
        assertType<Is<Filter<UV, string>, {}>>();
    }

    { // Filter should not distribute array union values
        type UV = [number | string]
        type Actual = Filter<UV, number | string>;
        type Expected = [number] | [string];
        assertType<Not<Equals<Actual, Expected>>>();
        assertType<Is<Filter<UV, number>, []>>();
        assertType<Is<Filter<UV, string>, []>>();
    }

}
