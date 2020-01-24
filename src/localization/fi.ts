/*eslint sort-keys: "error"*/
export const messages = {
  'components.appTitle.subTitle': 'MentorApp',
  'components.appTitle.title': 'Ylitse',

  'components.createdBySosBanner': 'Palvelun tarjoaa SOS-lapsikylä',

  'components.mentorCard.aboutMe': 'Tietoja minusta',
  'components.mentorCard.iCanHelp': 'Voin auttaa',
  'components.mentorCard.showMore': 'Näytä lisää...',
  'components.mentorCard.yearsAbbrev': 'v.',

  'components.remoteData.loading': 'Ladataan...',
  'components.remoteData.loadingFailed': 'Lataus epäonnistui',
  'components.remoteData.retry': 'Yritä uudelleen',

  'onboarding.mentorlist.lowerTitle': 'Mentorimme',
  'onboarding.mentorlist.start': 'Aloita',
  'onboarding.mentorlist.upperTitle': 'Tapaa',

  'onboarding.signIn.button': 'Kirjaudu',
  'onboarding.signIn.failure': 'Kirjautumien epäonnistui',
  'onboarding.signIn.title': 'Kirjaudu',

  'onboarding.signUp.back': 'Takaisin',
  'onboarding.signUp.existingAccount.login': 'Kirjaudu sisään',
  'onboarding.signUp.existingAccount.title': 'Minulla on jo tunnus',
  'onboarding.signUp.nickName': 'Nikki',
  'onboarding.signUp.password': 'Salasana',
  'onboarding.signUp.signUp': 'Luo tunnus',
  'onboarding.signUp.title': 'Luo tunnus',
};

export type MessageId = keyof typeof messages;
