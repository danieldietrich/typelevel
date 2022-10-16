/******************************************************************************
 * Copyright 2022 Daniel Dietrich
 * This program and the accompanying materials are made available under the
 * terms of the MIT License, which is available in the project root.
 ******************************************************************************/

import { Filter, Map } from "./objects";

export type ValidationResult<A, V extends (A | ValidationError)[], K extends PropertyKey = 'typelevel_error' , E = Filter<V, ValidationError>> =
    E extends [] ? A : {
        [Key in K]: E
    };

export type ValidationError<Message extends string = any, Cause = unknown, Help = unknown> =
    { message: Message } & Map<Cause, { cause: Cause }> & Map<Help, { help: Help }>;
