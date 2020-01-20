/*eslint sort-keys: "error"*/
export const messages = {
  'components.mentorCard.aboutMe': 'About me',
  'components.mentorCard.iCanHelp': 'I can help with',
  'components.mentorCard.yearsAbbrev': 'y.',

  'components.remoteData.loading': 'Loading...',
  'components.remoteData.loadingFailed': 'Loading failed',
  'components.remoteData.retry': 'Try again',

  'onboarding.mentorlist.banner': 'Brought to you by SOS-lapsikylä',
  'onboarding.mentorlist.lowerTitle': 'Mentors',
  'onboarding.mentorlist.start': 'Get started',
  'onboarding.mentorlist.upperTitle': 'Meet our',

  'onboarding.signUp.back': 'Back',
  'onboarding.signUp.nickName': 'Nickname',
  'onboarding.signUp.password': 'Password',
  'onboarding.signUp.signUp': 'Sign up',
  'onboarding.signUp.title': 'Sign up',
};

export type MessageId = keyof typeof messages;
