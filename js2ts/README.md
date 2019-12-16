# js2ts - Converts Javascript objects to Typescript objects

v1.11.0

## Installation

```bash
yarn add @cpmech/js2ts
```

## Usage

```ts
import { any2type } from '@cpmech/js2ts';

interface Isubtype {
  p: string;
  q: { r: { s: number } };
}

interface Itype {
  alpha: string;
  beta: number;
  gamma: boolean;
  delta: Isubtype;
}

const reference: Itype = {
  alpha: '', // string
  beta: 0, // number
  gamma: false, // boolean
  delta: { p: '', q: { r: { s: 0 } } },
};

const myobjOk = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
  delta: { p: 'pval', q: { r: { s: 456 } } },
};

const myobjNotOk = {
  alpha: 'alpha',
  beta: 123,
  gamma: true,
  delta: { p: 'pval', q: { r: { s: '456' } } }, // '456' !== 456
};

const res1 = any2type(reference, myobjOk);
const res2 = any2type(reference, myobjNotOk);
console.log(res1, res1 === null);
console.log(res2, res2 === null);
```
