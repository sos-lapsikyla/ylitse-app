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
  testID?: string;
}

export default ({ onPress, style, messageId, messageStyle, testID }: Props) => {
  return (
    <ButtonContainer
      style={[styles.container, style]}
      onPress={onPress}
      testID={testID}
    >
      <RN.View style={styles.subContainer}>
        <RN.Image
          style={styles.icon}
          source={require('../images/search.svg')}
          resizeMode="stretch"
          resizeMethod="scale"
        />
        <Message style={[styles.message, messageStyle]} id={messageId} />
      </RN.View>
    </ButtonContainer>
  );
};

const borderRadius = 18;
const styles = RN.StyleSheet.create({
  subContainer: {
    flexDirection: 'row',
  },
  icon: {
    tintColor: colors.faintBlue,
    height: 20,
    width: 20,
  },
  container: {
    minHeight: 40,
    alignSelf: 'stretch',
    borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    backgroundColor: colors.blue80,
    marginLeft: 20,
    marginTop: 30,
  },
  message: {
    ...fonts.regularBold,
    textAlign: 'center',
    color: colors.white,
    flexDirection: 'column',
    paddingLeft: 5,
  },
});
