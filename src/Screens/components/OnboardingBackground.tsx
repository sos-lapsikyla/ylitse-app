import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import Background from './Background';
import CreatedBySosBanner from '../components/CreatedBySosBanner';
import AppTitle from '../components/AppTitle';

type Props = RN.ViewProps;

const OnboardinBackground: React.FC<Props> = ({ children, ...viewProps }) => (
  <Background {...viewProps}>
    <AppTitle style={styles.appTitle} />
    <CreatedBySosBanner style={styles.banner} />
    <RN.KeyboardAvoidingView style={styles.keyboardAvoider} behavior="height">
      <RN.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
      >
        <SafeAreaView
          style={styles.container}
          forceInset={{ top: 'always', bottom: 'always' }}
        >
          {children}
        </SafeAreaView>
      </RN.ScrollView>
    </RN.KeyboardAvoidingView>
  </Background>
);

const styles = RN.StyleSheet.create({
  appTitle: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
    zIndex: 1,
  },
  banner: { position: 'absolute', bottom: 16, alignSelf: 'center' },
  keyboardAvoider: {
    flex: 1,
    zIndex: 2,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 160,
    paddingBottom: 40,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default OnboardinBackground;
