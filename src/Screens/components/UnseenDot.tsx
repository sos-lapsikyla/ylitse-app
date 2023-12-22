import React from 'react';
import RN from 'react-native';

import colors from './colors';

type Props = {
  hasUnseen: boolean;
  style?: RN.StyleProp<RN.ViewStyle>;
  testID?: string;
};
export const UnseenDot = ({ hasUnseen, style, testID }: Props) => {
  return hasUnseen ? (
    <RN.View style={[unseenDotStyles.dot, style]} testID={testID} />
  ) : null;
};

const unseenDotStyles = RN.StyleSheet.create({
  dot: {
    zIndex: 2,
    borderRadius: 8,
    width: 16,
    height: 16,
    backgroundColor: colors.orangeLight,
    borderStyle: 'solid',
    borderWidth: 3,
    position: 'absolute',
    transform: [{ translateX: 15 }, { translateY: -24 }],
  },
});
