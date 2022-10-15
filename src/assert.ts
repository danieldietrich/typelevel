/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

export class TypeAssertionError extends Error {
    constructor(msg: string | undefined) {
        super(`Type assertion error` + msg ? ": " + msg : "");
    }
}

export function assertType<_T extends true>(condition: any = true, msg?: string): asserts condition {
    if (!condition) {
        throw new TypeAssertionError(msg);
    }
}
