import React from 'react';
import * as RN from 'react-native';

import fonts from '../../fonts';
import shadow from '../../shadow';
type Props = {
  text: string;
  value: number;
  style: RN.StyleProp<RN.ViewStyle>;
  onPress: (value: number) => void;
};

export const ValueButton: React.FC<Props> = ({
  value,
  text,
  style,
  onPress,
}) => (
  <RN.Pressable
    style={({ pressed }) =>
      pressed ? { opacity: 0.9, ...styles.pressable } : styles.pressable
    }
    onPress={() => onPress(value)}
  >
    <RN.View style={[styles.button, style]}>
      <RN.Text style={styles.text}>{text}</RN.Text>
    </RN.View>
  </RN.Pressable>
);

const styles = RN.StyleSheet.create({
  pressable: { flex: 1 },
  button: {
    padding: 8,
    borderRadius: 16,
    marginRight: 12,
    ...shadow(4),
  },
  text: {
    ...fonts.regularBold,
    textAlign: 'center',
  },
});
