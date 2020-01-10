import React from 'react';
import RN from 'react-native';

import colors from './colors';
import Shadow from './Shadow';

interface Props {
  style?: RN.StyleProp<RN.ViewStyle>;
}

const Card: React.FC<Props> = ({ children, style }) => (
  <Shadow style={[styles.container, style]}>{children}</Shadow>
);

const styles = RN.StyleSheet.create({
  container: {
    borderRadius: 24,
    backgroundColor: colors.white,
    padding: 24,
  },
});

export default Card;
