import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import colors from './colors';

const Background: React.FC = ({ children }) => (
  <RN.View style={styles.container}>
    <LinearGradient
      style={styles.blob}
      colors={[colors.lightBlue, colors.darkBlue]}
    />
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
