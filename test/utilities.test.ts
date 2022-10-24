/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { assertType } from "typelevel-assert";
import { Is, Or, TupleToIntersection, TupleToUnion, UnionToIntersection, UnionToTuple } from '../src';

{ // universal types

    { // TupleToIntersection
        assertType<Is<TupleToIntersection<any>, any>>();
        // @ts-expect-error unknown is not a tuple
        assertType<Is<TupleToIntersection<unknown>, unknown>>();
        assertType<Is<TupleToIntersection<never>, unknown>>();
    }

    { // TupleToUnion
        assertType<Is<TupleToUnion<any>, any>>();
        // @ts-expect-error unknown is not a tuple
        assertType<Is<TupleToUnion<unknown>, unknown>>();
        assertType<Is<TupleToUnion<never>, never>>();
    }

    { // UnionToIntersection
        assertType<Is<UnionToIntersection<any>, any>>();
        assertType<Is<UnionToIntersection<unknown>, unknown>>();
        assertType<Is<UnionToIntersection<never>, unknown>>();
    }

    { // UnionToTuple
        assertType<Is<UnionToTuple<any>, [any]>>();
        assertType<Is<UnionToTuple<unknown>, [unknown]>>();
        assertType<Is<UnionToTuple<never>, []>>();
    }

}

{ // TupleToIntersection
    type Actual = TupleToIntersection<[{ a: 1 }, { b: 1 }]>;
    type Expected = { a: 1 } & { b: 1 };
    assertType<Is<Actual, Expected>>();
}

{ // TupleToUnion
    type Actual = TupleToUnion<[{ a: 1 }, { b: 1 }]>;
    type Expected = { a: 1 } | { b: 1 };
    assertType<Is<Actual, Expected>>();
}

{ // UnionToIntersection
    type Actual = UnionToIntersection<{ a: 1 } | { b: 1 }>;
    type Expected = { a: 1 } & { b: 1 };
    assertType<Is<Actual, Expected>>();
}

{ // UnionToTuple (the order of the tuple elements is unpredictable)
    type Actual = UnionToTuple<{ a: 1 } | { b: 1 }>;
    type Expected1 = [{ a: 1 }, { b: 1 }];
    type Expected2 = [{ b: 1 }, { a: 1 }];
    assertType<Or<Is<Actual, Expected1>, Is<Actual, Expected2>>>();
}
