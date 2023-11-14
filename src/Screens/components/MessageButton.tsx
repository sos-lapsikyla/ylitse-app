import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import colors from './colors';
import fonts from './fonts';
import ButtonContainer from './ButtonContainer';

interface Props {
  onPress: () => void | undefined;
  style?: RN.StyleProp<RN.ViewStyle>;
  messageId: localization.MessageId;
  messageStyle?: RN.StyleProp<RN.TextStyle>;
  emphasis?: 'high' | 'low';
  testID?: string;
}

export default ({
  onPress,
  style,
  messageId,
  messageStyle,
  emphasis = 'high',
  testID,
}: Props) => {
  return (
    <ButtonContainer
      style={[styles.commonContainer, styles[`${emphasis}Container`], style]}
      onPress={onPress}
      testID={testID}
    >
      <Message
        style={[
          styles.commonMessage,
          styles[`${emphasis}Message`],
          messageStyle,
        ]}
        id={messageId}
      />
    </ButtonContainer>
  );
};

const borderRadius = 32;

const styles = RN.StyleSheet.create({
  commonContainer: {
    minHeight: 48,
    alignSelf: 'stretch',
    borderRadius,
    paddingVertical: 4,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
  },
  highContainer: {
    backgroundColor: colors.purple,
  },
  lowContainer: {
    backgroundColor: colors.white,
    borderColor: colors.purple,
    borderWidth: 2,
  },
  commonMessage: {
    textAlign: 'center',
    flexDirection: 'column',
  },
  highMessage: {
    ...fonts.largeBold,
    color: colors.orangeLight,
  },
  lowMessage: {
    ...fonts.large,
    color: colors.purple,
  },
});
