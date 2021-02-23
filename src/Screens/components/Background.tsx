import React from 'react';
import RN from 'react-native';

import colors from './colors';

interface Props extends RN.ViewProps {}

const Background: React.FC<Props> = ({ children, ...ViewProps }) => (
  <RN.View style={styles.container} {...ViewProps}>
    <RN.View style={styles.blob} />
    <RN.View style={styles.filler} />
    <RN.View style={styles.child}>{children}</RN.View>
  </RN.View>
);

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.lightestGray,
  },
  blob: {
    flex: 1,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: colors.lightBlue,
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
