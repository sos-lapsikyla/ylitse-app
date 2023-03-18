import React from 'react';
import RN from 'react-native';

import Message from './Message';
import fonts from './fonts';
import colors from './colors';

const CreatedBySosBanner = ({ style, ...textProps }: RN.TextProps) => (
  <Message
    style={[styles.banner, style]}
    id="components.createdBySosBanner"
    {...textProps}
  />
);

const styles = RN.StyleSheet.create({
  banner: {
    ...fonts.regular,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default CreatedBySosBanner;
