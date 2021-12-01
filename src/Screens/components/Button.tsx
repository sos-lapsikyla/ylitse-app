import React from 'react';
import RN from 'react-native';

import * as localization from '../../localization';

import Message from './Message';
import shadow from './shadow';
import colors from './colors';
import fonts from './fonts';
import Spinner from './Spinner';

interface Props {
  onPress: () => void | undefined;
  style?: RN.StyleProp<RN.ViewStyle>;
  badgeStyle?: RN.StyleProp<RN.ImageStyle>;
  messageId: localization.MessageId;
  messageStyle?: RN.StyleProp<RN.TextStyle>;
  badge?: RN.ImageSourcePropType;
  disabled?: boolean;
  loading?: boolean;
  noShadow?: boolean;
  testID?: string;
}

const Button = ({
  messageId,
  messageStyle,
  onPress,
  style,
  badgeStyle,
  badge,
  loading,
  disabled,
  noShadow,
  testID,
}: Props) => {
  const shouldHideBadge = !badge || loading;

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
      testID={testID}
    >
      <Message style={[styles.message, messageStyle]} id={messageId} />
      {shouldHideBadge ? null : (
        <RN.Image style={badgeStyle ?? styles.badge} source={badge} />
      )}
      {loading ? <Spinner style={badgeStyle ?? styles.badge} /> : null}
    </RN.TouchableOpacity>
  );
};

const borderRadius = 18;

const styles = RN.StyleSheet.create({
  container: {
    minHeight: 40,
    alignSelf: 'stretch',
    borderRadius,
    backgroundColor: colors.lightBlue,
    paddingVertical: 4,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shadow: shadow(7),
  disabled: {
    opacity: 0.3,
  },
  badge: {
    position: 'absolute',
    right: 22,
    width: 48,
    height: 48,
  },
  gradient: {
    minHeight: 40,
    paddingVertical: 4,
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
    color: colors.darkestBlue,
    flexDirection: 'column',
  },
});

export default Button;
