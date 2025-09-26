/******************************************************************************
 * Copyright 2025 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from "typelevel-assert";
import type { CheckError, CheckResult, Is } from "../src";

{
  // CheckError

  {
    // CheckError should be used without generics
    type Actual = CheckError;
    type Expected = {
      message: any;
      cause: any;
      help: any;
    };
    assertType<Is<Actual, Expected>>();
  }

  {
    // CheckError reflect the given parameters
    type Actual = CheckError<"a", "b", "c">;
    type Expected = {
      message: "a";
      cause: "b";
      help: "c";
    };
    assertType<Is<Actual, Expected>>();
  }
}

{
  // CheckResult

  {
    // CheckResult should check argument with empty list of checks
    type Arg = null;
    type Actual = CheckResult<Arg, []>;
    type Expected = Arg;
    assertType<Is<Actual, Expected>>();
  }

  {
    // CheckResult should check argument with one valid checks
    type Arg = null;
    type Actual = CheckResult<Arg, [Arg]>;
    type Expected = Arg;
    assertType<Is<Actual, Expected>>();
  }

  {
    // CheckResult should check argument with one invalid checks
    type Arg = null;
    type Actual = CheckResult<Arg, [CheckError]>;
    type Expected = {
      typelevel_error: [CheckError];
    };
    assertType<Is<Actual, Expected>>();
  }

  {
    // CheckResult should allow to define a custom error key
    type Arg = null;
    type Actual = CheckResult<Arg, [CheckError], "custom_error">;
    type Expected = {
      custom_error: [CheckError];
    };
    assertType<Is<Actual, Expected>>();
  }
}
