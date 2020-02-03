import React from 'react';
import RN from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';

import { gradients } from '../components/colors';
import shadow from '../components/shadow';

type Props = {
  TitleComponent: React.ReactElement;
  gradient: string[];
};

const TitledContainer: React.FC<Props> = ({
  gradient,
  TitleComponent,
  children,
}) => {
  return (
    <LinearGradient style={styles.background} colors={gradients.whitegray}>
      <RN.View style={styles.shadow}>
        <LinearGradient style={styles.blob} colors={gradient}>
          <SafeAreaView forceInset={{ top: 'always' }}>
            {TitleComponent}
          </SafeAreaView>
        </LinearGradient>
      </RN.View>
      {children}
    </LinearGradient>
  );
};
const styles = RN.StyleSheet.create({
  background: {
    flex: 1,
  },
  shadow: {
    ...shadow(7),
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    zIndex: 2,
  },
  blob: {
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TitledContainer;
