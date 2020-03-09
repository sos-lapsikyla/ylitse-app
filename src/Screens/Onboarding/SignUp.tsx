import React from 'react';
import RN from 'react-native';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/pipeable';

import * as accountApi from '../../api/account';
import * as authApi from '../../api/auth';

import * as localization from '../../localization';
import * as navigationProps from '../../lib/navigation-props';
import useRemoteData from '../../lib/use-remote-data';

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
    if (RD.isSuccess(credentialsCheck)) {
      resetCredentialsCheck();
      navigation.navigate('Onboarding/DisplayName', {
        credentials: credentialsCheck.value,
      });
    }
  }, [RD.isSuccess(credentialsCheck)]);

  const goBack = () => {
    navigation.goBack();
  };
  const onSignUp = (credentials: authApi.Credentials) => {
    checkCredentials(credentials);
  };
  const navigateLogin = () => {
    navigation.navigate('Onboarding/SignIn', {});
  };

  const getErrorMessageId: () => localization.MessageId = () =>
    pipe(
      credentialsCheck,
      RD.fold(
        () => localization.blank,
        () => localization.blank,
        ({ errorMessageId }) => errorMessageId,
        () => localization.blank,
      ),
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
