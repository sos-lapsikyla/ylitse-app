describe('Detox', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
    });
    
    it('finds a word from first screen', async () => {
      await expect(element(by.text('Start'))).toBeVisible();
    });
});