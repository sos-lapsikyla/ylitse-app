import { by, element, expect, device } from "detox"
import { APISignUpMentee, scrollDownTo, APIDeleteAccounts, scrollDownAndTap, waitAndTypeText, signIn } from './helpers'

const accountFixtures = require('./fixtures/accounts.json')


describe('Delete account', () => {
    beforeEach(async () => {
        await APIDeleteAccounts();
        await device.reloadReactNative();
        await device.disableSynchronization();
    })

    it('for a mentee succesfully', async () => {
        const mentee = accountFixtures.mentees[0];
        APISignUpMentee(mentee);

        await signIn(mentee);
        await scrollDownAndTap('onboarding.selectTopic.skip', 'onboarding.selectTopic.view');

        await element(by.id('tabs.settings')).tap();

        // TODO: why cannot scroll normally
        // await element(by.id('main.settings.index.view')).scrollTo('bottom'); 
        await element(by.id('main.settings.account.userName')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');

        await scrollDownAndTap('main.settings.other.button.deleteAccount', 'main.settings.index.view');

        await scrollDownAndTap('main.settings.deleteAccount.deleteAccount', 'main.settings.deleteAccount.view');

        await device.reloadReactNative();
        await signIn(mentee);
        
        await expect(element(by.id('components.loginCard.errorMessage'))).toHaveText('Kirjautuminen epäonnistui');
    });

    it('can be cancelled', async () => {
        const mentee = accountFixtures.mentees[0];
        APISignUpMentee(mentee);

        await signIn(mentee);
        await scrollDownAndTap('onboarding.selectTopic.skip', 'onboarding.selectTopic.view');

        await element(by.id('tabs.settings')).tap();

        // TODO: why cannot scroll normally
        // await element(by.id('main.settings.index.view')).scrollTo('bottom'); 
        await element(by.id('main.settings.account.userName')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');
        await element(by.id('main.settings.account.password.button')).swipe('up');

        await scrollDownAndTap('main.settings.other.button.deleteAccount', 'main.settings.index.view');

        await scrollDownAndTap('main.settings.deleteAccount.cancel', 'main.settings.deleteAccount.view');

        await expect(element(by.id('main.settings.other.button.deleteAccount'))).toBeVisible();
    });
});
