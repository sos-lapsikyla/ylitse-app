import React from 'react';
import RN from 'react-native';

import * as navigationProps from '../../lib/navigation-props';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import { gradients } from '../components/colors';
import Button from '../components/Button';
import LoginCard from '../components/LoginCard';

import { SignInRoute } from './SignIn';

export type SignUpRoute = {
  'Onboarding/SignUp': {};
};

type OwnProps = navigationProps.NavigationProps<SignUpRoute, SignInRoute>;

const SignUp = ({ navigation }: OwnProps) => {
  const goBack = () => {
    navigation.goBack();
  };
  const onSignUp = () => {};
  const navigateLogin = () => {
    navigation.navigate('Onboarding/SignIn', {});
  };

  return (
    <OnboardingBackground>
      <LoginCard
        style={styles.card}
        titleMessageId="onboarding.signUp.title"
        nextMessageId="onboarding.signUp.signUp"
        onPressBack={goBack}
        onPressNext={onSignUp}
      />
      <Card style={styles.card}>
        <Message
          style={styles.loginOldTitle}
          id="onboarding.signUp.existingAccount.title"
        />
        <Button
          onPress={navigateLogin}
          messageId="onboarding.signUp.existingAccount.login"
          gradient={gradients.faintGray}
          noShadow={true}
        />
      </Card>
    </OnboardingBackground>
  );
};

const styles = RN.StyleSheet.create({
  card: { marginVertical: 24, padding: 24, alignSelf: 'stretch' },
  loginOldTitle: {
    ...fonts.largeBold,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default SignUp;
