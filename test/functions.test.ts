/******************************************************************************
 * Copyright 2025 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from "typelevel-assert";
import type { Fn, Is } from "../src";

{
  // Fn

  {
    // Fn should match all function types
    type Actual = Fn;
    type Expected = (...args: any[]) => any;
    assertType<Is<Actual, Expected>>();
  }

  {
    // universal argument types
    assertType<Is<Fn<any[]>, (...args: any[]) => any>>();
    assertType<Is<Fn<any>, (...args: any) => any>>();
    assertType<Is<Fn<unknown[]>, (...args: unknown[]) => any>>();
    // @ts-expect-error
    assertType<Is<Fn<unknown>, (...args: unknown) => any>>();
    assertType<Is<Fn<never[]>, (...args: never) => any>>();
    assertType<Is<Fn<never>, (...args: never) => any>>();
  }

  {
    // universal return types
    assertType<Is<Fn<any, any>, (...args: any[]) => any>>();
    assertType<Is<Fn<any, unknown>, (...args: any[]) => unknown>>();
    assertType<Is<Fn<any, never>, (...args: any[]) => never>>();
  }

  {
    // Fn<[infer First], infer R>
    type Testee = (a: number) => string;
    type Actual = Testee extends Fn<[infer First], infer R>
      ? [First, R]
      : never;
    type Expected = [number, string];
    assertType<Is<Actual, Expected>>();
  }

  {
    // Fn<[infer First, ...infer Rest], infer R>
    type Testee = (a: number) => string;
    type Actual = Testee extends Fn<[infer First, ...infer Rest], infer R>
      ? [First, Rest, R]
      : never;
    type Expected = [number, [], string];
    assertType<Is<Actual, Expected>>();
  }
}
