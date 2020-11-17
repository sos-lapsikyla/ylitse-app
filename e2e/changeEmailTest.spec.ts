import { by, element, expect, device } from "detox"
import { APISignUpMentee, APISignUpMentor, APIDeleteAccounts, scrollDownAndTap, waitAndTypeText, signIn } from './helpers'

const accountFixtures = require('./fixtures/accounts.json')


describe('changeEmail', () => {
    beforeEach(async () => {
        await APIDeleteAccounts();
        await device.reloadReactNative();
        await device.disableSynchronization();
    })

    it('for a mentee succesfully', async () => {
        const mentee = accountFixtures.mentees[0];
        const newEmail = "other@email.com"
        await APISignUpMentee(mentee);

        await signIn(mentee);
        await scrollDownAndTap('onboarding.selectTopic.skip', 'onboarding.selectTopic.view');

        await element(by.id('tabs.settings')).tap();
        await element(by.id('main.settings.account.email.change')).tap();

        await waitAndTypeText('main.settings.account.email.input', newEmail + "\n");
      
        await element(by.id('main.settings.account.email.save')).tap();
        await expect(element(by.text(newEmail))).toBeVisible();
    });
});
