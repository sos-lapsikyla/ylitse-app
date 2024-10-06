import RN from 'react-native';
import { PlatformOSType } from 'react-native/types';
import Device from 'react-native-device-info';
import { toAppClient } from '../api/minimumVersion';

export const isDevice = (platform: PlatformOSType) =>
  platform === RN.Platform.OS;

export const hasNotch = () => Device.hasNotch();

export const getClient = () => {
  const version = Device.getVersion();
  const client = RN.Platform.OS === 'android' ? 'ylitse_android' : 'ylitse_ios';

  return toAppClient({ version, client });
};
