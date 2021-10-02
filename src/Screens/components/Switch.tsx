import React from 'react';
import RN from 'react-native';

import colors from './colors';

export interface SwitchProps {
  value: boolean;
  onPress: () => void;
  disabled?: boolean;
  testID?: string;
  style?: RN.ViewStyle;
}

const leftPosition = 6;
const rightPosition = 28;
const duration = 250;

const getPosition = (value: boolean) => (value ? rightPosition : leftPosition);

const Switch: React.FC<SwitchProps> = ({
  value,
  disabled,
  onPress,
  style,
  testID,
}) => {
  const animation = React.useRef(
    new RN.Animated.Value(getPosition(value)),
  ).current;

  React.useEffect(() => {
    RN.Animated.timing(animation, {
      duration,
      toValue: getPosition(value),
      useNativeDriver: false, // Colors are not supported by native driver
    }).start();
  }, [value]);

  const press = () => {
    requestAnimationFrame(() => onPress());
  };

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
          ]}
        />
      </RN.View>
    </RN.Pressable>
  );
};

const styles = RN.StyleSheet.create({
  track: {
    height: 30,
    width: 56,
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
