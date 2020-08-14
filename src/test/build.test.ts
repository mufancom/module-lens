import * as Path from 'path';

import {BuildOptions, build} from '../library';

test('Should build relative specifier', () => {
  let options: BuildOptions = {
    sourceFileName: __filename,
  };

  expect(build(Path.join(__dirname, 'foo'), options)).toBe('./foo');
  expect(build(Path.join(__dirname, '../foo'), options)).toBe('../foo');
});

test('Should build specifier using base url', () => {
  let sourceFileName = Path.join(__dirname, 'abc/def.ts');
  let baseUrlDirName = __dirname;

  let options: BuildOptions = {
    sourceFileName,
    baseUrlDirName,
  };

  expect(build(Path.join(baseUrlDirName, 'foo'), options)).toBe('foo');
  expect(build(Path.join(baseUrlDirName, 'foo/bar'), options)).toBe('foo/bar');
  expect(build(Path.join(baseUrlDirName, '../foo'), options)).toBe('../../foo');
});
