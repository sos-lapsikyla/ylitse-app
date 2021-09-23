import React from 'react';
import RN from 'react-native';

import colors from './colors';

export interface SwitchProps {
  value: boolean;
  onPress: () => void;
  isLoading: boolean;
  disabled?: boolean;
  testID?: string;
}

const leftPosition = 4;
const rightPosition = 35;
const middlePosition = (leftPosition + rightPosition) / 2;
const duration = 250;

const getPosition = (value: boolean, isLoading: boolean) =>
  isLoading ? middlePosition : value ? rightPosition : leftPosition;

const Switch: React.FC<SwitchProps> = ({
  value,
  disabled,
  onPress,
  isLoading,
}) => {
  const animation = React.useRef(
    new RN.Animated.Value(getPosition(value, isLoading)),
  ).current;

  React.useEffect(() => {
    RN.Animated.timing(animation, {
      duration,
      toValue: getPosition(value, isLoading),
      useNativeDriver: false, // Colors are not supported by native driver
    }).start();
  }, [value, isLoading]);

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
  React.useEffect(spin, []);

  const press = () => {
    requestAnimationFrame(() => onPress());
  };

  const knobBorder = isLoading
    ? {
        borderRightColor: colors.green,
        borderColor: colors.white,
        borderWidth: 4,
      }
    : {};

  return (
    <RN.TouchableWithoutFeedback
      onPress={press}
      disabled={disabled || isLoading}
    >
      <RN.View style={[styles.track]}>
        <RN.Animated.View
          style={[
            styles.knob,
            { left: animation },
            {
              backgroundColor: animation.interpolate({
                inputRange: [leftPosition, rightPosition],
                outputRange: [colors.white, colors.blue],
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
    </RN.TouchableWithoutFeedback>
  );
};

const styles = RN.StyleSheet.create({
  track: {
    height: 30,
    width: 64,
    borderRadius: 15,
    backgroundColor: colors.lightestGray,
  },
  knob: {
    position: 'absolute',
    left: 2,
    top: 3,
    width: 23,
    height: 23,
    borderRadius: 13,
    backgroundColor: colors.white,
    zIndex: 1,
  },
});

export default Switch;
