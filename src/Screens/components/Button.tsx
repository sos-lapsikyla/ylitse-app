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
  emphasis?: 'high' | 'low';
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
  emphasis = 'high',
  noShadow,
  testID,
}: Props) => {
  return (
    <RN.TouchableOpacity
      style={[
        styles.commonContainer,
        styles[`${emphasis}Container`],
        !noShadow && styles.shadow,
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
    >
      <Message
        style={[
          styles.commonMessage,
          styles[`${emphasis}Message`],
          messageStyle,
          disabled && styles.disabledMessage,
        ]}
        id={messageId}
      />
      {!badge || loading ? null : (
        <RN.Image
          style={[
            styles.commonBadge,
            badgeStyle ?? styles.absoluteBadge,
            disabled && styles.disabledIcon,
          ]}
          source={badge}
        />
      )}
      {loading ? (
        <Spinner
          style={[
            styles.commonBadge,
            badgeStyle ?? styles.absoluteBadge,
            disabled && styles.disabledIcon,
          ]}
        />
      ) : null}
    </RN.TouchableOpacity>
  );
};

const borderRadius = 32;

const styles = RN.StyleSheet.create({
  commonContainer: {
    minHeight: 40,
    alignSelf: 'stretch',
    borderRadius,
    paddingVertical: 4,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highContainer: {
    backgroundColor: colors.purple,
  },
  lowContainer: {
    backgroundColor: colors.white,
    borderColor: colors.purple,
    borderWidth: 2,
  },
  shadow: shadow(7),
  disabled: {
    backgroundColor: colors.midGray,
  },
  disabledMessage: {
    color: colors.fadedGray,
  },
  disabledIcon: {
    tintColor: colors.fadedGray,
  },
  absoluteBadge: {
    position: 'absolute',
    right: 22,
  },
  commonBadge: {
    width: 48,
    height: 48,
    tintColor: colors.orangeLight,
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

export default Button;
