# Module Lens

## Installation

```sh
yarn add module-lens
```

## Usage

```ts
import {resolve} from 'module-lens';

let path = resolve('foo/bar', {
  sourceFileName: __filename,
  baseUrlDir: 'yoha',
});
```

## Difference from Package "resolve" by Browserify

The popular module resolving package [resolve](https://www.npmjs.com/package/resolve) resolves a module specifier to a file, and throws an error if not being able to resolve to the final entry point. The `resolve` of Module Lens, however, does only minimal checks to determine where should the specifier be resolved to.

Module Lens `resolve` does not resolve a specifier to the final entry point, for example:

```ts
// if we have module "rxjs" installed:
resolve('rxjs/not-exists', {sourceFileName: __filename}); // -> 'node_modules/rxjs/not-exists'
```

## License

MIT License.
