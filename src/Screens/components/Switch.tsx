import React from 'react';
import RN from 'react-native';
import { createMiddleColorAsHex } from 'src/lib/colorCalculator';

import colors from './colors';

export interface SwitchProps {
  value: boolean;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  testID?: string;
  style?: RN.ViewStyle;
}

type SwitchColors = {
  border: [string, string];
  knob: [string, string];
};

const height = 28;
const delimiter = (2 / 3) * height;
const trackLength = delimiter * 2.75;
const leftPosition = delimiter * 0.3;
const rightPosition = trackLength - 1.3 * delimiter;
const middlePosition = (leftPosition + rightPosition) / 2;
const duration = 400;

const itemBorderWidth = 1;
const loadingKnobBorderWidth = 0.15 * delimiter;

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

  const spinAnimation = React.useRef(new RN.Animated.Value(0)).current;

  const spin = () =>
    RN.Animated.loop(
      RN.Animated.timing(spinAnimation, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
        easing: RN.Easing.linear,
      }),
    ).start();

  const [showLoading, setShowLoading] = React.useState(false);

  React.useEffect(() => {
    if (isLoading) {
      const loadingTimeOut = setTimeout(() => setShowLoading(true), 400);

      return () => clearTimeout(loadingTimeOut);
    } else {
      setShowLoading(false);
      spinAnimation.stopAnimation();
    }
  }, [isLoading]);

  React.useEffect(() => {
    if (showLoading) {
      spin();
    }
  }, [showLoading]);

  const switchColors: SwitchColors = {
    border: disabled
      ? [colors.fadedGray, colors.fadedGray]
      : [colors.fadedGray, colors.purple],
    knob: disabled
      ? [colors.fadedGray, colors.fadedGray]
      : [colors.fadedGray, colors.purple],
  };

  const loadingBorderColor =
    RN.Platform.OS === 'ios'
      ? 'transparent'
      : createMiddleColorAsHex(switchColors.knob);

  const knobBorder = showLoading
    ? {
        borderRightColor: colors.green,
        borderLeftColor: loadingBorderColor,
        borderTopColor: loadingBorderColor,
        borderBottomColor: loadingBorderColor,
        borderWidth: loadingKnobBorderWidth,
      }
    : {
        borderColor: disabled ? colors.fadedGray : colors.purple,
        borderWidth: itemBorderWidth,
      };

  return (
    <RN.Pressable onPress={press} disabled={disabled} testID={testID}>
      <RN.Animated.View
        style={[
          styles.track,
          {
            backgroundColor: styles.track.backgroundColor,
            borderWidth: itemBorderWidth,
          },
          {
            borderColor: animation.interpolate({
              inputRange: [leftPosition, rightPosition],
              outputRange: switchColors.border,
            }),
          },
          style,
        ]}
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
                  rotate: spinAnimation.interpolate({
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
    </RN.Pressable>
  );
};

const styles = RN.StyleSheet.create({
  track: {
    height,
    width: trackLength,
    borderRadius: (delimiter * 1.5) / 2,
    backgroundColor: colors.white,
  },
  knob: {
    position: 'absolute',
    top: delimiter * 0.25 - itemBorderWidth,
    width: delimiter,
    height: delimiter,
    borderRadius: delimiter / 2,
    backgroundColor: colors.white,
    zIndex: 1,
  },
});

export default Switch;
