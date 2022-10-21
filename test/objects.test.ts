/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from "typelevel-assert";
import { Combine, Is, Keys, Obj, Paths, Values } from "../src";

{ // Obj<Strict = true>

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
    assertType<Is<Combine<any>, any>>();
    assertType<Is<Combine<unknown>, unknown>>();
    assertType<Is<Combine<never>, never>>();
    assertType<Is<Combine<{}>, {}>>();
}

{ // Join should fulfil prerequisite Is<{ a: 1 } & { b: 2 }, { a: 1, b: 2 }> extends false
    type Actual = { a: 1 } & { b: 2 };
    type Expected = { a: 1, b: 2 };
    // @ts-expect-error
    assertType<Is<Actual, Expected>>();
}

{ // Join should join intersection
    type Actual = Combine<{ a: 1 } & { b: 2 }>;
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
