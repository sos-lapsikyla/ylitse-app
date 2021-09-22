import React from 'react';
import RN from 'react-native';

import colors from './colors';

export interface Props {
  value: boolean;
  onPress: () => void;
  isLoading: boolean;
  disabled?: boolean;
  testID?: string;
}

const leftPosition = 2;
const rightPosition = 22;
const middlePosition = (leftPosition + rightPosition) / 2;
const duration = 250;

const getPosition = (value: boolean, isLoading: boolean) =>
  isLoading ? middlePosition : value ? rightPosition : leftPosition;

const Switch: React.FC<Props> = ({ value, disabled, onPress, isLoading }) => {
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
    ? { borderEndColor: colors.green, borderWidth: 4 }
    : {};

  return (
    <RN.TouchableWithoutFeedback
      onPress={press}
      disabled={disabled || isLoading}
    >
      <RN.Animated.View
        style={[
          styles.track,
          {
            backgroundColor: animation.interpolate({
              inputRange: [leftPosition, rightPosition],
              outputRange: [colors.lightestGray, colors.blue],
            }),
          },
        ]}
      >
        <RN.Animated.View
          style={[
            styles.knob,
            { left: animation },
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
      </RN.Animated.View>
    </RN.TouchableWithoutFeedback>
  );
};

const styles = RN.StyleSheet.create({
  track: {
    height: 30,
    width: 50,
    borderRadius: 15,
    backgroundColor: colors.blue,
  },
  knob: {
    position: 'absolute',
    left: 2,
    top: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.white,
    borderColor: colors.gray,
    borderWidth: 2,
    zIndex: 1,
  },
});

export default Switch;
