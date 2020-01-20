import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import shadow from './shadow';
import { gradients } from './colors';
import fonts from './fonts';

interface Props {
  onPress: () => void | undefined;
  colors?: string[];
  style?: RN.StyleProp<RN.ViewStyle>;
}

const Button: React.FC<Props> = ({ onPress, children, style, colors }) => {
  return (
    <RN.TouchableOpacity style={[styles.container, style]} onPress={onPress}>
      <LinearGradient
        style={styles.gradient}
        colors={colors ? colors : gradients.acidGreen}
      >
        {children}
      </LinearGradient>
    </RN.TouchableOpacity>
  );
};

const borderRadius = 16;
const styles = RN.StyleSheet.create({
  container: {
    alignSelf: 'stretch',
    borderRadius,
    ...shadow(7),
  },
  gradient: {
    padding: 8,
    borderRadius,
    flexDirection: 'row',
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignContent: 'center',
  },
  message: {
    textAlign: 'center',
    ...fonts.titleBold,
  },
});

export default Button;
