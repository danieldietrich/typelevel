/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from "typelevel-assert";
import { describe, it } from "vitest";
import { Is, IsEmpty } from "../src";

describe('IsEmpty<T>', () => {

    it('should work for universal types', () => {
        assertType<Is<IsEmpty<any>, boolean>>();
        assertType<Is<IsEmpty<unknown>, unknown>>();
        assertType<Is<IsEmpty<never>, never>>();
        assertType<Is<IsEmpty<{}>, true>>();
    });

    it('should work non-empty object', () => {
        type Actual = IsEmpty<{ a: 1 }>;
        type Expected = false;
        assertType<Is<Actual, Expected>>();
    });

});
