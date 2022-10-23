/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Filter } from "./objects";

// ✅
export type CheckResult<A, C extends (A | CheckError)[], K extends PropertyKey = 'typelevel_error'> =
    Filter<C, CheckError> extends infer E
        ? E extends []
            ? A
            : { [Key in K]: E }
        : never;

// ✅
export type CheckError<Message = any, Cause = any, Help = any> = {
    message: Message;
    cause: Cause;
    help: Help;
};
