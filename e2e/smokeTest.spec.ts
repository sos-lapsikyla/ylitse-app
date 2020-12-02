import { by, element, expect, device } from 'detox';
import { describe, it, beforeEach } from '@jest/globals';

describe('Detox', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('finds a word from first screen', async () => {
    await expect(element(by.text('Hello!'))).toBeVisible();
  });
});
