import Module from 'module';
import * as Path from 'path';

import {gentleStat, isDirectorySearchFilter, searchUpperDir} from './@utils';

const BUILT_IN_MODULE_NAME_SET = new Set(Module.builtinModules);

export interface ResolveOptions {
  sourceFileName: string;
  baseUrlDir?: string;
  extensions?: string[];
}

export function resolve(
  specifier: string,
  {
    sourceFileName,
    baseUrlDir,
    extensions = ['.js', '.jsx', '.ts', '.tsx'],
  }: ResolveOptions,
): string | undefined {
  if (isNodeBuiltIn(specifier)) {
    return specifier;
  }

  if (/^\//.test(specifier)) {
    return Path.resolve(specifier);
  }

  let sourceDir = Path.dirname(sourceFileName);

  if (/^\.{1,2}\//.test(specifier)) {
    return Path.join(sourceDir, specifier);
  }

  let [specifierFirstFragment] = /^[^/]+/.exec(
    specifier,
  ) || /* istanbul ignore next */ [undefined];

  /* istanbul ignore if */
  if (!specifierFirstFragment) {
    return undefined;
  }

  if (baseUrlDir) {
    if (specifierFirstFragment === specifier) {
      for (let extension of ['', ...extensions]) {
        let possiblePathUsingBaseUrl = Path.join(
          baseUrlDir,
          `${specifier}${extension}`,
        );

        let possiblePathStats = gentleStat(possiblePathUsingBaseUrl);

        if (possiblePathStats && possiblePathStats.isFile()) {
          return Path.join(baseUrlDir, specifier);
        }
      }
    }

    let possibleDirUsingBaseUrl = Path.join(baseUrlDir, specifierFirstFragment);

    let possibleDirStats = gentleStat(possibleDirUsingBaseUrl);

    if (possibleDirStats && possibleDirStats.isDirectory()) {
      return Path.join(baseUrlDir, specifier);
    }
  }

  let nodeModulesParentDir = searchUpperDir(
    sourceDir,
    `node_modules/${specifierFirstFragment}`,
    isDirectorySearchFilter,
  );

  if (nodeModulesParentDir) {
    return Path.join(nodeModulesParentDir, 'node_modules', specifier);
  }

  return undefined;
}

export function isNodeBuiltIn(specifier: string): boolean {
  return BUILT_IN_MODULE_NAME_SET.has(specifier);
}
