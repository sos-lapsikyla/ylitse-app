import React from 'react';
import RN from 'react-native';
import * as RD from '@devexperts/remote-data-ts';
import { pipe } from 'fp-ts/lib/function';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import * as accountApi from '../../api/account';
import * as authApi from '../../api/auth';

import * as localization from '../../localization';
import useRemoteData from '../../lib/use-remote-data';

import OnboardingBackground from '../components/OnboardingBackground';
import LoginCard from '../components/LoginCard';

export type SignUpRoute = {
  'Onboarding/SignUp': {};
};

type Props = StackScreenProps<StackRoutes, 'Onboarding/SignUp'>;

const SignUp = ({ navigation }: Props) => {
  const [credentialsCheck, checkCredentials, resetCredentialsCheck] =
    useRemoteData(accountApi.checkCredentials);

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
    <OnboardingBackground testID={'onboarding.signUp.view'}>
      <LoginCard
        style={styles.card}
        titleMessageId="onboarding.signUp.title"
        nextMessageId="onboarding.signUp.signUp"
        getErrorMessageId={getErrorMessageId}
        onPressBack={goBack}
        onPressNext={onSignUp}
        remoteAction={credentialsCheck}
        onChange={resetCredentialsCheck}
        isSignup
      />
    </OnboardingBackground>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    flex: 1,
    zIndex: 2,
  },
});

export default SignUp;
