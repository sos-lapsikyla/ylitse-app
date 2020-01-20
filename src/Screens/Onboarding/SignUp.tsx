import React from 'react';
import RN from 'react-native';

import * as navigationProps from '../../lib/navigation-props';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors, { gradients } from '../components/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';

export type SignUpRoute = {
  'Onboarding/SignUp': {};
};

interface SignUpCardProps extends RN.ViewProps {
  goBack: () => void | undefined;
  onSignUp: () => void | undefined;
}

const SignUpCard = ({ goBack, onSignUp, ...viewProps }: SignUpCardProps) => (
  <Card {...viewProps}>
    <Message style={signUpCardStyles.title} id="onboarding.signUp.title" />
    <InputField
      style={signUpCardStyles.nickNameInput}
      name="onboarding.signUp.nickName"
    />
    <InputField
      style={signUpCardStyles.passwordInput}
      name="onboarding.signUp.password"
    />
    <RN.View style={signUpCardStyles.buttonContainer}>
      <Button
        style={signUpCardStyles.signUpButton}
        messageId="onboarding.signUp.signUp"
        onPress={onSignUp}
        hasArrow={true}
      />
      <Button
        gradient={[colors.faintGray, colors.faintGray]}
        messageId="onboarding.signUp.back"
        onPress={goBack}
      />
    </RN.View>
  </Card>
);

const signUpCardStyles = RN.StyleSheet.create({
  title: {
    ...fonts.titleBold,
    textAlign: 'center',
    color: colors.deepBlue,
    marginBottom: 40,
  },
  nickNameInput: {
    marginBottom: 24,
  },
  passwordInput: {
    marginBottom: 40,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flexDirection: 'column',
  },
  signUpButton: {
    flexGrow: 1,
    marginBottom: 16,
  },
});

type OwnProps = navigationProps.NavigationProps<SignUpRoute, SignUpRoute>;

const SignUp = (props: OwnProps) => {
  const goBack = () => {
    props.navigation.goBack();
  };
  const onSignUp = () => {};

  return (
    <OnboardingBackground>
      <SignUpCard style={styles.card} goBack={goBack} onSignUp={onSignUp} />
      <Card style={styles.card}>
        <Message
          style={styles.loginOldTitle}
          id="onboarding.signUp.existingAccount.title"
        />
        <Button
          onPress={() => {}}
          messageId="onboarding.signUp.existingAccount.login"
          gradient={gradients.faintGray}
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
