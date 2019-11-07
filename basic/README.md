# Basic JS (TypeScript) functions

This repo implements some basic/auxiliary/helper Javascript (Typescript) code.

## Installation

```bash
yarn add @cpmech/basic
```

## Example

```ts
import { camelize } from '@cpmech/basic';
console.log(camelize('dorival_pedroso'));
// dorivalPedroso
```

## Using Locales

Directory structure

```
src/locale
  |_ en.ts
  |_ index.ts
  |_ pt.ts
```

English definitions

```ts
// en.ts
export const en = {
  signIn: {
    title: 'Sign In',
  },
};
```

Portuguese definitions

```ts
// pt.ts
export const pt = {
  signIn: {
    title: 'Entrar',
  },
};
```

Main file

```ts
// index.ts
import { Locales } from '@cpmech/basic';
import { en } from './en';
import { pt } from './pt';

const res = {
  en,
  pt,
};

const loc = new Locales(res, 'pt', 'br');

export const t = loc.translate;
```

Usage

```ts
import { t } from 'locale';

console.log(t('signIn.title'));
// Entrar
```
