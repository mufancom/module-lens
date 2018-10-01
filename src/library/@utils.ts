import * as FS from 'fs';
import * as Path from 'path';

export type SearchFilter = (path: string, stats: FS.Stats) => boolean;

export const isFileSearchFilter: SearchFilter = (_path, stats) =>
  stats.isFile();

export const isDirectorySearchFilter: SearchFilter = (_path, stats) =>
  stats.isDirectory();

export function searchUpperDir(
  from: string,
  searchName: string,
  filter?: SearchFilter,
): string | undefined {
  let nextDir = from;

  while (true) {
    let currentDir = nextDir;

    let searchPath = Path.join(currentDir, searchName);

    let stats: FS.Stats | undefined;

    try {
      stats = FS.statSync(searchPath);
    } catch (error) {}

    if (stats && (!filter || filter(searchPath, stats))) {
      return currentDir;
    }

    nextDir = Path.dirname(currentDir);

    if (nextDir === currentDir) {
      return undefined;
    }
  }
}

export function gentleStat(path: string): FS.Stats | undefined {
  try {
    return FS.statSync(path);
  } catch (error) {
    return undefined;
  }
}
