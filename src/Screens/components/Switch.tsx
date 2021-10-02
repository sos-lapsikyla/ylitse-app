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

const leftPosition = 7;
const rightPosition = 32;
const middlePosition = (leftPosition + rightPosition) / 2;
const duration = 250;

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
    requestAnimationFrame(() => onPress());
  };

  const spinState = React.useRef(new RN.Animated.Value(0)).current;

  const spin = () =>
    RN.Animated.loop(
      RN.Animated.timing(spinState, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
        easing: RN.Easing.linear,
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
        borderColor: colors.white,
        borderWidth: 4,
      }
    : {};

  return (
    <RN.Pressable onPress={press} disabled={disabled} testID={testID}>
      <RN.View style={[styles.track, style]}>
        <RN.Animated.View
          style={[
            styles.knob,
            { left: animation },
            {
              backgroundColor: animation.interpolate({
                inputRange: [leftPosition, rightPosition],
                outputRange: [colors.gray, colors.blue],
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
    height: 30,
    width: 60,
    borderRadius: 15,
    backgroundColor: colors.lightestGray,
  },
  knob: {
    position: 'absolute',
    left: 2,
    top: 4,
    width: 22,
    height: 22,
    borderRadius: 13,
    backgroundColor: colors.white,
    zIndex: 1,
  },
});

export default Switch;
