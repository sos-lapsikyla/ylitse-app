import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import AppTitle from '../components/AppTitle';
import Background from '../components/Background';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import CreatedBySosBanner from '../components/CreatedBySosBanner';
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
        gradient={[colors.faintGray, colors.faintGray]}
        messageId="onboarding.signUp.back"
        onPress={goBack}
      />
      <Button
        style={signUpCardStyles.signUpButton}
        messageId="onboarding.signUp.signUp"
        onPress={onSignUp}
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
    flexDirection: 'row',
  },
  signUpButton: {
    flexGrow: 1,
    marginLeft: 16,
  },
});

type OwnProps = navigationProps.NavigationProps<SignUpRoute, SignUpRoute>;

const SignUp = (props: OwnProps) => {
  const goBack = () => {
    props.navigation.goBack();
  };
  const onSignUp = () => {};

  return (
    <Background>
      <AppTitle style={styles.appTitle} />
      <CreatedBySosBanner style={styles.banner} />
      <RN.KeyboardAvoidingView style={styles.keyboardAvoider} behavior="height">
        <RN.ScrollView contentContainerStyle={styles.scrollContent}>
          <SafeAreaView
            style={styles.container}
            forceInset={{ top: 'always', bottom: 'always' }}
          >
            <SignUpCard
              style={styles.card}
              goBack={goBack}
              onSignUp={onSignUp}
            />
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
          </SafeAreaView>
        </RN.ScrollView>
      </RN.KeyboardAvoidingView>
    </Background>
  );
};

const styles = RN.StyleSheet.create({
  keyboardAvoider: {
    flex: 1,
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
    paddingHorizontal: 8,
  },
  appTitle: {
    position: 'absolute',
    top: 40,
    alignSelf: 'center',
  },
  banner: { position: 'absolute', bottom: 16, alignSelf: 'center' },
  card: { marginVertical: 24, padding: 24, alignSelf: 'stretch' },
  loginOldTitle: {
    ...fonts.largeBold,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default SignUp;
