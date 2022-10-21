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

{ // Combine should join universal types
    assertType<Is<Combine<any>, { [x in (string | number | symbol)]: any }>>();
    assertType<Is<Combine<unknown>, {}>>();
    assertType<Is<Combine<never>, never>>();
    assertType<Is<Combine<{}>, {}>>();
}

{ // Combine should fulfil prerequisite Is<{ a: 1 } & { b: 2 }, { a: 1, b: 2 }> extends false
    type Actual = { a: 1 } & { b: 2 };
    type Expected = { a: 1, b: 2 };
    // @ts-expect-error
    assertType<Is<Actual, Expected>>();
}

{ // Combine should join intersection
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
