import { right, left } from 'fp-ts/lib/Either';

import * as validators from '../validators';

import { describe, expect, it } from '@jest/globals';

describe('unixTimeFromDateString', () => {
  it('decodes js date iso string', () => {
    const s = '2020-01-16T10:29:32.350430';
    expect(validators.unixTimeFromDateString.decode(s)).toEqual(
      right(new Date(s).getTime()),
    );
  });
  it('fails to decode random string', () => {
    expect(validators.unixTimeFromDateString.decode('foo')).toEqual(
      left(expect.any(Array)),
    );
  });
});
