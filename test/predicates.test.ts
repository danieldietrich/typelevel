/******************************************************************************
 * Copyright 2025 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from "typelevel-assert";
import type {
  And,
  Equals,
  Extends,
  Fn,
  Is,
  IsEach,
  IsEmpty,
  IsIn,
  IsUniversal,
  Not,
  Obj,
  Or
} from "../src";

{
  // And
  assertType<Is<And<true, true>, true>>();
  assertType<Is<And<true, false>, false>>();
  assertType<Is<And<false, true>, false>>();
  assertType<Is<And<false, false>, false>>();
  assertType<Is<And<boolean, true>, boolean>>();
  assertType<Is<And<boolean, false>, false>>();
  assertType<Is<And<true, boolean>, boolean>>();
  assertType<Is<And<false, boolean>, false>>();
  assertType<Is<And<boolean, boolean>, boolean>>();

  assertType<Is<And<true | false, true>, true | false>>();
  assertType<Is<And<true, true | false>, true | false>>();
}

{
  // Or
  assertType<Is<Or<true, true>, true>>();
  assertType<Is<Or<true, false>, true>>();
  assertType<Is<Or<false, true>, true>>();
  assertType<Is<Or<false, false>, false>>();
  assertType<Is<Or<boolean, true>, true>>();
  assertType<Is<Or<boolean, false>, boolean>>();
  assertType<Is<Or<true, boolean>, true>>();
  assertType<Is<Or<false, boolean>, boolean>>();
  assertType<Is<Or<boolean, boolean>, boolean>>();

  assertType<Is<Or<true | false, false>, true | false>>();
  assertType<Is<Or<false, true | false>, true | false>>();
}

{
  // Not
  assertType<Is<Not<true>, false>>();
  assertType<Is<Not<false>, true>>();
  assertType<Is<Not<boolean>, boolean>>();
}

{
  // Equals
  assertType<Is<Equals<any, any>, true>>();
  assertType<Is<Equals<any, unknown>, true>>();
  assertType<Is<Equals<unknown, unknown>, true>>();
  assertType<Is<Equals<never, any>, false>>();
  assertType<Is<Equals<never, unknown>, false>>();
  assertType<Is<Equals<never, never>, true>>();

  {
    // objects, arrays, classes and functions
    class A {}
    class B extends A {
      b = 1;
    }
    assertType<Is<Equals<{}, { a: 1 }>, false>>();
    assertType<Is<Equals<{ a: 1 }, { a: 1 }>, true>>();
    assertType<Is<Equals<[], [1]>, false>>();
    assertType<Is<Equals<[1], [1]>, true>>();
    assertType<Is<Equals<() => 1, () => 2>, false>>();
    assertType<Is<Equals<() => 1, () => 1>, true>>();
    assertType<Is<Equals<A, A>, true>>();
    assertType<Is<Equals<B, B>, true>>();
    assertType<Is<Equals<A, B>, false>>();
  }
  assertType<Is<Equals<0, 1>, false>>();
  assertType<Is<Equals<1, 1>, true>>();
  assertType<Is<Equals<null, null>, true>>();
  assertType<Is<Equals<undefined, undefined>, true>>();
  assertType<Is<Equals<void, void>, true>>();
  assertType<Is<Equals<{ a: 1 } | { b: 2 }, { a: 1; b: 2 }>, false>>();
  assertType<Is<Equals<{ a: 1 } & { b: 2 }, { a: 1; b: 2 }>, true>>();
}

{
  // IsIn

  interface A {
    a: number;
  }
  interface B {
    b: number;
  }
  interface C {
    c: number;
  }
  interface I1 extends A, B, C {}
  interface I2 extends A, B {}
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
  assertType<Is<IsIn<C2, A>, true>>();
  assertType<Is<IsIn<C2, C3>, false>>();
  assertType<Is<IsIn<C2, A | C3>, true>>();
  assertType<Is<IsIn<C1 | C2, C>, IsIn<C1, C> | IsIn<C2, C>>>();
  assertType<Is<IsIn<C1 | C2, C>, boolean>>();
  assertType<Is<IsIn<C1, C>, true>>();
  assertType<Is<IsIn<C2, C>, false>>();

  assertType<Is<IsIn<C1 | C2, A>, IsIn<C1, A> | IsIn<C2, A>>>();
  assertType<Is<IsIn<C1 | C2, A>, true>>();
  assertType<Is<IsIn<C1, A>, true>>();
  assertType<Is<IsIn<C2, A>, true>>();
  assertType<Is<IsIn<I1, A>, true>>();
  assertType<Is<IsIn<I1, I2>, true>>();
  assertType<Is<IsIn<I1, A | I2>, true>>();

  assertType<Is<IsIn<I2, A>, true>>();
  assertType<Is<IsIn<I2, I1>, false>>();
  assertType<Is<IsIn<I2, A | I1>, true>>();
}

{
  // IsEach

  interface A {
    a: number;
  }
  interface B {
    b: number;
  }
  interface C {
    c: number;
  }
  interface I1 extends A, B, C {}
  interface I2 extends A, B {}
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
  assertType<Is<IsEach<C1, A>, true>>();
  assertType<Is<IsEach<C1, C2>, true>>();
  assertType<Is<IsEach<C1, A | C2>, true>>();

  assertType<Is<IsEach<C2, A>, true>>();
  assertType<Is<IsEach<C2, C3>, false>>();
  assertType<Is<IsEach<C2, A | C3>, false>>();

  assertType<Is<IsEach<C2, C>, false>>();
  assertType<Is<IsEach<C2, C3>, false>>();
  assertType<Is<IsEach<C2, A | C3>, false>>();
  assertType<Is<IsEach<C1 | C2, C>, IsEach<C1, C> | IsEach<C2, C>>>();
  assertType<Is<IsEach<C1 | C2, C>, boolean>>();
  assertType<Is<IsEach<C1, C>, true>>();
  assertType<Is<IsEach<C2, C>, false>>();

  assertType<Is<IsEach<C1 | C2, A>, IsEach<C1, A> | IsEach<C2, A>>>();
  assertType<Is<IsEach<C1 | C2, A>, true>>();
  assertType<Is<IsEach<C1, A>, true>>();
  assertType<Is<IsEach<C2, A>, true>>();
  assertType<Is<IsEach<I1, A>, true>>();
  assertType<Is<IsEach<I1, I2>, true>>();
  assertType<Is<IsEach<I1, A | I2>, true>>();

  assertType<Is<IsEach<I2, A>, true>>();
  assertType<Is<IsEach<I2, I1>, false>>();
  assertType<Is<IsEach<I2, A | I1>, false>>();
}

{
  // IsEmpty
  assertType<Is<IsEmpty<any>, boolean>>();
  assertType<Is<IsEmpty<unknown>, never>>();
  assertType<Is<IsEmpty<never>, never>>();
  assertType<Is<IsEmpty<{}>, true>>();
  assertType<Is<IsEmpty<{ a: 1 }>, false>>();
  assertType<Is<IsEmpty<[]>, true>>();
  assertType<Is<IsEmpty<[1]>, false>>();
  assertType<Is<IsEmpty<() => void>, true>>();
  assertType<Is<IsEmpty<() => 1>, true>>();
  assertType<Is<IsEmpty<(a: 1) => void>, true>>();

  {
    // IsEmpty<T> should work for classes
    class A {}
    class B {
      b = true;
    }
    assertType<Is<IsEmpty<A>, true>>();
    assertType<Is<IsEmpty<B>, false>>();
  }
  assertType<Is<IsEmpty<0>, never>>();
  assertType<Is<IsEmpty<1>, never>>();
  assertType<Is<IsEmpty<"">, never>>();
  assertType<Is<IsEmpty<"a">, never>>();
  assertType<Is<IsEmpty<null>, never>>();
  assertType<Is<IsEmpty<undefined>, never>>();
  assertType<Is<IsEmpty<void>, never>>();
}

{
  // IsUniversal
  assertType<Is<IsUniversal<any>, true>>();
  assertType<Is<IsUniversal<unknown>, true>>();
  assertType<Is<IsUniversal<never>, true>>();
  assertType<Is<IsUniversal<1>, false>>();
  type Actual = IsUniversal<number | any>;
  type Expected = true; // instead of boolean = false | true
  assertType<Equals<Actual, Expected>>();
}

{
  // Extends

  const emptyObj = {};

  type EmptyObj = typeof emptyObj;

  function fn() {
    return undefined;
  }

  class A {
    a = 1;
  }
  assertType<Is<Extends<any, any>, true>>();
  assertType<Is<Extends<never, never>, true>>();
  assertType<Is<Extends<unknown, unknown>, true>>();
  assertType<Is<Extends<void, void>, true>>();
  assertType<Is<Extends<undefined, undefined>, true>>();
  assertType<Is<Extends<null, null>, true>>();
  assertType<Is<Extends<boolean, boolean>, true>>();
  assertType<Is<Extends<number, number>, true>>();
  assertType<Is<Extends<string, string>, true>>();
  assertType<Is<Extends<symbol, symbol>, true>>();
  assertType<Is<Extends<any[], any[]>, true>>();
  assertType<Is<Extends<Fn, Fn>, true>>();
  assertType<Is<Extends<Obj, Obj>, true>>();
  assertType<Is<Extends<A, A>, true>>();
  assertType<Is<Extends<never, never>, true>>();
  assertType<Is<Extends<never, any>, true>>();
  assertType<Is<Extends<never, unknown>, true>>();
  assertType<Is<Extends<never, 1>, true>>();
  assertType<Is<Extends<never, never>, true>>();
  assertType<Is<Extends<any, never>, false>>();
  assertType<Is<Extends<unknown, never>, false>>();
  assertType<Is<Extends<1, never>, false>>();
  assertType<Is<Extends<any, any>, true>>();
  assertType<Is<Extends<any, never>, false>>();
  assertType<Is<Extends<any, unknown>, true>>();
  assertType<Is<Extends<any, 1>, true>>(); // <-- [any] extends [1] -> true, any extends 1 -> boolean
  assertType<Is<Extends<unknown, unknown>, true>>();
  assertType<Is<Extends<unknown, never>, false>>();
  assertType<Is<Extends<unknown, any>, true>>();
  assertType<Is<Extends<unknown, 1>, false>>();
  assertType<Is<Extends<never, any>, true>>();
  assertType<Is<Extends<unknown, any>, true>>();
  assertType<Is<Extends<1, any>, true>>();
  assertType<Is<Extends<any, unknown>, true>>();
  assertType<Is<Extends<never, unknown>, true>>();
  assertType<Is<Extends<1, unknown>, true>>();
  assertType<Is<Extends<1, number>, true>>();
  assertType<Is<Extends<number, 1>, false>>();
  assertType<Is<Extends<() => any, Fn>, true>>();
  assertType<Is<Extends<() => void, Fn>, true>>();
  assertType<Is<Extends<(...args: any[]) => any, Fn>, true>>();
  assertType<Is<Extends<typeof fn, Fn>, true>>();

  assertType<Is<Extends<unknown, Fn>, false>>();
  assertType<Is<Extends<void, Fn>, false>>();
  assertType<Is<Extends<undefined, Fn>, false>>();
  assertType<Is<Extends<null, Fn>, false>>();
  assertType<Is<Extends<boolean, Fn>, false>>();
  assertType<Is<Extends<number, Fn>, false>>();
  assertType<Is<Extends<string, Fn>, false>>();
  assertType<Is<Extends<any[], Fn>, false>>();
  assertType<Is<Extends<Record<string, unknown>, Fn>, false>>();
  assertType<Is<Extends<A, Fn>, false>>();
  assertType<Is<Extends<any[], any[]>, true>>();
  assertType<Is<Extends<[], []>, true>>();
  assertType<Is<Extends<any[], []>, false>>();
  assertType<Is<Extends<[], any[]>, true>>();
  assertType<Is<Extends<[], [any]>, false>>();
  assertType<Is<Extends<[any], any[]>, true>>();
  assertType<Is<Extends<[any], []>, false>>();

  assertType<Is<Extends<[1], [number]>, true>>();
  assertType<Is<Extends<[number], [1]>, false>>();
  assertType<Is<Extends<[1], [1]>, true>>();
  assertType<Is<Extends<[1], [2]>, false>>();

  assertType<Is<Extends<[1, ""], [number, string]>, true>>();
  assertType<Is<Extends<[1, ""], [number, any]>, true>>();
  assertType<Is<Extends<[1, ""], [number, never]>, false>>();
  assertType<Is<Extends<[number, string], [1, ""]>, false>>();
  assertType<Is<Extends<[number, any], [1, ""]>, false>>();
  assertType<Is<Extends<[number, never], [1, ""]>, false>>();
  assertType<Is<Extends<A, EmptyObj>, true>>();
  assertType<Is<Extends<EmptyObj, A>, false>>();

  assertType<Is<Extends<A, Record<string, any>>, true>>();
  assertType<Is<Extends<Record<string, any>, A>, false>>();

  assertType<Is<Extends<A, unknown>, true>>();
  assertType<Is<Extends<unknown, A>, false>>();

  assertType<Is<Extends<EmptyObj, { a: 1 }>, false>>();
  assertType<Is<Extends<{ a: 1 }, EmptyObj>, true>>();
  assertType<Is<Extends<{ a: 1 }, { a: number }>, true>>();
  assertType<Is<Extends<{ a: 1 }, { a: string }>, false>>();
  type Actual = Extends<never, { a: 1 } | { b: 1 }>; // would be never, if Extends distributed unions
  type Expected = never extends { a: 1 } | { b: 1 } ? true : false; // = true
  assertType<Equals<Actual, Expected>>();
}
