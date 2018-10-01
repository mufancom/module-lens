import * as Path from 'path';

import {ResolveOptions, resolve} from '../bld/library';

test('Should resolve basic module specifier', () => {
  shouldAlwaysResolve(__dirname, {
    sourceFileName: __filename,
  });
});

test('Should resolve module specifier using base url', () => {
  let projectDir = Path.join(__dirname, 'samples/project-a');
  let sourceFileName = Path.join(projectDir, 'pia/hia.ts');
  let sourceDir = Path.dirname(sourceFileName);

  let options: ResolveOptions = {
    baseUrlDir: projectDir,
    sourceFileName,
  };

  expect(resolve('foo', options)).toBe(Path.join(projectDir, 'foo'));
  expect(resolve('foo.ts', options)).toBe(Path.join(projectDir, 'foo.ts'));

  expect(resolve('bar', options)).toBe(Path.join(projectDir, 'bar'));
  expect(resolve('bar/ha', options)).toBe(Path.join(projectDir, 'bar/ha'));

  shouldAlwaysResolve(sourceDir, options);
});

test('Should resolve module specifier with node_modules', () => {
  let projectDir = Path.join(__dirname, 'samples/project-b');
  let sourceFileName = Path.join(projectDir, 'abc/def.ts');
  let sourceDir = Path.dirname(sourceFileName);

  let options: ResolveOptions = {
    baseUrlDir: projectDir,
    sourceFileName,
  };

  expect(resolve('foo', options)).toBe(
    Path.join(projectDir, 'node_modules/foo'),
  );
  expect(resolve('foo/abc', options)).toBe(
    Path.join(projectDir, 'node_modules/foo/abc'),
  );

  expect(resolve('bar', options)).toBeUndefined();
  expect(resolve('bar/def', options)).toBeUndefined();

  shouldAlwaysResolve(sourceDir, options);
});

test('Should resolve module specifier with multi-level node_modules', () => {
  let projectDir = Path.join(__dirname, 'samples/project-b');
  let sourceFileName = Path.join(projectDir, 'yoha/abc/def.ts');
  let sourceDir = Path.dirname(sourceFileName);

  let options: ResolveOptions = {
    sourceFileName,
  };

  expect(resolve('foo', options)).toBe(
    Path.join(projectDir, 'yoha/node_modules/foo'),
  );
  expect(resolve('foo/abc', options)).toBe(
    Path.join(projectDir, 'yoha/node_modules/foo/abc'),
  );

  expect(resolve('pia', options)).toBe(
    Path.join(projectDir, 'yoha/node_modules/pia'),
  );
  expect(resolve('pia/abc', options)).toBe(
    Path.join(projectDir, 'yoha/node_modules/pia/abc'),
  );

  shouldAlwaysResolve(sourceDir, options);
});

test('Should resolve module specifier using base url and with node_modules', () => {
  let projectDir = Path.join(__dirname, 'samples/project-c');
  let baseUrlDir = Path.join(projectDir, 'base');
  let sourceFileName = Path.join(baseUrlDir, 'test.ts');
  let sourceDir = Path.dirname(sourceFileName);

  let options: ResolveOptions = {
    baseUrlDir,
    sourceFileName,
  };

  expect(resolve('foo', options)).toBe(Path.join(baseUrlDir, 'foo'));
  expect(resolve('foo/abc', options)).toBe(
    Path.join(projectDir, 'node_modules/foo/abc'),
  );

  expect(resolve('bar', options)).toBe(Path.join(baseUrlDir, 'bar'));
  expect(resolve('bar/abc', options)).toBe(Path.join(baseUrlDir, 'bar/abc'));

  expect(resolve('abc', options)).toBe(
    Path.join(projectDir, 'node_modules/abc'),
  );
  expect(resolve('abc/def', options)).toBe(
    Path.join(projectDir, 'node_modules/abc/def'),
  );

  shouldAlwaysResolve(sourceDir, options);
});

function shouldAlwaysResolve(sourceDir: string, options: ResolveOptions): void {
  expect(resolve('fs', options)).toBe('fs');
  expect(resolve('path', options)).toBe('path');

  expect(resolve('/foo/bar', options)).toBe(Path.resolve('/foo/bar'));
  expect(resolve('/foo', options)).toBe(Path.resolve('/foo'));

  expect(resolve('./foo/bar', options)).toBe(Path.join(sourceDir, 'foo/bar'));
  expect(resolve('./foo', options)).toBe(Path.join(sourceDir, 'foo'));

  expect(resolve('../pia/hia', options)).toBe(
    Path.join(sourceDir, '../pia/hia'),
  );
  expect(resolve('../pia', options)).toBe(Path.join(sourceDir, '../pia'));
}
