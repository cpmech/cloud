# Tools for managing Environment Variables

This package implements code for managing environment variables

## Installation

```bash
yarn add @cpmech/envars
```

## Example

```ts
import { initEnvars } from '@cpmech/envars';

const envars = {
  APP_NAME: '',
};

// load APP_NAME from process.env
initEnvars(envars);
```
