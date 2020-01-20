import React from 'react';
import RN from 'react-native';

import shadow from './shadow';
import colors from './colors';

interface Props extends RN.ViewProps {}

export const cardBorderRadius = 32;

const Card: React.FC<Props> = ({ children, style, ...viewProps }) => {
  return (
    <RN.View style={[styles.card, style]} {...viewProps}>
      {children}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    ...shadow(7),
    borderRadius: cardBorderRadius,
    backgroundColor: colors.white,
  },
});

export default Card;
