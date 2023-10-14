import RN from 'react-native';
import { PlatformOSType } from 'react-native/types';

export const isDevice = (platform: PlatformOSType) =>
  platform === RN.Platform.OS;
