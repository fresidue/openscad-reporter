
import assert from 'assert';
import { describe, test } from 'vitest';

import { condenseJson } from '../src/utils';


describe('json-condenser.test ()', () => {

  const data = {
    a: [1, 2],
    b: [1, null],
    c: [1, 'asdf'],
    d: [1, []],
    e: [1, {}],
    f: [1, [2, 3]],
    final: [1, 0, -.34, 2.3445],
  }
  const prettyJson = JSON.stringify(data, null, 2);

  test('check prettyJson default string', () => {
    const expectedPrettyJson =
`{
  "a": [
    1,
    2
  ],
  "b": [
    1,
    null
  ],
  "c": [
    1,
    "asdf"
  ],
  "d": [
    1,
    []
  ],
  "e": [
    1,
    {}
  ],
  "f": [
    1,
    [
      2,
      3
    ]
  ],
  "final": [
    1,
    0,
    -0.34,
    2.3445
  ]
}`
    assert.strictEqual(prettyJson, expectedPrettyJson);
  });

  const condensedJson = condenseJson(prettyJson);
  test('check condensedJson', () => {
    const expectedCondensedJson =
`{
  "a": [1, 2],
  "b": [1, null],
  "c": [1, "asdf"],
  "d": [
    1,
    []
  ],
  "e": [
    1,
    {}
  ],
  "f": [
    1,
    [2, 3]
  ],
  "final": [1, 0, -0.34, 2.3445]
}`
    assert.strictEqual(condensedJson, expectedCondensedJson);
    assert.deepStrictEqual(data, JSON.parse(condensedJson));
  }); 

});
