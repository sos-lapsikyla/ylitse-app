import { MessageId } from './fi';

/*eslint sort-keys: "error"*/
export const messages: { [key in MessageId]: string } = {
  'buddyList.title': 'Chats',

  'components.appTitle.subTitle': 'MentorApp',
  'components.appTitle.title': 'YLITSE',

  'components.createdBySosBanner': 'Brought to you by SOS-Lapsikylä',

  'components.mentorCard.readMore': 'Read more',
  'components.mentorCard.showMore': 'Show more...',
  'components.mentorCard.yearsAbbrev': ' y/o',

  'components.mentorSkills.other': 'I can also help with:',
  'components.mentorSkills.subject': 'Subject:',

  'components.remoteData.loading': 'Loading...',
  'components.remoteData.loadingFailed': 'Loading failed',
  'components.remoteData.retry': 'Try again',

  'components.slider.SendAnswerButton': 'Send',

  'date.day.today': 'today',
  'date.day.yesterday': 'yesterday',

  'date.month.01': 'January',
  'date.month.02': 'February',
  'date.month.03': 'March',
  'date.month.04': 'April',
  'date.month.05': 'May',
  'date.month.06': 'June',
  'date.month.07': 'July',
  'date.month.08': 'August',
  'date.month.09': 'September',
  'date.month.10': 'October',
  'date.month.11': 'November',
  'date.month.12': 'December',

  'main.chat.archive': 'Archive chat',
  'main.chat.archive.confirmation':
    'Are you sure you want to archive this chat?',
  'main.chat.ban': 'Ban chat',
  'main.chat.ban.confirmation': 'Are you sure you want to ban this user?',
  'main.chat.delete': 'Delete chat',
  'main.chat.delete.confirmation':
    'Are you sure you want to delete this chat? This action cannot be undone.',
  'main.chat.deleteAll': 'Delete all',
  'main.chat.deleteAll.confirmation':
    'Are you sure you want to delete all banned chats? This action cannot be undone.',
  'main.chat.deleteAll.error': 'Deleting failed',
  'main.chat.navigation.archived': 'Archived',
  'main.chat.navigation.banned': 'Banned',
  'main.chat.send.failure': 'Sending message failed',
  'main.chat.unban': 'Restore chat',
  'main.chat.unban.confirmation': 'Are you sure you want to restore this user?',

  'main.mentor.other': 'I can also support with:',
  'main.mentor.story': 'My story',
  'main.mentor.subject': 'Subject:',

  'main.mentorCardExpanded.button': 'Chat',
  'main.mentorList.title': 'Mentors',

  'main.mentorsTitleAndSearchButton': 'Search',
  'main.mentorsTitleAndSearchButtonFiltersActive': 'Filters',
  'main.searchMentor.resetButton': 'Reset',
  'main.searchMentor.searchField.placeholder': 'Type in keyword',
  'main.searchMentor.shouldHideInactiveMentors': 'Hide inactive mentors',
  'main.searchMentor.showButton': 'Show',
  'main.searchMentor.title': 'Search',

  'main.settings.account.displayName': 'Display name',

  'main.settings.account.email.change': 'Change email',
  'main.settings.account.email.fail': 'Changing email failed!',
  'main.settings.account.email.fieldTitle': 'Email',
  'main.settings.account.email.invalid': 'Invalid email address',
  'main.settings.account.email.missing': 'no email',
  'main.settings.account.email.success': 'Changing email succeeded!',
  'main.settings.account.email.title': 'Email',

  'main.settings.account.password.button': 'Change password',
  'main.settings.account.password.current': 'Current password',
  'main.settings.account.password.failure':
    'Password change failed: check your password!',
  'main.settings.account.password.new': 'New Password',
  'main.settings.account.password.repeat': 'Repeat new password',
  'main.settings.account.password.success': 'Password change succeeded',
  'main.settings.account.password.title': 'Password',

  'main.settings.account.profile.button': 'Edit Profile',
  'main.settings.account.profile.title': 'Profile',

  'main.settings.account.status.fail': 'Changing status message failed!',
  'main.settings.account.status.success': 'Changing status message succeeded!',
  'main.settings.account.status.title': 'Status message',

  'main.settings.account.title': 'Account settings',
  'main.settings.account.userName': 'Username',

  'main.settings.account.vacation.off': 'Off',
  'main.settings.account.vacation.on': 'On',
  'main.settings.account.vacation.title': 'Vacation mode',

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
  'main.settings.logout.text1': 'You are logging out.',
  'main.settings.logout.text2':
    'You can get back to your conversations by logging in.',
  'main.settings.logout.title': 'Logout',

  'main.settings.other.button.deleteAccount': 'Delete account',
  'main.settings.other.button.logOut': 'Log out',
  'main.settings.other.feedBack': 'Give us feedback : )',
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
  'meta.error': 'An error occurred, please try again',
  'meta.ok': 'OK',
  'meta.save': 'Save',
  'onboarding.age.switch': 'I am over 17 years old',
  'onboarding.displayName.bodyText':
    'If you want to remain anonymous, do not use your real name',
  'onboarding.displayName.inputTitle': 'Display name*',
  'onboarding.displayName.nextButton': 'Continue',
  'onboarding.displayName.title': 'Almost ready',

  'onboarding.email.bodyText':
    'Entering your email address will help you retrieve your password later, in case you lose it. We will not use it for anything else.',
  'onboarding.email.inputTitle': 'Email (optional)',
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
  'onboarding.privacyPolicy.switch': 'I agree to the privacy policy',
  'onboarding.privacyPolicy.title': 'Data Privacy & Security',

  'onboarding.sign.in': 'Sign in',
  'onboarding.sign.up': 'Sign up',

  'onboarding.signIn.button': 'Login',
  'onboarding.signIn.failure': 'Login failed',
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
  'onboarding.signUp.password': 'Password',
  'onboarding.signUp.signUp': 'Sign up',
  'onboarding.signUp.title': 'Sign up',
  'onboarding.signUp.userName': 'Username',

  'onboarding.welcome.apuu.link': 'Apuu-chat',
  'onboarding.welcome.button': 'Start',
  'onboarding.welcome.text1': 'Thank you for using our service',
  'onboarding.welcome.text2': 'Start a confidential conversation with a mentor',
  'onboarding.welcome.text3':
    'The service is intended for people over 17 years of age. If you are under 17, visit Apuu-chat.',
  'onboarding.welcome.text4': 'We hope you will enjoy the service',
  'onboarding.welcome.title': 'Hello!',

  'tabs.chats': 'Chats',
  'tabs.mentors': 'Mentors',
  'tabs.settings': 'Settings',
};
