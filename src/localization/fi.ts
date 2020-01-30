/*eslint sort-keys: "error"*/
export const messages = {
  'buddyList.title': 'Keskustelut',

  'components.appTitle.subTitle': 'MentorApp',
  'components.appTitle.title': 'Ylitse',

  'components.createdBySosBanner': 'Palvelun tarjoaa SOS-lapsikylä',

  'components.mentorCard.readMore': 'Lue Lisää',
  'components.mentorCard.showMore': 'Näytä lisää...',
  'components.mentorCard.yearsAbbrev': 'v.',

  'components.mentorSkills.title': 'Voin auttaa',
  'components.mentorStory.title': 'Tietoja minusta',

  'components.remoteData.loading': 'Ladataan...',
  'components.remoteData.loadingFailed': 'Lataus epäonnistui',
  'components.remoteData.retry': 'Yritä uudelleen',

  'main.mentorCardExpanded.button': 'Juttele',
  'main.mentorList.title': 'Mentorit',

  'meta.back': 'Takaisin',
  'meta.blank': ' ',
  'meta.error': 'Virhe',

  'onboarding.displayName.bodyText':
    '*Jos haluat pysyä nimettömänä, valitse itsellesi nimimerkki, josta et ole tunnistettavissa.',
  'onboarding.displayName.inputTitle': 'Valitse itsellesi nimimerkki*',
  'onboarding.displayName.nextButton': 'Jatka',
  'onboarding.displayName.title': 'Melkein valmista',

  'onboarding.email.bodyText':
    '* Sähköpostiosoitteen tallentaminen mahdollistaa salasanan palauttamisen. Sähköpostiosoitetta ei käytetä muihin tarkoituksiin, eikä sitä luovuteta kolmansille osapuolille.',
  'onboarding.email.inputTitle': 'Sähköpostiosoite (vapaaehtoinen)*',
  'onboarding.email.nextButton': 'Jatka',
  'onboarding.email.title': 'Sähköpostiosoite',

  'onboarding.mentorlist.lowerTitle': 'Mentorimme',
  'onboarding.mentorlist.start': 'Aloita',
  'onboarding.mentorlist.upperTitle': 'Tapaa',

  'onboarding.privacyPolicy.agreeButton': 'Hyväksy',
  'onboarding.privacyPolicy.bodyText1':
    'Käytämme tietojasi ainoastaan tämän palvelun mahdollistamiseksi. Noudatamme tarkkoja tietoturvastandardeja ja teemme parhaamme, jotta tietosi säilyvät turvassa ja yksityisinä.',
  'onboarding.privacyPolicy.bodyText2':
    'Huomaathan, että keräämme anonyymejä tilastoja, jotta voimme kehittää palvelua entistä paremmaksi.',
  'onboarding.privacyPolicy.bodyText3':
    'Rekisteröitymällä palvelun käyttäjäksi hyväksyt, että käsittelemme sinua koskevia tietoja. Voit lukea lisää seuraavista linkeistä:',
  'onboarding.privacyPolicy.link': 'Tietoja yksityisyydensuojasta',
  'onboarding.privacyPolicy.nextButton': 'Jatka',
  'onboarding.privacyPolicy.title': 'Yksityisyydensuoja',

  'onboarding.signIn.button': 'Kirjaudu',
  'onboarding.signIn.failure': 'Kirjautumien epäonnistui',
  'onboarding.signIn.title': 'Kirjaudu',

  'onboarding.signUp.back': 'Takaisin',

  'onboarding.signUp.error.passwordLong': 'Salasana on liian pitkä',
  'onboarding.signUp.error.passwordShort': 'Salasana on liian lyhyt',
  'onboarding.signUp.error.probablyNetwork': 'Yhteys virhe',
  'onboarding.signUp.error.userNameLong': 'Käyttäjänimi on liian Pitkä',
  'onboarding.signUp.error.userNameShort': 'Käyttäjänimi on liian lyhyt',
  'onboarding.signUp.error.userNameTaken': 'Käyttäjänimi on varattu',

  'onboarding.signUp.existingAccount.login': 'Kirjaudu sisään',
  'onboarding.signUp.existingAccount.title': 'Minulla on jo tunnus',
  'onboarding.signUp.nickName': 'Nikki',
  'onboarding.signUp.password': 'Salasana',
  'onboarding.signUp.signUp': 'Luo tunnus',
  'onboarding.signUp.title': 'Luo tunnus',
};

export type MessageId = keyof typeof messages;
