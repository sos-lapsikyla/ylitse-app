import React from 'react';
import RN from 'react-native';

import colors from './colors';

type Props = {
  value: boolean;
  onPress: (value: boolean) => void;
  style?: RN.ViewStyle;
};

export const CheckBox: React.FC<Props> = ({ value, onPress, style }) => {
  const animation = React.useRef(new RN.Animated.Value(0)).current;

  const handlePress = () => {
    const toValue = value ? 0 : 1;
    RN.Animated.spring(animation, {
      toValue,
      friction: 3,
      useNativeDriver: true,
    }).start();
    onPress(!value);
  };

  const transform = {
    transform: [{ scale: animation }],
  };

  return (
    <RN.Pressable onPress={handlePress} style={[styles.box, style]}>
      <RN.Animated.View style={[transform]}>
        {value && (
          <RN.Image
            style={styles.checkIcon}
            source={require('../images/CheckBoxV.svg')}
          />
        )}
      </RN.Animated.View>
    </RN.Pressable>
  );
};

const styles = RN.StyleSheet.create({
  box: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 3,
    borderColor: colors.blue,
  },
  falseStyle: { borderWidth: 4, borderColor: colors.blueGray },
  checkIcon: {
    alignSelf: 'center',
    marginTop: 2,
    tintColor: colors.blue,
  },
});
