/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from "typelevel-assert";
import { Is, IsEmpty, IsIn } from "../src";

{ // IsIn

    interface A {
        a: number;
    }
    interface B {
        b: number;
    }
    interface C {
        c: number;
    }
    interface I1 extends A, B, C {
    }
    interface I2 extends A, B {
    }
    class C2 implements A, B {
        a = 1;
        b = 1;
    }
    class C1 extends C2 implements C {
        c = 1;
    }
    class C3 implements A, B, C {
        a = 1;
        b = 1;
        c = 1;
    }

    { // IsIn should consider class hierarchies
        assertType<Is<IsIn<C2, A | C1>, true>>();
        assertType<Is<IsIn<C1, A | C2>, false>>();
        assertType<Is<IsIn<C2, A | C3>, true>>();
    }

    { // IsIn should not consider interfaces
        assertType<Is<IsIn<I2, A | I1>, true>>();
        assertType<Is<IsIn<I1, A | I2>, false>>();
    }

}

{ // IsEmpty<T> should work for universal types
    assertType<Is<IsEmpty<any>, boolean>>();
    assertType<Is<IsEmpty<unknown>, unknown>>();
    assertType<Is<IsEmpty<never>, never>>();
    assertType<Is<IsEmpty<{}>, true>>();
}

{ // IsEmpty<T> should work non-empty object
    type Actual = IsEmpty<{ a: 1 }>;
    type Expected = false;
    assertType<Is<Actual, Expected>>();
}
