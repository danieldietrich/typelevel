/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Filter, Join, Map } from "./objects";

export type CheckResult<A, V extends (A | CheckError)[], K extends PropertyKey = 'typelevel_error' , E = Filter<V, CheckError>> =
    E extends [] ? A : {
        [Key in K]: E
    };

export type CheckError<Message extends string = any, Cause = unknown, Help = unknown> =
    Join<{ message: Message } & Map<Cause, { cause: Cause }> & Map<Help, { help: Help }>>;
