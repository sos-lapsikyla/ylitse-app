import { by, element, expect, device } from "detox"
import { APISignUpMentee, scrollDownTo, APIDeleteAccounts, scrollDownAndTap, APISignUpMentor, signIn } from './helpers'

const accountFixtures = require('./fixtures/accounts.json')

describe('Browse mentors', () => {
    beforeEach(async () => {
        await APIDeleteAccounts();
        await device.reloadReactNative();
        await device.disableSynchronization();
    })

    it('without login', async () => {
        await APISignUpMentor(accountFixtures.mentors[0]);
        await APISignUpMentor(accountFixtures.mentors[1]);
        await APISignUpMentor(accountFixtures.mentors[2]);

        await scrollDownAndTap('onboarding.welcome.button', 'onboarding.welcome.view');

        await expect(element(by.id('components.mentorList'))).toBeVisible();
        await element(by.id('components.mentorList')).swipe('left');
        await element(by.id('components.mentorList')).swipe('left');

        // TODO: what to match here
        await expect(element(by.id('components.mentorList'))).toBeVisible();
    });

    it('after login', async () => {
        const mentor1 = accountFixtures.mentors[0];
        await APISignUpMentor(mentor1);

        const mentee = accountFixtures.mentees[0];
        await APISignUpMentee(mentee);
        await signIn(mentee);
        await scrollDownAndTap('onboarding.selectTopic.skip', 'onboarding.selectTopic.view');
        
        await expect(element(by.text(mentor1.displayName))).toBeVisible();
        await element(by.text("Read more")).tap();
        await element(by.id("components.mentorTitle.chevronLeft")).tap();

        await expect(element(by.id('components.mentorList'))).toBeVisible();
    });

});
