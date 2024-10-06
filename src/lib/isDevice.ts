import RN from 'react-native';
import { PlatformOSType } from 'react-native/types';
import Device from 'react-native-device-info';

export const isDevice = (platform: PlatformOSType) =>
  platform === RN.Platform.OS;

export const hasNotch = () => Device.hasNotch();

export const getClient = () => {
  if (RN.Platform.OS === 'android') {
    return 'ylitse_android';
  }

  return 'ylitse_ios';
};
