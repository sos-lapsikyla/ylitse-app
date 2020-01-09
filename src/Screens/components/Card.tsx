import React from 'react';
import RN from 'react-native';

import colors from './colors';

interface Props {
  style?: RN.ViewStyle;
}

const Card: React.FC<Props> = ({ children, style }) => (
  <RN.View style={[styles.container, style]}>{children}</RN.View>
);

const styles = RN.StyleSheet.create({
  container: {
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 24,
  },
});

export default Card;
