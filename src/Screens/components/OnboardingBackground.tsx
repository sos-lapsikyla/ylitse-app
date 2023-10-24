import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { isDevice } from '../../lib/isDevice';

import Background from './Background';
import CreatedBySosBanner from '../components/CreatedBySosBanner';
import AppTitle from '../components/AppTitle';

type Props = RN.ViewProps;

const OnboardinBackground: React.FC<Props> = ({
  children,
  testID,
  ...viewProps
}) => (
  <Background {...viewProps}>
    <AppTitle style={styles.appTitle} />
    <CreatedBySosBanner style={styles.banner} />
    <RN.KeyboardAvoidingView style={styles.keyboardAvoider} behavior="height">
      <RN.ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        testID={testID}
      >
        <SafeAreaView style={styles.container}>{children}</SafeAreaView>
      </RN.ScrollView>
    </RN.KeyboardAvoidingView>
  </Background>
);

const styles = RN.StyleSheet.create({
  appTitle: {
    position: 'absolute',
    top: isDevice('ios') ? 64 : 40,
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
