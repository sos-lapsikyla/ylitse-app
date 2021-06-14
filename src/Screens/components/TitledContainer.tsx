import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import colors from '../components/colors';
import shadow from '../components/shadow';

type Props = RN.ViewProps & {
  TitleComponent: React.ReactElement;
  color: string;
};

const TitledContainer: React.FC<Props> = ({
  color,
  TitleComponent,
  onLayout,
  children,
}) => {
  return (
    <RN.View style={styles.background} onLayout={onLayout}>
      <RN.View style={[styles.shadow, { backgroundColor: color }]}>
        <SafeAreaView forceInset={{ top: 'always' }}>
          {TitleComponent}
        </SafeAreaView>
      </RN.View>
      {children}
    </RN.View>
  );
};

const styles = RN.StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: colors.background,
  },
  shadow: {
    ...shadow(7),
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 2,
    alignSelf: 'stretch',
    justifyContent: 'center',
  },
});

export default TitledContainer;
