import React from 'react';
import RN from 'react-native';

import colors from './colors';

interface Props extends RN.ViewProps {
  variant?: 'main' | 'secondary';
}

const Background: React.FC<Props> = ({
  children,
  variant = 'main',
  ...ViewProps
}) => (
  <RN.View style={styles.container} {...ViewProps}>
    <RN.View
      style={[
        styles.blob,
        { backgroundColor: variant === 'main' ? colors.purple : colors.blue },
      ]}
    />
    <RN.View style={styles.filler} />
    <RN.View style={styles.child}>{children}</RN.View>
  </RN.View>
);

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
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
