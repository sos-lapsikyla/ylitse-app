import React from 'react';
import RN from 'react-native';

import colors from './colors';

export default ({ style, ...props }: Omit<RN.ImageProps, 'source'>) => {
  const spinState = React.useRef(new RN.Animated.Value(0)).current;
  const spin = () =>
    RN.Animated.loop(
      RN.Animated.timing(spinState, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: RN.Easing.linear,
      }),
    ).start();
  React.useEffect(spin, []);
  return (
    <RN.Animated.Image
      {...props}
      source={require('../images/cog.svg')}
      resizeMode="cover"
      style={[
        styles.spinner,
        style,
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
      ]}
    />
  );
};

const styles = RN.StyleSheet.create({
  spinner: {
    tintColor: colors.darkestBlue,
  },
});
