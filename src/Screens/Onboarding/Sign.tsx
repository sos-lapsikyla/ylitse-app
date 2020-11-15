import React from 'react';
import RN from 'react-native';

import * as navigationProps from '../../lib/navigation-props';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import MessageButton from '../components/MessageButton';
import ButtonContainer from '../components/ButtonContainer';
import fonts from '../components/fonts';
import colors from '../components/colors';

import { SignInRoute } from './SignIn';
import { SignUpRoute } from './SignUp';

export type SignRoute = {
  'Onboarding/Sign': {};
};

type Props = navigationProps.NavigationProps<
  SignRoute,
  SignInRoute & SignUpRoute
>;
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
    <OnboardingBackground testID='onboarding.sign.view'>
      <Card style={styles.card}>
        <MessageButton
          messageId="onboarding.sign.up"
          messageStyle={styles.signText}
          style={styles.nextButton}
          onPress={navigateSignUp}
          testID='onboarding.sign.up'
        />
        <MessageButton
          messageId="onboarding.sign.in"
          messageStyle={styles.signText}
          style={styles.nextButton}
          onPress={navigateSignIn}
          testID='onboarding.sign.in'
        />
        <ButtonContainer style={styles.backButton} onPress={goBack}>
          <RN.Image source={require('../images/chevron-left.svg')} />
        </ButtonContainer>
      </Card>
    </OnboardingBackground>
  );
};

const styles = RN.StyleSheet.create({
  signText: {
    ...fonts.titleBold,
    color: colors.deepBlue,
  },
  card: {
    marginVertical: 24,
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 48,
    alignSelf: 'stretch',
    zIndex: 2,
  },
  nextButton: {
    minHeight: 64,
    marginBottom: 48,
  },
  backButton: {
    minHeight: 64,
    backgroundColor: colors.faintGray,
  },
});
