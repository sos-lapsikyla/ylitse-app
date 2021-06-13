// Idea from https://ethercreative.github.io/react-native-shadow-generator/

import RN from 'react-native';

function interpolate(
  input: number,
  inputRange: [number, number],
  outputRange: [number, number],
): number {
  const inputRangeLen = inputRange[1] - inputRange[0];
  const outputRangeLen = outputRange[1] - outputRange[0];
  const multiplier = outputRangeLen / inputRangeLen;
  const value = input - inputRange[0];

  return value * multiplier;
}

function shadow(value?: number): RN.ViewStyle {
  const shadowRadius = value || 7;
  const shadowRadiusRange: [number, number] = [1, 16];
  const elevation = interpolate(shadowRadius, shadowRadiusRange, [1, 24]);

  const shadowOffset = {
    width: 0,
    height: interpolate(shadowRadius, shadowRadiusRange, [1, 12]),
  };

  const shadowOpacity = interpolate(
    shadowRadius,
    shadowRadiusRange,
    [0.18, 0.58],
  );

  return {
    shadowColor: '#000',
    shadowRadius,
    elevation,
    shadowOffset,
    shadowOpacity,
  };
}

export const textShadow = {
  ...shadow(2),
  textShadowOffset: { width: 0, height: 2 },
  textShadowRadius: 2,
  textShadowColor: 'rgba(0,0,0,0.25)',
  shadowColor: 'rgba(0,0,0,0.25)',
};

export default shadow;
