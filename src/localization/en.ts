import { MessageId } from './fi';

/*eslint sort-keys: "error"*/
export const messages: { [key in MessageId]: string } = {
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

  'date.day.today': 'today',
  'date.day.yesterday': 'yesterday',

  'date.month.01': 'january',
  'date.month.02': 'february',
  'date.month.03': 'march',
  'date.month.04': 'april',
  'date.month.05': 'may',
  'date.month.06': 'june',
  'date.month.07': 'july',
  'date.month.08': 'august',
  'date.month.09': 'september',
  'date.month.10': 'october',
  'date.month.11': 'november',
  'date.month.12': 'decemer',

  'main.mentorCardExpanded.button': 'Chat',
  'main.mentorList.title': 'Mentors',

  'main.settings.account.changePasswordButton': 'Change password',
  'main.settings.account.currentPassword': 'Current password',
  'main.settings.account.newPassword': 'New password',
  'main.settings.account.newPasswordRepeat': 'Repeat new password',
  'main.settings.account.nickName': 'Nickname (public)',
  'main.settings.account.password': 'Password',
  'main.settings.account.password.failure': 'Password change failed',
  'main.settings.account.password.success': 'Password change succeeded',
  'main.settings.account.title': 'Account settings',
  'main.settings.account.userName': 'username (private)',
  'main.settings.other.button.deleteAccount': 'Delete account',
  'main.settings.other.button.logOut': 'Log out',
  'main.settings.other.feedBack': 'Give us feeback : )',
  'main.settings.other.feedBackLink': 'Feedback form',
  'main.settings.other.howTo': 'How should I use this application?',
  'main.settings.other.termsLink': 'Terms and conditions',
  'main.settings.other.title': 'Other',
  'main.settings.other.userGuide': 'User guide',
  'main.settings.other.whatToAgree': 'What do I agree when using this app?',
  'main.settings.title': 'Settings',

  'meta.back': 'Back',
  'meta.blank': ' ',
  'meta.cancel': 'Cancel',
  'meta.error': 'Virhe, yritä uudelleen',
  'meta.save': 'Save',

  'onboarding.displayName.bodyText':
    "*if you want to stay anonymous to our mentors, please enter a loginName that can't identify you.",
  'onboarding.displayName.inputTitle': 'Display name*',
  'onboarding.displayName.nextButton': 'Continue',
  'onboarding.displayName.title': 'Almost ready',

  'onboarding.email.bodyText':
    '* Entering your email address wil help you retreive your password later, in case you lose it. We will not use it for anything else.',
  'onboarding.email.inputTitle': 'Email*',
  'onboarding.email.nextButton': 'Continue',
  'onboarding.email.title': 'Email',

  'onboarding.mentorlist.lowerTitle': 'Mentors',
  'onboarding.mentorlist.start': 'Get started',
  'onboarding.mentorlist.upperTitle': 'Meet our',

  'onboarding.privacyPolicy.agreeButton': 'I agree',
  'onboarding.privacyPolicy.bodyText1':
    'We only use your data and message history to make this service possible. We follow high security standards and do our best to keep your conversations private and safe.',
  'onboarding.privacyPolicy.bodyText2':
    'Please note that we use anonymous statistics to evaluate the service and its usefulness.',
  'onboarding.privacyPolicy.bodyText3':
    'By continuing you agree to trust us with your data. Read these for more details:',
  'onboarding.privacyPolicy.link': 'About privacy policy',
  'onboarding.privacyPolicy.nextButton': 'Continue',
  'onboarding.privacyPolicy.title': 'Data Privacy & Security',

  'onboarding.signIn.button': 'Login',
  'onboarding.signIn.failure': 'Kirjautumien epäonnistui',
  'onboarding.signIn.title': 'Login',

  'onboarding.signUp.back': 'Back',

  'onboarding.signUp.error.passwordLong': 'Password is too long',
  'onboarding.signUp.error.passwordShort': 'Password is too short',
  'onboarding.signUp.error.probablyNetwork': 'Network error',
  'onboarding.signUp.error.userNameLong': 'Username is too long',
  'onboarding.signUp.error.userNameShort': 'Username is too short',
  'onboarding.signUp.error.userNameTaken': 'Username is taken',

  'onboarding.signUp.existingAccount.login': 'Kirjaudu sisään',
  'onboarding.signUp.existingAccount.title': 'Minulla on jo tunnus',
  'onboarding.signUp.nickName': 'Nickname',
  'onboarding.signUp.password': 'Password',
  'onboarding.signUp.signUp': 'Sign up',
  'onboarding.signUp.title': 'Sign up',
};
