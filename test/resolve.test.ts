import * as Path from 'path';

import {ResolveOptions, resolve} from '../bld/library';

test('Should resolve basic module specifier', () => {
  shouldAlwaysResolve(__dirname, {
    sourceFileName: __filename,
  });
});

test('Should resolve module specifier using base url', () => {
  let projectDirName = Path.join(__dirname, 'samples/project-a');
  let sourceFileName = Path.join(projectDirName, 'pia/hia.ts');
  let sourceDirName = Path.dirname(sourceFileName);

  let options: ResolveOptions = {
    baseUrlDirName: projectDirName,
    sourceFileName,
  };

  expect(resolve('foo', options)).toBe(Path.join(projectDirName, 'foo'));
  expect(resolve('foo.ts', options)).toBe(Path.join(projectDirName, 'foo.ts'));

  expect(resolve('bar', options)).toBe(Path.join(projectDirName, 'bar'));
  expect(resolve('bar/ha', options)).toBe(Path.join(projectDirName, 'bar/ha'));

  shouldAlwaysResolve(sourceDirName, options);
});

test('Should resolve module specifier with node_modules', () => {
  let projectDirName = Path.join(__dirname, 'samples/project-b');
  let sourceFileName = Path.join(projectDirName, 'abc/def.ts');
  let sourceDirName = Path.dirname(sourceFileName);

  let options: ResolveOptions = {
    baseUrlDirName: projectDirName,
    sourceFileName,
  };

  expect(resolve('foo', options)).toBe(
    Path.join(projectDirName, 'node_modules/foo'),
  );
  expect(resolve('foo/abc', options)).toBe(
    Path.join(projectDirName, 'node_modules/foo/abc'),
  );

  expect(resolve('bar', options)).toBeUndefined();
  expect(resolve('bar/def', options)).toBeUndefined();

  shouldAlwaysResolve(sourceDirName, options);
});

test('Should resolve module specifier with multi-level node_modules', () => {
  let projectDirName = Path.join(__dirname, 'samples/project-b');
  let sourceFileName = Path.join(projectDirName, 'yoha/abc/def.ts');
  let sourceDirName = Path.dirname(sourceFileName);

  let options: ResolveOptions = {
    sourceFileName,
  };

  expect(resolve('foo', options)).toBe(
    Path.join(projectDirName, 'yoha/node_modules/foo'),
  );
  expect(resolve('foo/abc', options)).toBe(
    Path.join(projectDirName, 'yoha/node_modules/foo/abc'),
  );
  expect(resolve('@scope/abc', options)).toBe(
    Path.join(projectDirName, 'yoha/node_modules/@scope/abc'),
  );
  expect(resolve('@scope/def', options)).toBe(
    Path.join(projectDirName, 'node_modules/@scope/def'),
  );

  expect(resolve('pia', options)).toBe(
    Path.join(projectDirName, 'yoha/node_modules/pia'),
  );
  expect(resolve('pia/abc', options)).toBe(
    Path.join(projectDirName, 'yoha/node_modules/pia/abc'),
  );

  shouldAlwaysResolve(sourceDirName, options);
});

test('Should resolve module specifier using base url and with node_modules', () => {
  let projectDirName = Path.join(__dirname, 'samples/project-c');
  let baseUrlDirName = Path.join(projectDirName, 'base');
  let sourceFileName = Path.join(baseUrlDirName, 'test.ts');
  let sourceDirName = Path.dirname(sourceFileName);

  let options: ResolveOptions = {
    baseUrlDirName,
    sourceFileName,
  };

  expect(resolve('foo', options)).toBe(Path.join(baseUrlDirName, 'foo'));
  expect(resolve('foo/abc', options)).toBe(
    Path.join(projectDirName, 'node_modules/foo/abc'),
  );

  expect(resolve('bar', options)).toBe(Path.join(baseUrlDirName, 'bar'));
  expect(resolve('bar/abc', options)).toBe(
    Path.join(baseUrlDirName, 'bar/abc'),
  );

  expect(resolve('abc', options)).toBe(
    Path.join(projectDirName, 'node_modules/abc'),
  );
  expect(resolve('abc/def', options)).toBe(
    Path.join(projectDirName, 'node_modules/abc/def'),
  );

  shouldAlwaysResolve(sourceDirName, options);
});

function shouldAlwaysResolve(
  sourceDirName: string,
  options: ResolveOptions,
): void {
  expect(resolve('fs', options)).toBe('fs');
  expect(resolve('path', options)).toBe('path');

  expect(resolve('/foo/bar', options)).toBe(Path.resolve('/foo/bar'));
  expect(resolve('/foo', options)).toBe(Path.resolve('/foo'));

  expect(resolve('./foo/bar', options)).toBe(
    Path.join(sourceDirName, 'foo/bar'),
  );
  expect(resolve('./foo', options)).toBe(Path.join(sourceDirName, 'foo'));

  expect(resolve('../pia/hia', options)).toBe(
    Path.join(sourceDirName, '../pia/hia'),
  );
  expect(resolve('../pia', options)).toBe(Path.join(sourceDirName, '../pia'));
}
