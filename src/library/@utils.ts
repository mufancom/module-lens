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
  let nextDirName = from;

  while (true) {
    let currentDirName = nextDirName;

    let searchPath = Path.join(currentDirName, searchName);

    let stats: FS.Stats | undefined;

    try {
      stats = FS.statSync(searchPath);
    } catch (error) {}

    if (stats && (!filter || filter(searchPath, stats))) {
      return currentDirName;
    }

    nextDirName = Path.dirname(currentDirName);

    if (nextDirName === currentDirName) {
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
