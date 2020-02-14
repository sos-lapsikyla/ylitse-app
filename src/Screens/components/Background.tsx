import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import colors, { gradients } from './colors';

interface Props extends RN.ViewProps {}

const Background: React.FC<Props> = ({ children, ...ViewProps }) => (
  <RN.View style={styles.container} {...ViewProps}>
    <LinearGradient style={styles.blob} colors={gradients.blue} />
    <RN.View style={styles.filler} />
    <RN.View style={styles.child}>{children}</RN.View>
  </RN.View>
);

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.haze,
  },
  blob: {
    flex: 1,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  filler: {
    flex: 1,
  },
  child: {
    ...RN.StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
});

export default Background;
