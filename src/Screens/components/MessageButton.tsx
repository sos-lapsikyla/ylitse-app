import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import shadow from './shadow';
import colors from './colors';
import fonts from './fonts';
import ButtonContainer from './ButtonContainer';

interface Props {
  onPress: () => void | undefined;
  style?: RN.StyleProp<RN.ViewStyle>;
  messageId: localization.MessageId;
  messageStyle?: RN.StyleProp<RN.TextStyle>;
}

export default ({ onPress, style, messageId, messageStyle }: Props) => {
  return (
    <ButtonContainer style={style} onPress={onPress} hasShadow={true}>
      <Message style={[styles.message, messageStyle]} id={messageId} />
    </ButtonContainer>
  );
};

const borderRadius = 18;
const styles = RN.StyleSheet.create({
  container: {
    minHeight: 40,
    alignSelf: 'stretch',
    borderRadius,
    paddingVertical: 4,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    ...shadow(7),
    backgroundColor: colors.blue80,
  },
  message: {
    ...fonts.largeBold,
    textAlign: 'center',
    color: colors.white,
    flexDirection: 'column',
  },
});
