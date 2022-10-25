<div id="typelevel-logo" align="center">
  <img alt="TypeLevel Logo Dark Mode" src="https://user-images.githubusercontent.com/743833/196892454-19e7eb18-7434-46de-a476-d39606507692.png#gh-dark-mode-only" width=640>
  <img alt="TypeLevel Logo Light Mode" src="https://user-images.githubusercontent.com/743833/196917074-f23107b9-c408-4267-9ab1-e0964fb576ba.png#gh-light-mode-only" width=640>
  <h3>
    Lift your code to the next level.
  </h3>
</div>

<br/>
<br/>

<div id="badges" align="center">

[![npm version](https://img.shields.io/npm/v/typescript-typelevel?logo=npm&style=flat-square)](https://www.npmjs.com/package/typescript-typelevel/)
[![build](https://img.shields.io/github/workflow/status/danieldietrich/typelevel/Build/main?logo=github&style=flat-square)](https://github.com/danieldietrich/typelevel/actions/workflows/build.yml)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/danieldietrich/typelevel)

</div>

<br/>
<br/>

<tt>**&lt;TypeLevel>**</tt> pushes payload from the JavaScript runtime to the TypeScript compiler. The highly composable type level API gives us the superpower to free JS apps from unnecessary ballast.

Ideally, types describe the domain, both structure and behavior. The latter is a challenge. There are not many major languages which are capable of describing behavior on the type level. TypeScript is different, it empowers us to perform algorithmic type transformations.

TypeScript does not pretend anything how to use the types. This is where <tt>**&lt;TypeLevel>**</tt> comes into play. <tt>**&lt;TypeLevel>**</tt> is more than a toolkit of useful utility methods, it offers a **solution** that yields a **mental model** for **type level programming** in TypeScript.

## Usage

Install <tt>**&lt;TypeLevel>**</tt>

```sh
npm i -D typescript-typelevel
```

## Features

### Functions

| Type                                               |
| -------------------------------------------------- |
| `Fn<A extends any[] = any[], R extends any = any>` | 

### Objects

| Type                                     |
| ---------------------------------------- |
| `Combine<T>`                             |
| `Filter<T, V, C extends boolean = true>` |
| `Obj`                                    |
| `Paths<T>`                               |
| `Keys<T>`                                |
| `Values<T>`                              |

### Predicates

| Type                                          |
| --------------------------------------------- |
| `And<C1 extends boolean, C2 extends boolean>` |
| `Or<C1 extends boolean, C2 extends boolean>`  |
| `Not<C extends boolean>`                      |
| `Equals<T1, T2>`                              |
| `Extends<T1, T2>`                             |
| `Is<T1, T2>`                                  |
| `IsIn<T, U>`                                  |
| `IsEach<T, U>`                                |
| `IsEmpty<T>`                                  |
| `IsUniversal<T>`                              |

### Utilities

| Type                                   |
| -------------------------------------- |
| `TupleToIntersection<T extends any[]>` |
| `TupleToUnion<T extends any[]>`        |
| `UnionToIntersection<U>`               |
| `UnionToTuple<T>`                      |

### Type Checker

| Type                                                 |
| ---------------------------------------------------- |
| `Check<T>`                                           |
| `CheckError<Message = any, Cause = any, Help = any>` |
| `CheckResult<T, C extends Check<T>[], K extends PropertyKey = 'typelevel_error'>` |

## The Essence of TypeScript

JavaScript (JS) is a structurally typed language. Informally, two types are assignable (read: considered "equal"), if they share the same properties. JS is dynamically typed, errors are reported at runtime.

TypeScript (TS) adds a static type system on top of JS, we say TS is a superset of JS. In fact, the essence of TS's type system is very simple, it consits of a set of built-in types and operations for type composition.

### Declaring types

* `type` a type alias that does not change
* `interface` a type that may be extended
* `class` a JS class type
* `enum` an enumeration

### [Built-in types](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html)

* `{}` indexed arrays aka 'objects'
* `[]` arrays and tuples
* `() => T` functions
* `string`, `number`, `boolean`, `bigint`, `symbol`, `undefined`, `null` primitive types
* `'abc'`, `1`, `true`, ... literal types
* `void` absence of any type
* `any`, `unknown`, `never` universal types

### Universal types

`any` and `unknown` are both at the top of the type hierarchy, every type extends them. Informally, they can be seen as union of all possible types. However, technically they are no union types.

`unknown` is the neutral element of the type intersection `&` operation.

```ts
A & unknown = A
A & any = any
```

`any` and `unknown` have different meanings. `any` is treated as any type to make the compiler happy at the cost of opting-out of type checking. `unknown` is similar to `any` while staying type-safe.

`never` is at the bottom of the type hierarchy, it can be seen as subtype of all existing types, a type that will never occur.

`never` is the empty union and the neutral element of the type union `|` operation.

```ts
A | never = A
```

Hint on matching objects:

* `Record<PropertyType, unknown>` matches indexed arrays
* `Record<PropertyType, any>` matches all types with an index structure, like objects, arrays, functions, interfaces and classes

### Composing Types

[Union and intersection](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#union-types):

* `T | U` union type, neutral element `never` (the "empty union")
* `T & U` intersection type, neutral element `unknown`

[Derive types from types](https://www.typescriptlang.org/docs/handbook/2/types-from-types.html):

* `T<U>` [generic type](https://www.typescriptlang.org/docs/handbook/2/generics.html)
* `keyof T` [keyof operator](https://www.typescriptlang.org/docs/handbook/2/keyof-types.html)
* `T['prop']` [indexed access type](https://www.typescriptlang.org/docs/handbook/2/indexed-access-types.html)
* `` `..${T}..` ``</code> [template literal type](https://www.typescriptlang.org/docs/handbook/2/template-literal-types.html)
* `{ [K in keyof T]: U }` [mapped type](https://www.typescriptlang.org/docs/handbook/2/mapped-types.html)
* `T extends U ? V : W` [conditional type](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html)
* `T extends infer U ? V : W` [inferred type]()

_Note: [`typeof`](https://www.typescriptlang.org/docs/handbook/2/typeof-types.html) was intentionally not mentioned because it does not operate on the type level._

### Type Distribution

One of the most important concepts in TS is the [distribution of union types over conditional types](https://www.typescriptlang.org/docs/handbook/2/conditional-types.html#distributive-conditional-types).

_This [Stack Overflow answer](https://stackoverflow.com/questions/62084836/what-does-it-mean-for-a-type-to-distribute-over-unions) by [Karol Majewski
](https://stackoverflow.com/users/10325032/karol-majewski) describes it best:_

> The term _distributive_ refers to how union types should be treated when subjected to type-level operations (such as `keyof` or mapped types).
>
> * **Non-distributive (default)** operations are applied to properties that exist on every member of the union.
> * **Distributive** operations are applied to _all members_ of the union separately.
>
> Let's use an example.
>
> ```ts
> type Fruit =
>   | { species: 'banana', curvature: number }
>   | { species: 'apple', color: string }
> ```
>
> Let's assume that, for some reason, you want to know all possible keys that can exist on a `Fruit`.
>
> **Non-distributive**
>
> Your intuition may tell you to do:
>
> ```ts
> type KeyOfFruit = keyof Fruit; // "species"
> ```
>
> However, this will give you only the properties that exist on every member of the union. In our example, `species` is the only common property shared by all `Fruit`.
>
> It's the same as applying `keyof` to the union of the two types.
>
> ```ts
> keyof ({ species: 'banana', curvature: number } | { species: 'apple', color: string })
> ```
>
> **Distributive**
>
> With distribution, the operation is not performed on _just_ the common properties. Instead, it is done on _every member of the union separately_. The results are then added together.
>
> ```ts
> type DistributedKeyOf<T> =
>   T extends any
>     ? keyof T
>     : never
>
> type KeyOfFruit = DistributedKeyOf<Fruit>; // "species" | "curvature" | "color"
> ```
>
> In this case, TypeScript applied `keyof` to each member of the union, and summed the results.
>
> ```ts
> keyof { species: 'banana', curvature: number } | keyof { species: 'apple', color: string }
> ```

