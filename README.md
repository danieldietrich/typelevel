<div id="typelevel-logo" align="center">
  <a href="https://github.com/danieldietrich/typelevel">
    <img alt="Typelevel Logo" width="450" src="https://user-images.githubusercontent.com/743833/196013156-9158e0d0-93eb-4615-a29c-dec51513a37b.png">
  </a>
  <h3>
    Lift your code to the next level.
  </h3>
</div>

<br/>
<br/>

<div id="badges" align="center">

[![npm version](https://img.shields.io/npm/v/typescript-typelevel?logo=npm&style=flat-square)](https://www.npmjs.com/package/typescript-typelevel/)
[![build](https://img.shields.io/github/workflow/status/danieldietrich/typelevel/Test/main?logo=github&style=flat-square)](https://github.com/danieldietrich/typelevel/actions/workflows/test.yml)
[![Gitpod ready-to-code](https://img.shields.io/badge/Gitpod-ready--to--code-blue?logo=gitpod&style=flat-square)](https://gitpod.io/#https://github.com/danieldietrich/typelevel)

</div>

<br/>
<br/>

**TypeLevel** shifts the work from the TypeScript runtime to the compiler. **TypeLevel** provides a highly composable type level language and tests at compile time. Developers benefit from faster page loads and reduced provider costs when compiling their code to JS.

## Usage

Install **TypeLevel**

```sh
npm i -D typescript-typelevel
```

Start to code

```ts
import TypeLevel from 'typescript-typelevel';

type Hi<T extends string> = `Hi ${T}!`;

assertType<Extends<Hi<'TypeLevel'>, string>>();
```

Learn more about [typelevel.io](https://typelevel.io).
