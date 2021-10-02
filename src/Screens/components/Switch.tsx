import React from 'react';
import RN from 'react-native';

import colors from './colors';

export interface SwitchProps {
  value: boolean;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  testID?: string;
  style?: RN.ViewStyle;
}

const h = 28;
const d = (2 / 3) * h;
const trackLength = d * 2.75;
const leftPosition = d * 0.3;
const rightPosition = trackLength - 1.3 * d;
const middlePosition = (leftPosition + rightPosition) / 2;
const duration = 400;

const getPosition = (value: boolean, isLoading: boolean) =>
  isLoading ? middlePosition : value ? rightPosition : leftPosition;

const Switch: React.FC<SwitchProps> = ({
  value,
  disabled,
  onPress,
  style,
  testID,
  isLoading,
}) => {
  const animation = React.useRef(
    new RN.Animated.Value(getPosition(value, isLoading ?? false)),
  ).current;

  React.useEffect(() => {
    RN.Animated.timing(animation, {
      duration,
      toValue: getPosition(value, isLoading ?? false),
      useNativeDriver: false, // Colors are not supported by native driver
    }).start();
  }, [value, isLoading]);

  const press = () => {
    if (isLoading) {
      return;
    }
    requestAnimationFrame(() => onPress());
  };

  const spinState = React.useRef(new RN.Animated.Value(0)).current;

  const spin = () =>
    RN.Animated.loop(
      RN.Animated.timing(spinState, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
        easing: RN.Easing.bounce,
      }),
    ).start();

  React.useEffect(() => {
    if (isLoading) {
      spin();
    }
  }, [isLoading]);

  const knobBorder = isLoading
    ? {
        borderRightColor: colors.green,
        borderColor: 'transparent',
        borderWidth: 0.15 * d,
      }
    : {};

  const switchColors = {
    track: disabled ? colors.disableGray : colors.lightestGray,
    knob: disabled
      ? [colors.disableLightGray, colors.disableLightGray]
      : [colors.gray, colors.blue],
  };

  return (
    <RN.Pressable onPress={press} disabled={disabled} testID={testID}>
      <RN.View
        style={[styles.track, { backgroundColor: switchColors.track }, style]}
      >
        <RN.Animated.View
          style={[
            styles.knob,
            { left: animation },
            {
              backgroundColor: animation.interpolate({
                inputRange: [leftPosition, rightPosition],
                outputRange: switchColors.knob,
              }),
            },
            {
              transform: [
                {
                  rotate: spinState.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0deg', '360deg'],
                  }),
                },
              ],
            },
            knobBorder,
          ]}
        />
      </RN.View>
    </RN.Pressable>
  );
};

const styles = RN.StyleSheet.create({
  track: {
    height: h,
    width: trackLength,
    borderRadius: (d * 1.5) / 2,
    backgroundColor: colors.lightestGray,
  },
  knob: {
    position: 'absolute',
    top: d * 0.25,
    width: d,
    height: d,
    borderRadius: d / 2,
    backgroundColor: colors.white,
    zIndex: 1,
  },
});

export default Switch;
