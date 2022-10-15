/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Merge } from './objects';

export type MergeArray<A> =
    A extends unknown[]
        ? A extends [infer Head, ...infer Tail]
            ? Tail extends []
                ? Head
                : Tail extends unknown[]
                    ? Merge<MergeArray<Tail>, Head>
                    : never
            : never
        : never;
