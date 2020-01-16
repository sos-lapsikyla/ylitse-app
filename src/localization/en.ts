/*eslint sort-keys: "error"*/
export const messages = {
  'components.mentorCard.aboutMe': 'About me',
  'components.mentorCard.iCanHelp': 'I can help with',
  'components.mentorCard.yearsAbbrev': 'y.',
  'onboarding.mentorlist.banner': 'Brought to you by SOS-lapsikylä',
  'onboarding.mentorlist.lowerTitle': 'Mentors',
  'onboarding.mentorlist.start': 'Get started',
  'onboarding.mentorlist.upperTitle': 'Meet our',
};

export type MessageId = keyof typeof messages;
