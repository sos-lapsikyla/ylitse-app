import React from 'react';
import RN from 'react-native';

import colors from './colors';

export interface Props {
  value: boolean;
  onPress?: (newValue: boolean) => void;
  disabled?: boolean;
  testID?: string;
}

const leftPosition = 2;
const rightPosition = 22;
const duration = 250;

const getPosition = (value: boolean) => (value ? rightPosition : leftPosition);

const Switch: React.FC<Props> = ({ value, disabled, onPress: onPressProp }) => {
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

  const onPress = () => {
    if (onPressProp) {
      requestAnimationFrame(() => onPressProp(!value));
    }
  };

  return (
    <RN.TouchableWithoutFeedback onPress={onPress} disabled={disabled}>
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
        <RN.Animated.View style={[styles.knob, { left: animation }]} />
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
