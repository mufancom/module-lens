import * as Path from 'path';

export interface BuildOptions {
  sourceFileName: string;
  baseUrlDirName?: string;
}

export function build(
  path: string,
  {sourceFileName, baseUrlDirName}: BuildOptions,
): string {
  let sourceDirName = Path.dirname(sourceFileName);

  let relativePath: string;

  if (typeof baseUrlDirName === 'string') {
    relativePath = Path.relative(baseUrlDirName, path);

    if (!/^\.\.[\\/]/.test(relativePath)) {
      return format(relativePath, false);
    }
  }

  relativePath = Path.relative(sourceDirName, path);

  return format(relativePath, true);
}

export function format(path: string, dotSlashPrefix: boolean): string {
  path = path.replace(/\\/g, '/');

  if (dotSlashPrefix && !/^\.{0,2}\//.test(path)) {
    path = `./${path}`;
  }

  return path;
}
