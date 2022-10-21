/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from "typelevel-assert";
import { Combine, Is, Keys, Obj, Paths, Values } from "../src";

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
        assertType<Is<Actual, Expected>>();
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
        assertType<Is<Actual, Expected>>();
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
        type Expected = { a: 1; b: 1} | { a: 2; c: 2 };
        assertType<Is<Actual, Expected>>();
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
        assertType<Is<Actual, Expected>>();
    }

}
