import React from 'react';
import * as RN from 'react-native';

import fonts from '../../fonts';
import shadow from '../../shadow';
type Props = {
  text: string;
  value: number;
  style: RN.StyleProp<RN.ViewStyle>;
};

export const Button: React.FC<Props> = ({ value, text, style }) => {
  return (
    <RN.Pressable
      style={({ pressed }) =>
        pressed ? { opacity: 0.9, ...styles.pressable } : styles.pressable
      }
      onPress={() => console.log('value', value)}
    >
      <RN.View style={[styles.button, style]}>
        <RN.Text style={styles.text}>{text}</RN.Text>
      </RN.View>
    </RN.Pressable>
  );
};

const styles = RN.StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 16,
    marginRight: 12,
    ...shadow(4),
  },
  pressable: { flex: 1 },
  text: {
    ...fonts.regularBold,
    textAlign: 'center',
  },
});
