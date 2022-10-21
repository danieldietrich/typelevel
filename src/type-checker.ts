/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Filter } from "./objects";

// ✅
export type CheckResult<A, V extends (A | CheckError)[], K extends PropertyKey = 'typelevel_error'> =
    Filter<V, CheckError> extends infer E
        ? E extends []
            ? A
            : { [Key in K]: E }
        : never;

// ✅
export type CheckError<Message extends string = any, Cause = any, Help extends string = any> = {
    message: Message;
    cause: Cause;
    help: Help;
};
