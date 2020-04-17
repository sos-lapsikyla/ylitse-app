import { MessageId } from './fi';

/*eslint sort-keys: "error"*/
export const messages: { [key in MessageId]: string } = {
  'buddyList.title': 'Chats',

  'components.appTitle.subTitle': 'MentorApp',
  'components.appTitle.title': 'YLITSE',

  'components.createdBySosBanner': 'Brought to you by SOS-lapsikylä',

  'components.mentorCard.readMore': 'Read more',
  'components.mentorCard.showMore': 'Show more...',
  'components.mentorCard.yearsAbbrev': 'y.',

  'components.mentorSkills.other': 'I can also help with:',
  'components.mentorSkills.subject': 'Subject:',

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

  'main.mentor.other': 'I can also support with:',
  'main.mentor.story': 'My story',
  'main.mentor.subject': 'Subject:',

  'main.mentorCardExpanded.button': 'Chat',
  'main.mentorList.title': 'Mentors',

  'main.settings.account.email.change': 'Change email',
  'main.settings.account.email.fail': 'Changing email failed!',
  'main.settings.account.email.fieldTitle': 'Email',
  'main.settings.account.email.missing': 'no email',
  'main.settings.account.email.success': 'Changing email succeeded!',
  'main.settings.account.email.title': 'Email',

  'main.settings.account.nickName': 'Nickname',

  'main.settings.account.password.button': 'Change password',
  'main.settings.account.password.current': 'Current password',
  'main.settings.account.password.failure': 'Password change failed',
  'main.settings.account.password.new': 'New Password',
  'main.settings.account.password.repeat': 'Repeat new password',
  'main.settings.account.password.success': 'Password change succeeded',
  'main.settings.account.password.title': 'Password',

  'main.settings.account.profile.button': 'Edit Profile',
  'main.settings.account.profile.title': 'Profile',

  'main.settings.account.title': 'Account settings',
  'main.settings.account.userName': 'Username',

  'main.settings.deleteAccount.cancel': 'Cancel',
  'main.settings.deleteAccount.deleteAccount': 'Delete account',
  'main.settings.deleteAccount.text1':
    'Are you sure you want to delete your account?',
  'main.settings.deleteAccount.text2':
    'All your data will be destroyed from the system.',
  'main.settings.deleteAccount.text3':
    'Your account or conversations cannot be returned.',
  'main.settings.deleteAccount.title': 'Account deletion',

  'main.settings.logout.cancel': 'Cancel',
  'main.settings.logout.logout': 'Logout',
  'main.settings.logout.text1': 'You are loggin out.',
  'main.settings.logout.text2':
    'You can get back to your conversations by loggin in.',
  'main.settings.logout.title': 'Logout',

  'main.settings.other.button.deleteAccount': 'Delete account',
  'main.settings.other.button.logOut': 'Log out',
  'main.settings.other.feedBack': 'Give us feeback : )',
  'main.settings.other.feedBackLink': 'Feedback form',
  'main.settings.other.howTo': 'How should I use this application?',
  'main.settings.other.termsLink': 'Terms and conditions',
  'main.settings.other.title': 'Other',
  'main.settings.other.userGuide': 'Mentoring guide (in Finnish)',
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

  'onboarding.sign.in': 'Sign in',
  'onboarding.sign.up': 'Sign up',

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

  'onboarding.signUp.existingAccount.login': 'Login',
  'onboarding.signUp.existingAccount.title': 'I already have an account',
  'onboarding.signUp.nickName': 'Nickname',
  'onboarding.signUp.password': 'Password',
  'onboarding.signUp.signUp': 'Sign up',
  'onboarding.signUp.title': 'Sign up',

  'onboarding.welcome.button': 'Start',
  'onboarding.welcome.text1': 'Cool, that you have started using the service!',
  'onboarding.welcome.text2':
    'Here you can ask confidental things from mentors.',
  'onboarding.welcome.text3': 'We hope you wil have pleasant conversations!',
  'onboarding.welcome.title': 'Hello!',

  'tabs.chats': 'Chats',
  'tabs.mentors': 'Mentors',
  'tabs.settings': 'Settings',
};
