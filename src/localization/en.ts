/*eslint sort-keys: "error"*/
export const messages = {
  'buddyList.title': 'Chats',

  'components.appTitle.subTitle': 'MentorApp',
  'components.appTitle.title': 'Ylitse',

  'components.createdBySosBanner': 'Brought to you by SOS-lapsikylä',

  'components.mentorCard.readMore': 'Read more',
  'components.mentorCard.showMore': 'Show more...',
  'components.mentorCard.yearsAbbrev': 'y.',

  'components.mentorSkills.title': 'I can help with',
  'components.mentorStory.title': 'About me',

  'components.remoteData.loading': 'Loading...',
  'components.remoteData.loadingFailed': 'Loading failed',
  'components.remoteData.retry': 'Try again',

  'main.mentorCardExpanded.button': 'Chat',
  'main.mentorList.title': 'Mentors',

  'onboarding.mentorlist.lowerTitle': 'Mentors',
  'onboarding.mentorlist.start': 'Get started',
  'onboarding.mentorlist.upperTitle': 'Meet our',

  'onboarding.signIn.button': 'Login',
  'onboarding.signIn.failure': 'Kirjautumien epäonnistui',
  'onboarding.signIn.title': 'Login',

  'onboarding.signUp.back': 'Back',
  'onboarding.signUp.errorMessageId': 'Käyttäjänimi on varattu',
  'onboarding.signUp.existingAccount.login': 'Kirjaudu sisään',
  'onboarding.signUp.existingAccount.title': 'Minulla on jo tunnus',
  'onboarding.signUp.nickName': 'Nickname',
  'onboarding.signUp.password': 'Password',
  'onboarding.signUp.signUp': 'Sign up',
  'onboarding.signUp.title': 'Sign up',
};

export type MessageId = keyof typeof messages;
