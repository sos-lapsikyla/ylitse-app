import RN from 'react-native';

const deviceLanguage =
  RN.Platform.OS === 'ios'
    ? RN.NativeModules.SettingsManager.settings.AppleLocale ||
      RN.NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : RN.NativeModules.I18nManager.localeIdentifier;

type Language = 'fi' | 'en' | 'ar';
let lang: Language = 'en';
let localeIdentifier = deviceLanguage.toLowerCase();

if (localeIdentifier.startsWith('fi')) {
  lang = 'fi';
} else if (localeIdentifier.startsWith('ar')) {
  lang = 'ar';
}

export default lang;
