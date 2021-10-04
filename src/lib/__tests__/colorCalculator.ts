import * as colorCalculator from '../colorCalculator';

import { describe, expect, it } from '@jest/globals';

describe('colorCalculator', () => {
  it('calculates average from two colors', () => {
    const white = '#FFFFFF';
    const black = '#000000';
    const average = '#808080';

    const calculated = colorCalculator.createMiddleColorAsHex([white, black]);
    expect(average).toEqual(calculated);
  });

  it('turns invalid hexString to black, and calculates average from it', () => {
    const invalidHex = '#NotAHex!!';
    const white = '#FFFFFF';
    const average = '#808080';

    const calculated = colorCalculator.createMiddleColorAsHex([
      white,
      invalidHex,
    ]);
    expect(average).toEqual(calculated);
  });
});
