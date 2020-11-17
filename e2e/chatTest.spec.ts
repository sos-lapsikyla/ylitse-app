import { by, element, expect, device } from "detox"
import { APISignUpMentee, APISignUpMentor, APIDeleteAccounts, scrollDownAndTap, waitAndTypeText, signIn } from './helpers'

const accountFixtures = require('./fixtures/accounts.json')


describe('Chat', () => {
    beforeEach(async () => {
        await APIDeleteAccounts();
        await device.reloadReactNative();
        await device.disableSynchronization();
    })

    it('with new mentor', async () => {
        const mentee = accountFixtures.mentees[0];
        await APISignUpMentee(mentee);
        const mentor = accountFixtures.mentors[0];
        await APISignUpMentor(mentor);

        await signIn(mentee);
        await scrollDownAndTap('onboarding.selectTopic.skip', 'onboarding.selectTopic.view');

        await element(by.text('Read more')).tap();
        await element(by.text('Chat')).tap();

        await waitAndTypeText('main.chat.input.input', "Hi!");
        await element(by.id('main.chat.input.button')).tap();

        // TODO: what to expect
        // await expect(element(by.text('Hi from mentee!'))).toBeVisible();
        
        // Logout the fast style
        await device.uninstallApp();    
        await device.installApp();    
        await device.launchApp({newInstance: true});
        await device.disableSynchronization();

        await signIn(mentor);
        await scrollDownAndTap('onboarding.selectTopic.skip', 'onboarding.selectTopic.view');
        await element(by.id('tabs.chats')).tap();

        await element(by.text(mentee.displayName)).tap();

        await waitAndTypeText('main.chat.input.input', "Hello!");
        await element(by.id('main.chat.input.button')).tap();

        // Logout the fast style
        await device.uninstallApp();    
        await device.installApp();    
        await device.launchApp({newInstance: true});
        await device.disableSynchronization();

        await signIn(mentee);
        await scrollDownAndTap('onboarding.selectTopic.skip', 'onboarding.selectTopic.view');

        await element(by.id('tabs.chats')).tap();
        await element(by.text(mentor.displayName)).tap();

        //TODO: expect something
    });
});
