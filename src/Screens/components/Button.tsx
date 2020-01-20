import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as localization from '../../localization';

import Message from './Message';
import shadow from './shadow';
import colors, { gradients } from './colors';
import fonts from './fonts';

interface Props {
  onPress: () => void | undefined;
  gradient?: string[];
  style?: RN.StyleProp<RN.ViewStyle>;
  contentContainerStyle?: RN.StyleProp<RN.ViewStyle>;
  messageId: localization.MessageId;
  messageStyle?: RN.StyleProp<RN.TextStyle>;
  hasArrow?: boolean;
}

const Button = ({
  gradient,
  contentContainerStyle,
  messageId,
  messageStyle,
  onPress,
  style,
  hasArrow,
}: Props) => {
  return (
    <RN.TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <LinearGradient
        style={[styles.gradient, contentContainerStyle]}
        colors={gradient ? gradient : gradients.acidGreen}
      >
        <Message style={[styles.message, messageStyle]} id={messageId} />
        {!hasArrow ? null : (
          <RN.Image
            style={styles.arrow}
            source={require('../images/arrow.svg')}
          />
        )}
      </LinearGradient>
    </RN.TouchableOpacity>
  );
};

const borderRadius = 16;
const styles = RN.StyleSheet.create({
  container: {
    minHeight: 64,
    alignSelf: 'stretch',
    borderRadius,
    ...shadow(7),
    overflow: 'scroll',
  },
  gradient: {
    minHeight: 64,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messageContainer: {
    flexDirection: 'column',
    flex: 1,
  },
  arrow: {
    marginLeft: 8,
  },
  message: {
    ...fonts.largeBold,
    textAlign: 'center',
    color: colors.deepBlue,
    flexDirection: 'column',
  },
});

export default Button;
