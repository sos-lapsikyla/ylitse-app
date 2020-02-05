import React from 'react';
import RN from 'react-native';

import * as accountApi from '../../api/account';
import * as authApi from '../../api/auth';

import * as navigationProps from '../../lib/navigation-props';
import useRemoteData from '../../lib/use-remote-data';
import * as remoteData from '../../lib/remote-data';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import { gradients } from '../components/colors';
import Button from '../components/Button';
import LoginCard from '../components/LoginCard';

import { TabsRoute } from '../Main/Tabs';

import { DisplayNameRoute } from './DisplayName';
import { SignInRoute } from './SignIn';

export type SignUpRoute = {
  'Onboarding/SignUp': {};
};

type Props = navigationProps.NavigationProps<
  SignUpRoute,
  SignInRoute & TabsRoute & DisplayNameRoute
>;
const SignUp = ({ navigation }: Props) => {
  const [
    credentialsCheck,
    checkCredentials,
    resetCredentialsCheck,
  ] = useRemoteData(accountApi.checkCredentials);

  React.useEffect(() => {
    if (credentialsCheck.type === 'Ok') {
      resetCredentialsCheck();
      navigation.navigate('Onboarding/DisplayName', {
        credentials: credentialsCheck.value,
      });
    }
  }, [credentialsCheck.type]);

  const goBack = () => {
    navigation.goBack();
  };
  const onSignUp = (credentials: authApi.Credentials) => {
    checkCredentials(credentials);
  };
  const navigateLogin = () => {
    navigation.navigate('Onboarding/SignIn', {});
  };

  const getErrorMessageId = () =>
    remoteData.unwrapErr(
      credentialsCheck,
      ({ errorMessageId }) => errorMessageId,
      'meta.blank',
    );

  return (
    <OnboardingBackground>
      <LoginCard
        style={styles.card}
        titleMessageId="onboarding.signUp.title"
        nextMessageId="onboarding.signUp.signUp"
        getErrorMessageId={getErrorMessageId}
        onPressBack={goBack}
        onPressNext={onSignUp}
        remoteAction={credentialsCheck}
        onChange={resetCredentialsCheck}
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
  card: { marginVertical: 24, padding: 24, alignSelf: 'stretch', zIndex: 2 },
  loginOldTitle: {
    ...fonts.largeBold,
    textAlign: 'center',
    marginBottom: 24,
  },
});

export default SignUp;
