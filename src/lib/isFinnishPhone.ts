import RN from 'react-native';
import { isDevice } from './isDevice';

const deviceLanguage = isDevice('ios')
  ? RN.NativeModules.SettingsManager.settings.AppleLocale ||
    RN.NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
  : RN.NativeModules.I18nManager.localeIdentifier;

export default deviceLanguage.toLowerCase().includes('fi');
