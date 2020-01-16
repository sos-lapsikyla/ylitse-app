/*eslint sort-keys: "error"*/
export const messages = {
  'components.mentorCard.aboutMe': 'Tietoja minusta',
  'components.mentorCard.iCanHelp': 'Voin auttaa',
  'components.mentorCard.yearsAbbrev': 'v.',

  'components.remoteData.loading': 'Ladataan...',

  'onboarding.mentorlist.banner': 'Palvelun tarjoaa SOS-lapsikylä',
  'onboarding.mentorlist.lowerTitle': 'Mentorimme',
  'onboarding.mentorlist.start': 'Aloita',
  'onboarding.mentorlist.upperTitle': 'Tapaa',
};

export type MessageId = keyof typeof messages;
