import Module from 'module';
import * as Path from 'path';

import {gentleStat, isDirectorySearchFilter, searchUpperDir} from './@utils';

const BUILT_IN_MODULE_NAME_SET = new Set(
  Module.builtinModules || Object.keys((process as any).binding('natives')),
);

export interface ResolveOptions {
  sourceFileName: string;
  baseUrlDir?: string;
  extensions?: string[];
}

export type ResolveCategory =
  | 'built-in'
  | 'absolute'
  | 'relative'
  | 'base-url'
  | 'node-modules'
  | 'none';

export interface ResolveWithCategoryResult {
  category: ResolveCategory;
  path: string | undefined;
}

export function resolveWithCategory(
  specifier: string,
  {
    sourceFileName,
    baseUrlDir,
    extensions = ['.js', '.jsx', '.ts', '.tsx'],
  }: ResolveOptions,
): ResolveWithCategoryResult {
  if (isNodeBuiltIn(specifier)) {
    return {
      category: 'built-in',
      path: specifier,
    };
  }

  if (/^\//.test(specifier)) {
    return {
      category: 'absolute',
      path: Path.resolve(specifier),
    };
  }

  if (/^\.{1,2}\//.test(specifier)) {
    return {
      category: 'relative',
      path: Path.join(Path.dirname(sourceFileName), specifier),
    };
  }

  let [specifierFirstFragment] = /^[^/]+/.exec(
    specifier,
  ) || /* istanbul ignore next */ [undefined];

  /* istanbul ignore if */
  if (!specifierFirstFragment) {
    return {
      category: 'none',
      path: undefined,
    };
  }

  if (baseUrlDir) {
    let usingBaseUrl = false;

    // First segment is exactly the whole specifier, possibly a file name.
    if (specifierFirstFragment === specifier) {
      usingBaseUrl = ['', ...extensions].some(extension => {
        let possiblePathUsingBaseUrl = Path.join(
          baseUrlDir,
          `${specifier}${extension}`,
        );

        let possiblePathStats = gentleStat(possiblePathUsingBaseUrl);

        return !!possiblePathStats && possiblePathStats.isFile();
      });
    }

    if (!usingBaseUrl) {
      let possibleDirUsingBaseUrl = Path.join(
        baseUrlDir,
        specifierFirstFragment,
      );

      let possibleDirStats = gentleStat(possibleDirUsingBaseUrl);

      usingBaseUrl = !!possibleDirStats && possibleDirStats.isDirectory();
    }

    if (usingBaseUrl) {
      return {
        category: 'base-url',
        path: Path.join(baseUrlDir, specifier),
      };
    }
  }

  let nodeModulesParentDir = searchUpperDir(
    Path.dirname(sourceFileName),
    `node_modules/${specifierFirstFragment}`,
    isDirectorySearchFilter,
  );

  if (nodeModulesParentDir) {
    return {
      category: 'node-modules',
      path: Path.join(nodeModulesParentDir, 'node_modules', specifier),
    };
  }

  return {
    category: 'none',
    path: undefined,
  };
}

export function resolve(
  specifier: string,
  options: ResolveOptions,
): string | undefined {
  return resolveWithCategory(specifier, options).path;
}

export function isNodeBuiltIn(specifier: string): boolean {
  return BUILT_IN_MODULE_NAME_SET.has(specifier);
}
