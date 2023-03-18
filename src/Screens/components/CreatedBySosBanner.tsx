import React from 'react';
import RN from 'react-native';

import Message from './Message';
import fonts from './fonts';
import colors from './colors';

import { MessageId } from 'src/localization';

const CreatedBySosBanner = ({ style, ...textProps }: RN.TextProps) => {
  const createdBySosMessage: MessageId = 'components.createdBySosBanner';

  return (
    <Message
      style={[styles.banner, style]}
      id={createdBySosMessage}
      {...textProps}
    />
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
