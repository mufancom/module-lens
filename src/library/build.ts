import * as Path from 'path';

export interface BuildOptions {
  sourceFileName: string;
  baseUrlDir?: string;
}

export function build(
  path: string,
  {sourceFileName, baseUrlDir}: BuildOptions,
): string {
  let sourceDir = Path.dirname(sourceFileName);

  let relativePath: string;

  if (typeof baseUrlDir === 'string') {
    relativePath = Path.relative(baseUrlDir, path);

    if (!/^\.\.[\\/]/.test(relativePath)) {
      return format(relativePath, false);
    }
  }

  relativePath = Path.relative(sourceDir, path);

  return format(relativePath, true);
}

export function format(path: string, dotSlashPrefix: boolean): string {
  path = path.replace(/\\/g, '/');

  if (dotSlashPrefix && !/^\.{0,2}\//.test(path)) {
    path = `./${path}`;
  }

  return path;
}
