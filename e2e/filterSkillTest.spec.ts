import { by, element, expect, waitFor } from 'detox';
import { describe, it, beforeEach, expect as jestExpect } from '@jest/globals';

import {
  APISignUpMentee,
  APIDeleteAccounts,
  APISignUpMentor,
  signIn,
  waitAndTypeText,
  forceLogout,
} from './helpers';

const accountFixtures = require('./fixtures/accounts.json');

describe('Skill filter', () => {
  beforeEach(async () => {
    await APIDeleteAccounts();
    await forceLogout();
  });

  it('show all mentors when nothing is selected', async () => {
    await APISignUpMentor(accountFixtures.mentors[0]);
    await APISignUpMentor(accountFixtures.mentors[1]);
    await APISignUpMentor(accountFixtures.mentors[2]);

    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    await signIn(mentee);

    await element(by.id('main.mentorsTitleAndSearchButton')).tap();

    await element(by.id('main.searchMentor.showButton')).tap();

    // Try to find a mentor from 3 possibilities. Swipe and repeat.
    // 3 mentors so we need 2 swipes.
    let mentorsFound = {
      [accountFixtures.mentors[0].displayName]: false,
      [accountFixtures.mentors[1].displayName]: false,
      [accountFixtures.mentors[2].displayName]: false,
    };
    const mentorIndexes = [0, 1, 2];
    for (let i in mentorIndexes) {
      try {
        await expect(
          element(by.text(accountFixtures.mentors[i].displayName)),
        ).toBeVisible();
        mentorsFound[accountFixtures.mentors[i].displayName] = true;
      } catch (error) {
        continue;
      }
    }

    await element(by.id('components.mentorList')).swipe('left', 'slow');

    for (let i in mentorIndexes) {
      try {
        await expect(
          element(by.text(accountFixtures.mentors[i].displayName)),
        ).toBeVisible();
        mentorsFound[accountFixtures.mentors[i].displayName] = true;
      } catch (error) {
        continue;
      }
    }

    await element(by.id('components.mentorList')).swipe('left', 'slow');

    for (let i in mentorIndexes) {
      try {
        await expect(
          element(by.text(accountFixtures.mentors[i].displayName)),
        ).toBeVisible();
        mentorsFound[accountFixtures.mentors[i].displayName] = true;
      } catch (error) {
        continue;
      }
    }
    const expectedMentors = {
      [accountFixtures.mentors[0].displayName]: true,
      [accountFixtures.mentors[1].displayName]: true,
      [accountFixtures.mentors[2].displayName]: true,
    };
    jestExpect(mentorsFound).toEqual(expectedMentors);
  });

  it('shows mentor with specific skill selected', async () => {
    await APISignUpMentor(accountFixtures.mentors[0]);
    await APISignUpMentor(accountFixtures.mentors[1]);
    await APISignUpMentor(accountFixtures.mentors[2]);

    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    await signIn(mentee);

    await element(by.id('main.mentorsTitleAndSearchButton')).tap();

    await element(
      by.text('kimble').withAncestor(by.id('main.searchMentor.skills.view')),
    ).tap();

    await element(by.id('main.searchMentor.showButton')).tap();
    await expect(
      element(by.text(accountFixtures.mentors[0].displayName)),
    ).toBeVisible();
  });

  it('shows skills that match the search term', async () => {
    await APISignUpMentor(accountFixtures.mentors[0]);
    await APISignUpMentor(accountFixtures.mentors[1]);
    await APISignUpMentor(accountFixtures.mentors[2]);

    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    await signIn(mentee);

    await element(by.id('main.mentorsTitleAndSearchButton')).tap();

    await waitAndTypeText('main.searchMentor.searchField', 'kim\n');

    await expect(
      element(
        by.text('kimble').withAncestor(by.id('main.searchMentor.skills.view')),
      ),
    ).toBeVisible();
    await expect(
      element(
        by.text('python').withAncestor(by.id('main.searchMentor.skills.view')),
      ),
    ).toBeNotVisible();
  });

  it('reset search shows all skills', async () => {
    await APISignUpMentor(accountFixtures.mentors[0]);
    await APISignUpMentor(accountFixtures.mentors[1]);
    await APISignUpMentor(accountFixtures.mentors[2]);

    const mentee = accountFixtures.mentees[0];
    await APISignUpMentee(mentee);
    await signIn(mentee);

    await element(by.id('main.mentorsTitleAndSearchButton')).tap();

    await waitAndTypeText('main.searchMentor.searchField', 'kim\n');

    await waitFor(element(by.id('main.searchMentor.resetButton')))
      .toBeVisible()
      .withTimeout(5000);

    await expect(
      element(
        by.text('kimble').withAncestor(by.id('main.searchMentor.skills.view')),
      ),
    ).toBeVisible();
    await expect(
      element(
        by.text('python').withAncestor(by.id('main.searchMentor.skills.view')),
      ),
    ).toBeNotVisible();

    await element(by.id('main.searchMentor.resetButton')).tap();

    await expect(
      element(
        by.text('kimble').withAncestor(by.id('main.searchMentor.skills.view')),
      ),
    ).toBeVisible();
    await expect(
      element(
        by.text('python').withAncestor(by.id('main.searchMentor.skills.view')),
      ),
    ).toBeVisible();
  });
});
