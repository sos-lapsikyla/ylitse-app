import { right, left } from 'fp-ts/lib/Either';

import * as validators from '../validators';

import { describe, expect, it } from '@jest/globals';

describe('unixTimeFromDateString', () => {
  const datimeTests = [
    { datetime: '2020-01-16T10:29:32.350430', expected: 1579170572350 }, // for backwards compatibility, assume UTC
    { datetime: '2020-01-16T10:29:32.350430Z', expected: 1579170572350 },
    { datetime: '2020-01-16T10:29:32.350430+00:00', expected: 1579170572350 },
    { datetime: '2020-01-16T10:29:32.350430-00:00', expected: 1579170572350 },
    { datetime: '2020-01-16T12:29:32.350430+02:00', expected: 1579170572350 }, // same as above but in different timezone
  ];
  for (const t of datimeTests) {
    it(`decodes js date iso string ${t.datetime}`, () => {
      expect(validators.unixTimeFromDateString.decode(t.datetime)).toEqual(
        right(t.expected),
      );
    });
  }

  it('fails to decode random string', () => {
    expect(validators.unixTimeFromDateString.decode('foo')).toEqual(
      left(expect.any(Array)),
    );
  });
});
