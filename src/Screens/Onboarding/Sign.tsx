import React from 'react';
import RN from 'react-native';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import MessageButton from '../components/MessageButton';
import fonts from '../components/fonts';

export type SignRoute = {
  'Onboarding/Sign': {};
};

type Props = StackScreenProps<StackRoutes, 'Onboarding/Sign'>;

export default ({ navigation }: Props) => {
  const navigateSignUp = () => {
    navigation.navigate('Onboarding/SignUp', {});
  };

  const navigateSignIn = () => {
    navigation.navigate('Onboarding/SignIn', {});
  };

  const goBack = () => {
    navigation.goBack();
  };

  return (
    <OnboardingBackground testID="onboarding.sign.view">
      <Card style={styles.card}>
        <MessageButton
          messageId="onboarding.sign.up"
          messageStyle={styles.signText}
          style={styles.button}
          onPress={navigateSignUp}
          testID="onboarding.sign.up"
        />
        <MessageButton
          messageId="onboarding.sign.in"
          messageStyle={styles.signText}
          style={styles.button}
          onPress={navigateSignIn}
          testID="onboarding.sign.in"
        />
        <MessageButton
          style={styles.button}
          messageId="meta.back"
          messageStyle={styles.signText}
          onPress={goBack}
          emphasis="low"
          testID="onboarding.back"
        />
      </Card>
    </OnboardingBackground>
  );
};

const styles = RN.StyleSheet.create({
  signText: {
    ...fonts.titleBold,
  },
  card: {
    marginTop: 64,
    display: 'flex',
    flexDirection: 'column',
    gap: 64,
    padding: 64,
    alignSelf: 'stretch',
    zIndex: 2,
  },
  button: {
    minHeight: 64,
  },
});
