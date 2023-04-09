import React from 'react';
import RN from 'react-native';

import { MessageId } from 'src/localization';

import Message from './Message';
import fonts from './fonts';
import colors from './colors';

const CreatedBySosBanner = ({ style, ...textProps }: RN.TextProps) => {
  const id: MessageId = 'components.createdBySosBanner';

  return (
    <Message style={[styles.banner, style]} id={id as any} {...textProps} />
  );
};

const styles = RN.StyleSheet.create({
  banner: {
    ...fonts.regular,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default CreatedBySosBanner;
