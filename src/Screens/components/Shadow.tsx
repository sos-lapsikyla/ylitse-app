import React from 'react';
import RN from 'react-native';

interface Props extends RN.ViewProps {
  shadowRadius?: number; // in range [1, 16]
}

function interpolate(input: number, inputRange: [number, number], outputRange: [number, number]): number {
    const inputRangeLen = inputRange[1] - inputRange[0];
    const outputRangeLen = outputRange[1] - outputRange[0];

    const multiplier = outputRangeLen / inputRangeLen;

    const value = input - inputRange[0];

    return value * multiplier;
}


const Shadow: React.FC<Props> = ({ style, shadowRadius: value, children, ...viewProps }) => {
  const shadowRadius = value ?? 7;
  const shadowRadiusRange: [number, number] = [1, 16];
  const elevation = interpolate(shadowRadius, shadowRadiusRange, [1, 24]);
  const shadowOffset = {
    width: 0,
    height: interpolate(shadowRadius, shadowRadiusRange, [1, 12]),
  };
  const shadowOpacity = interpolate(shadowRadius, shadowRadiusRange, [0.18, 0.58]);

  const shadowStyle = {
      shadowColor: "#000",
      shadowRadius,
      elevation,
      shadowOffset,
      shadowOpacity
  };

  return (
      <RN.View
        style={[shadowStyle, style]}
        {...viewProps}
      >
        {children}
      </RN.View>
  )
}

export default Shadow;
