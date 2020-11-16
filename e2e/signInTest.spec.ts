import { by, element, expect, device } from "detox"
import { APISignUpMentee, APISignUpMentor, APIDeleteAccounts, scrollDownAndTap, waitAndTypeText } from './helpers'

const accountFixtures = require('./fixtures/accounts.json')


describe('SignIn', () => {
    beforeEach(async () => {
        await APIDeleteAccounts();
        await device.reloadReactNative();
    })

    it('mentee succesfully', async () => {
        const mentee = accountFixtures.mentees[0];
        APISignUpMentee(mentee);

        await scrollDownAndTap('onboarding.welcome.button', 'onboarding.welcome.view');
        await scrollDownAndTap('onboarding.mentorlist.start', 'onboarding.mentorlist.view');
        await scrollDownAndTap('onboarding.sign.in', 'onboarding.mentorlist.view');

        await waitAndTypeText('onboarding.signUp.nickName', mentee.loginName + "\n");
        await waitAndTypeText('onboarding.signUp.password', mentee.password + "\n");

        await device.disableSynchronization();
        await scrollDownAndTap('onboarding.signUp.button', 'onboarding.signUp.view');
        await scrollDownAndTap('onboarding.selectTopic.skip', 'onboarding.selectTopic.view');

        await element(by.id('tabs.settings')).tap();
        await expect(element(by.id('main.settings.account.userName'))).toHaveText(mentee.loginName);
        await expect(element(by.id('main.settings.account.nickName'))).toHaveText(mentee.displayName);
        await expect(element(by.id('main.settings.account.email'))).toHaveText(mentee.email);
    });
});
