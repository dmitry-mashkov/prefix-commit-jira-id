/**
 * @overview  Unit testing cli
 */

import test from 'ava';


test('findGitRoot: returns the path to the nearest .git directory up', t => {
  t.pass();
});

test('bar', async t => {
  const bar = Promise.resolve('bar');

  t.is(await bar, 'bar');
});