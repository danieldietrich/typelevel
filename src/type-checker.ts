/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Filter } from "./objects";

/** ✅
 * Represents a check result of type T. If all checks C pass, T is returned,
 * otherwise an error with a list of failed checks is returned
 *
 * {
 *   'typelevel_error' : [ ... ]
 * }
 *
 * The property key 'typelevel_error' can be customized.
 *
 * @param T a type
 * @param E a list of checks, each either T on success or CheckError on failure
 * @param K optional property key of an error, by default 'typelevel_error'
 * @returns T if all checks succeeded, otherwise { K: CheckError[] }
 */
export type CheckResult<T, E extends (T | CheckError)[], K extends PropertyKey = 'typelevel_error'> =
    Filter<E, CheckError> extends infer C
        ? C extends []
            ? T
            : { [Key in K]: C }
        : never;

/** ✅
 * Represents a type check error.
 *
 * @param Message an optional short and descriptive error message
 * @param Cause an optional cause of the error
 * @param Help an optional link to the documentation
 */
export type CheckError<Message = any, Cause = any, Help = any> = {
    message: Message;
    cause: Cause;
    help: Help;
};
