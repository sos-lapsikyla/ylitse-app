import React from 'react';
import RN from 'react-native';

import shadow from './shadow';
import colors from './colors';
import Spinner from './Spinner';

interface Props {
  onPress: () => void | undefined;
  style?: RN.StyleProp<RN.ViewStyle>;
  badgeStyle?: RN.StyleProp<RN.ImageStyle>;
  badge?: RN.ImageSourcePropType;
  disabled?: boolean;
  loading?: boolean;
  noShadow?: boolean;
  emphasis?: 'high' | 'low';
  testID?: string;
}

const IconButton = ({
  onPress,
  style,
  badgeStyle,
  badge,
  emphasis = 'high',
  loading,
  disabled,
  noShadow,
  testID,
}: Props) => {
  return (
    <RN.TouchableOpacity
      style={[
        styles.commonContainer,
        styles[`${emphasis}Container`],
        disabled ? styles.disabled : undefined,
        !noShadow ? styles.shadow : undefined,
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      testID={testID}
    >
      {!badge || loading ? null : (
        <RN.Image style={[styles.badge, badgeStyle]} source={badge} />
      )}
      {loading ? <Spinner style={[styles.badge, badgeStyle]} /> : null}
    </RN.TouchableOpacity>
  );
};

const borderRadius = 32;

const styles = RN.StyleSheet.create({
  commonContainer: {
    minHeight: 32,
    alignSelf: 'stretch',
    borderRadius,
    padding: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  highContainer: {
    backgroundColor: colors.purplePale,
  },
  lowContainer: {
    backgroundColor: colors.white,
    borderColor: colors.purple,
    borderWidth: 2,
  },
  shadow: shadow(7),
  disabled: {
    opacity: 0.7,
  },
  badge: {
    width: 16,
    height: 16,
    tintColor: colors.purple,
  },
});

export default IconButton;
