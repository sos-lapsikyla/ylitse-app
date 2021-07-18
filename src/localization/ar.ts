import { MessageId } from './fi';

/*eslint sort-keys: "error"*/
export const messages: { [key in MessageId]: string } = {
  'buddyList.title': 'المحادثات',

  'components.appTitle.subTitle': 'تطبيق ارشادي',
  'components.appTitle.title': 'YLITSE',

  'components.createdBySosBanner': 'مقدم لكم من قبل SOS-Lapsikylä',

  'components.mentorCard.readMore': 'قراءة المزيد',
  'components.mentorCard.showMore': 'عرض المزيد...',
  'components.mentorCard.yearsAbbrev': 'y.',

  'components.mentorSkills.other': 'يمكنني أيضًا المساعدة في:',
  'components.mentorSkills.subject': 'موضوع:',

  'components.remoteData.loading': 'جاري التحميل...',
  'components.remoteData.loadingFailed': 'فشل في التحميل',
  'components.remoteData.retry': 'يرجى المعاودة',

  'date.day.today': 'اليوم',
  'date.day.yesterday': 'البارحه',

  'date.month.01': 'يناير',
  'date.month.02': 'فبراير',
  'date.month.03': 'مارس',
  'date.month.04': 'ابريل',
  'date.month.05': 'مايو',
  'date.month.06': 'يونيو',
  'date.month.07': 'يوليو',
  'date.month.08': 'أغسطس',
  'date.month.09': 'سبتمبر',
  'date.month.10': 'أكتوبر',
  'date.month.11': 'نوفمبر',
  'date.month.12': 'ديسمبر',

  'main.chat.ban': 'حظر الدردشة',
  'main.chat.ban.confirmation': 'هل أنت متأكد أنك تريد حظر هذا المستخدم؟',
  'main.chat.navigation.banned': 'قائمة الحظر',
  'main.chat.unban': 'استعادة الدردشة',
  'main.chat.unban.confirmation': 'هل أنت متأكد أنك تريد استعادة هذا المستخدم؟',

  'main.mentor.other': 'يمكنني أيضًا دعم ما يلي:',
  'main.mentor.story': 'قصتي',
  'main.mentor.subject': 'الموضوع',

  'main.mentorCardExpanded.button': 'محادثة',
  'main.mentorList.title': 'المرشدون',

  'main.mentorsTitleAndSearchButton': 'بحث',
  'main.mentorsTitleAndSearchButtonFiltersActive': 'المرشحات',
  'main.searchMentor.resetButton': 'إعادة ضبط',
  'main.searchMentor.searchField.placeholder': 'اكتب كلمة رئيسية',
  'main.searchMentor.showButton': 'عرض',
  'main.searchMentor.title': 'بحث',

  'main.settings.account.displayName': 'أسم العرض',

  'main.settings.account.email.change': 'تغيير البريد الالكتروني',
  'main.settings.account.email.fail': 'فشل تغيير البريد الإلكتروني!',
  'main.settings.account.email.fieldTitle': 'البريد الالكتروني',
  'main.settings.account.email.missing': 'لايوجد بريد الكتروني',
  'main.settings.account.email.success': 'تم تغيير البريد الالكتروني بنجاح',
  'main.settings.account.email.title': 'البريد الالكتروني',

  'main.settings.account.password.button': 'تغيير كلمة المرور',
  'main.settings.account.password.current': 'كلمة السر الحالية',
  'main.settings.account.password.failure': 'فشل تغيير كلمة المرور',
  'main.settings.account.password.new': 'كلمة السر الجديدة',
  'main.settings.account.password.repeat': 'كرر كلمة المرور الجديدة',
  'main.settings.account.password.success': 'تم تغيير كلمة المرور بنجاح',
  'main.settings.account.password.title': 'كلمه السر',

  'main.settings.account.profile.button': 'تعديل الملف الشخصي',
  'main.settings.account.profile.title': 'الملف الشخصي',

  'main.settings.account.title': 'إعدادت الحساب',
  'main.settings.account.userName': 'اسم المستخدم',

  'main.settings.deleteAccount.cancel': 'الغاء',
  'main.settings.deleteAccount.deleteAccount': 'حذف الحساب',
  'main.settings.deleteAccount.text1': 'هل انت متأكد انك تريد حذف حسابك؟',
  'main.settings.deleteAccount.text2': 'سيتم حذف جميع بياناتك من النظام.',
  'main.settings.deleteAccount.text3': 'لا يمكن إرجاع حسابك أو محادثاتك.',
  'main.settings.deleteAccount.title': 'حذف الحساب',

  'main.settings.logout.cancel': 'الغاء',
  'main.settings.logout.logout': 'تسجيل الخروج',
  'main.settings.logout.text1': 'تم تسجيل الخروج بنجاح.',
  'main.settings.logout.text2': 'يمكنك العودة إلى محادثاتك بتسجيل الدخول.',
  'main.settings.logout.title': 'تسجيل الخروج',

  'main.settings.other.button.deleteAccount': 'حذف الحساب',
  'main.settings.other.button.logOut': 'تسجيل الخروج',
  'main.settings.other.feedBack': 'أخبرنا عن انطباعك عنا : )',
  'main.settings.other.feedBackLink': 'نموذج الملاحظات',
  'main.settings.other.howTo': 'كيف يمكنني استخدام هذا التطبيق؟',
  'main.settings.other.termsLink': 'الأحكام والشروط',
  'main.settings.other.title': 'اخرى',
  'main.settings.other.userGuide': 'دليل الارشاد (بالفنلندية)',
  'main.settings.other.whatToAgree': 'ماذا أوافق عند استخدام هذا التطبيق؟',
  'main.settings.title': 'إعدادات',

  'meta.back': 'عودة',
  'meta.blank': ' ',
  'meta.cancel': 'الغاء',
  'meta.error': 'حدث خطأ ، يرجى المحاولة مرة أخرى',
  'meta.ok': 'حسنا',
  'meta.save': 'حفظ',

  'onboarding.displayName.bodyText':
    ' إذا كنت تريد عدم الكشف عن هويتك لمرشدينا ، فيرجى إدخال اسم عرض من خلاله لايمكن التعرف عليك.',
  'onboarding.displayName.inputTitle': 'اسم العرض',
  'onboarding.displayName.nextButton': 'استمرار',
  'onboarding.displayName.title': 'على وشك الإنتهاء',

  'onboarding.email.bodyText':
    '* سيساعدك إدخال عنوان بريدك الإلكتروني في استرداد كلمة مرورك لاحقًا في حالة فقدها. لن نستخدمه لأي شيء آخر.',
  'onboarding.email.inputTitle': 'البريد الإلكتروني *',
  'onboarding.email.nextButton': 'استمرار',
  'onboarding.email.title': 'البريد الإلكتروني',

  'onboarding.mentorlist.lowerTitle': 'المرشدين',
  'onboarding.mentorlist.start': 'البدء',

  'onboarding.privacyPolicy.agreeButton': 'اوافق',
  'onboarding.privacyPolicy.bodyText1':
    'نحن نستخدم بياناتك وسجل الرسائل فقط لجعل هذه الخدمة ممكنة. نحن نتبع معايير أمنية عالية ونبذل قصارى جهدنا للحفاظ على محادثاتك خاصة وآمنة.',
  'onboarding.privacyPolicy.bodyText2':
    'يرجى ملاحظة أننا نستخدم إحصائيات مجهولة المصدر لتقييم الخدمة وفائدتها.',
  'onboarding.privacyPolicy.bodyText3':
    'من خلال الاستمرار ، فإنك توافق على الوثوق بنا فيما يتعلق ببياناتك. اقرأ هذه لمزيد من التفاصيل:',
  'onboarding.privacyPolicy.link': 'حول سياسة الخصوصية',
  'onboarding.privacyPolicy.nextButton': 'استمرار',
  'onboarding.privacyPolicy.title': 'خصوصية البيانات & والامان',

  'onboarding.sign.in': 'تسجيل الدخول',
  'onboarding.sign.up': 'تسجيل',

  'onboarding.signIn.button': 'تسجيل الدخول',
  'onboarding.signIn.failure': 'فشل في عملية الدخول',
  'onboarding.signIn.title': 'تسجيل الدخول',

  'onboarding.signUp.back': 'عودة',

  'onboarding.signUp.error.passwordLong': 'كلمة المرور طويلة جدا',
  'onboarding.signUp.error.passwordShort': 'كلمة المرور قصيرة جدا',
  'onboarding.signUp.error.probablyNetwork': 'خطأ في الشبكة',
  'onboarding.signUp.error.userNameLong': 'اسم المستخدم طويل جدا',
  'onboarding.signUp.error.userNameShort': 'اسم المستخدم قصير جدا',
  'onboarding.signUp.error.userNameTaken': 'اسم المستخدم ماخوذ',

  'onboarding.signUp.existingAccount.login': 'تسجيل الدخول',
  'onboarding.signUp.existingAccount.title': 'لدي حساب بالفعل',
  'onboarding.signUp.password': 'كلمه السر',
  'onboarding.signUp.signUp': 'تسجيل',
  'onboarding.signUp.title': 'تسجيل',
  'onboarding.signUp.userName': 'اسم المستخدم',

  'onboarding.welcome.button': 'أبدآ',
  'onboarding.welcome.text1': 'سعداء لآستخدامك خدمتنا!',
  'onboarding.welcome.text2': 'يمكنك مناقشة المرشد بثقة تامة',
  'onboarding.welcome.text3': 'نتمنى لك محادثه ممتعه!',
  'onboarding.welcome.title': 'مرحبا!',

  'tabs.chats': 'المحادثات',
  'tabs.mentors': 'المرشدين',
  'tabs.settings': 'الاعدادات',
};
