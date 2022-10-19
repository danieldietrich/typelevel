/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from "typelevel-assert";
import { Is, Join, Keys, Obj, Paths, Values } from "../src";

{ // Obj

    class EmptyClass {}
    class NonEmptyClass { a: number }

    { // Obj<Strict = true>
        assertType<Is<any extends Obj ? true : false, boolean>>();
        assertType<Is<unknown extends Obj ? true : false, false>>();
        assertType<Is<never extends Obj ? true : false, true>>();
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

    { // Obj<Strict = false>
        assertType<Is<any extends Obj<false> ? true : false, boolean>>();
        assertType<Is<unknown extends Obj<false> ? true : false, false>>();
        assertType<Is<never extends Obj<false> ? true : false, true>>();
        assertType<Is<EmptyClass extends Obj<false> ? true : false, true>>();
        assertType<Is<NonEmptyClass extends Obj<false> ? true : false, true>>();
        assertType<Is<{} extends Obj<false> ? true : false, true>>();
        assertType<Is<{ a: number } extends Obj<false> ? true : false, true>>();
        assertType<Is<[] extends Obj<false> ? true : false, true>>();
        assertType<Is<[number] extends Obj<false> ? true : false, true>>();
        assertType<Is<(() => void) extends Obj<false> ? true : false, true>>();
        assertType<Is<string extends Obj<false> ? true : false, false>>();
        assertType<Is<number extends Obj<false> ? true : false, false>>();
        assertType<Is<boolean extends Obj<false> ? true : false, false>>();
        assertType<Is<symbol extends Obj<false> ? true : false, false>>();
        assertType<Is<bigint extends Obj<false> ? true : false, false>>();
        assertType<Is<null extends Obj<false> ? true : false, false>>();
        assertType<Is<undefined extends Obj<false> ? true : false, false>>();
        assertType<Is<void extends Obj<false> ? true : false, false>>();
    }

    { // Obj<Strict = false> behaves like object
        assertType<Is<any extends Obj<false> ? true : false, any extends object ? true : false>>();
        assertType<Is<unknown extends Obj<false> ? true : false, unknown extends object ? true : false>>();
        assertType<Is<never extends Obj<false> ? true : false, never extends object ? true : false>>();
        assertType<Is<EmptyClass extends Obj<false> ? true : false, EmptyClass extends object ? true : false>>();
        assertType<Is<NonEmptyClass extends Obj<false> ? true : false, NonEmptyClass extends object ? true : false>>();
        assertType<Is<{} extends Obj<false> ? true : false, {} extends object ? true : false>>();
        assertType<Is<{ a: number } extends Obj<false> ? true : false, { a: number } extends object ? true : false>>();
        assertType<Is<[] extends Obj<false> ? true : false, [] extends object ? true : false>>();
        assertType<Is<[number] extends Obj<false> ? true : false, [number] extends object ? true : false>>();
        assertType<Is<(() => void) extends Obj<false> ? true : false, (() => void) extends object ? true : false>>();
        assertType<Is<string extends Obj<false> ? true : false, string extends object ? true : false>>();
        assertType<Is<number extends Obj<false> ? true : false, number extends object ? true : false>>();
        assertType<Is<boolean extends Obj<false> ? true : false, boolean extends object ? true : false>>();
        assertType<Is<symbol extends Obj<false> ? true : false, symbol extends object ? true : false>>();
        assertType<Is<bigint extends Obj<false> ? true : false, bigint extends object ? true : false>>();
        assertType<Is<null extends Obj<false> ? true : false, null extends object ? true : false>>();
        assertType<Is<undefined extends Obj<false> ? true : false, undefined extends object ? true : false>>();
        assertType<Is<void extends Obj<false> ? true : false, void extends object ? true : false>>();
    }

}

{ // Keys<T>should fix keyof any = string | number | symbol
    type Actual = Keys<any>;
    type Expected = never
    assertType<Is<keyof any, string | number | symbol>>();
    assertType<Is<Actual, Expected>>();
}

{ // Keys<T> should behave like keyof unknown = never
    type Actual = Keys<unknown>;
    type Expected = never;
    assertType<Is<Actual, keyof unknown>>();
    assertType<Is<Actual, Expected>>();
}

{ // Keys<T> should fix keyof never = string | number | symbol
    type Actual = Keys<never>;
    type Expected = never
    assertType<Is<keyof never, string | number | symbol>>();
    assertType<Is<Actual, Expected>>();
}

{ // Values<T> should behave like any[keyof any] = any
    type Actual = Values<any>;
    type Expected = any;
    assertType<Is<Actual, any[keyof any]>>();
    assertType<Is<Actual, Expected>>();
}

{ // Values<T> should behave like unknown[keyof unknown] = never
    type Actual = Values<unknown>;
    type Expected = never;
    assertType<Is<Actual, unknown[keyof unknown]>>();
    assertType<Is<Actual, Expected>>();
}

{ // Values<T> should behave like never[keyof never] = never
    type Actual = Values<never>;
    type Expected = never
    assertType<Is<Actual, never[keyof never]>>();
    assertType<Is<Actual, Expected>>();
}

{ // Join should join universal types
    assertType<Is<Join<any>, any>>();
    assertType<Is<Join<unknown>, unknown>>();
    assertType<Is<Join<never>, never>>();
    assertType<Is<Join<{}>, {}>>();
}

{ // Join should fulfil prerequisite Is<{ a: 1 } & { b: 2 }, { a: 1, b: 2 }> extends false
    type Actual = { a: 1 } & { b: 2 };
    type Expected = { a: 1, b: 2 };
    // @ts-expect-error
    assertType<Is<Actual, Expected>>();
}

{ // Join should join intersection
    type Actual = Join<{ a: 1 } & { b: 2 }>;
    type Expected = { a: 1, b: 2 };
    assertType<Is<Actual, Expected>>();
}

{ // Paths should work for universal types T = any | unknown | never
    assertType<Is<Paths<any>, any>>();
    assertType<Is<Paths<never>, never>>();
    assertType<Is<Paths<unknown>, unknown>>();
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
