import React from 'react';
import RN from 'react-native';
import { SafeAreaView } from 'react-navigation';

import * as navigationProps from '../../lib/navigation-props';

import Background from '../components/Background';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors, { gradients } from '../components/colors';
import InputField from '../components/InputField';
import Button from '../components/Button';

export type SignUpRoute = {
  'Onboarding/SignUp': {};
};

type OwnProps = navigationProps.NavigationProps<SignUpRoute, SignUpRoute>;

const SignUp = (props: OwnProps) => {
  const goBack = () => {
    props.navigation.goBack();
  };
  const onSignUp = () => {};

  return (
    <Background>
      <SafeAreaView
        style={styles.container}
        forceInset={{ top: 'always', bottom: 'always' }}
      >
        <Card style={styles.card}>
          <Message style={styles.title} id="onboarding.signUp.title" />
          <InputField
            style={styles.nickNameInput}
            name="onboarding.signUp.nickName"
          />
          <InputField
            style={styles.passwordInput}
            name="onboarding.signUp.password"
          />
          <RN.View style={styles.buttonContainer}>
            <Button
              gradient={gradients.pillBlue}
              messageId="onboarding.signUp.back"
              onPress={goBack}
            />
            <Button
              style={styles.signUpButton}
              messageId="onboarding.signUp.signUp"
              onPress={onSignUp}
            >
              <RN.Image
                style={styles.arrow}
                source={require('../images/arrow.svg')}
              />
            </Button>
          </RN.View>
        </Card>
      </SafeAreaView>
    </Background>
  );
};

const styles = RN.StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 8,
  },
  card: {
    padding: 24,
    alignSelf: 'stretch',
  },
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
  arrow: {
    marginLeft: 8,
  },
});

export default SignUp;
