describe('Mentor', () => {
    beforeEach(async () => {
      await device.reloadReactNative();
    });

    it('can login', async () => {

      // Detox will wait forever after tapping login button without this
      await device.disableSynchronization();
      
      await expect(element(by.text('Hello!'))).toBeVisible();
      await element(by.id('welcomeScrollView')).scrollTo('bottom');

      await element(by.text('Start')).tap();
      await element(by.text('Get started')).tap();
      await element(by.text('Sign in')).tap();
      await element(by.id('onboarding.signUp.nickName')).typeText('mentor'+"\n");

      await waitFor(element(by.id('onboarding.signUp.password'))).toBeVisible().withTimeout(5000);
      await element(by.id('onboarding.signUp.password')).typeText('mentormentor'+"\n");
      await element(by.id('loginCard')).scrollTo('bottom');
      await waitFor(element(by.id('onboarding.signUp.loginButton'))).toBeVisible().withTimeout(5000);
      await element(by.id('onboarding.signUp.loginButton')).tap();

      await expect(element(by.text('Choose topic'))).toBeVisible();
    });

  });
  