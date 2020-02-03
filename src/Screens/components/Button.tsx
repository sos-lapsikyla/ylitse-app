import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import * as localization from '../../localization';

import Message from './Message';
import shadow from './shadow';
import colors, { gradients } from './colors';
import fonts from './fonts';
import Spinner from './Spinner';

interface Props {
  onPress: () => void | undefined;
  gradient?: string[];
  style?: RN.StyleProp<RN.ViewStyle>;
  contentContainerStyle?: RN.StyleProp<RN.ViewStyle>;
  messageId: localization.MessageId;
  messageStyle?: RN.StyleProp<RN.TextStyle>;
  badge?: RN.ImageSourcePropType;
  disabled?: boolean;
  loading?: boolean;
  noShadow?: boolean;
}

const Button = ({
  gradient,
  contentContainerStyle,
  messageId,
  messageStyle,
  onPress,
  style,
  badge,
  loading,
  disabled,
  noShadow,
}: Props) => {
  return (
    <RN.TouchableOpacity
      style={[
        styles.container,
        disabled ? styles.disabled : undefined,
        !noShadow ? styles.shadow : undefined,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      <LinearGradient
        style={[styles.gradient, contentContainerStyle]}
        colors={gradient ? gradient : gradients.acidGreen}
      >
        <Message style={[styles.message, messageStyle]} id={messageId} />
        {!badge || loading ? null : (
          <RN.Image style={styles.badge} source={badge} />
        )}
        {loading ? <Spinner style={styles.badge} /> : null}
      </LinearGradient>
    </RN.TouchableOpacity>
  );
};

const borderRadius = 16;
const styles = RN.StyleSheet.create({
  container: {
    minHeight: 48,
    alignSelf: 'stretch',
    borderRadius,
  },
  shadow: shadow(7),
  disabled: {
    opacity: 0.3,
  },
  badge: {
    position: 'absolute',
    right: 16,
    width: 48,
    height: 48,
  },
  gradient: {
    minHeight: 48,
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
  message: {
    ...fonts.largeBold,
    textAlign: 'center',
    color: colors.deepBlue,
    flexDirection: 'column',
  },
});

export default Button;
