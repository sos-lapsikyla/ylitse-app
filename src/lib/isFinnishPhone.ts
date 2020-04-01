import RN from 'react-native';

const deviceLanguage =
  RN.Platform.OS === 'ios'
    ? RN.NativeModules.SettingsManager.settings.AppleLocale ||
      RN.NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : RN.NativeModules.I18nManager.localeIdentifier;

export default deviceLanguage.toLowerCase().includes('fi');
