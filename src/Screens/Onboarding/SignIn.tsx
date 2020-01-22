import React from 'react';
import RN from 'react-native';

import * as navigationProps from '../../lib/navigation-props';

import OnboardingBackground from '../components/OnboardingBackground';
import LoginCard from '../components/LoginCard';

export type SignInRoute = {
  'Onboarding/SignIn': {};
};

type OwnProps = navigationProps.NavigationProps<SignInRoute, SignInRoute>;

const SignIn = (props: OwnProps) => {
  const goBack = () => {
    props.navigation.goBack();
  };
  const onSignUp = () => {};

  return (
    <OnboardingBackground>
      <LoginCard
        style={styles.card}
        titleMessageId="onboarding.signIn.title"
        nextMessageId="onboarding.signIn.button"
        onPressBack={goBack}
        onPressNext={onSignUp}
      />
    </OnboardingBackground>
  );
};

const styles = RN.StyleSheet.create({
  card: { marginVertical: 24, padding: 24, alignSelf: 'stretch' },
});

export default SignIn;
