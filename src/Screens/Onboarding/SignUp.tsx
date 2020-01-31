import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as state from '../../state';
import * as accountApi from '../../api/account';
import * as authApi from '../../api/auth';

import * as navigationProps from '../../lib/navigation-props';
import assertNever from '../../lib/assert-never';

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

type StateProps = {
  credentialsSanityCheck: state.State['credentialsSanityCheck'];
};
type DispatchProps = {
  checkCredentials: (credentials: authApi.Credentials) => void | undefined;
  resetCredentialsCheck: () => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<
  SignUpRoute,
  SignInRoute & TabsRoute & DisplayNameRoute
>;
type Props = StateProps & DispatchProps & OwnProps;

const SignUp = ({
  navigation,
  checkCredentials,
  credentialsSanityCheck,
  resetCredentialsCheck,
}: Props) => {
  React.useEffect(() => resetCredentialsCheck(), []);
  React.useEffect(() => {
    if (credentialsSanityCheck.type === 'Ok') {
      navigation.navigate('Onboarding/DisplayName', {});
    }
  }, [credentialsSanityCheck]);
  const goBack = () => {
    navigation.goBack();
  };
  const onSignUp = (credentials: authApi.Credentials) => {
    checkCredentials(credentials);
  };
  const navigateLogin = () => {
    navigation.navigate('Onboarding/SignIn', {});
  };

  const getErrorMessageId = (u: unknown) => {
    const { tag } = accountApi.credentialsSanityCheckErrorHandler(u);
    switch (tag) {
      case 'UnknownError':
        return 'onboarding.signUp.error.probablyNetwork';
      case 'UserNameTooLong':
        return 'onboarding.signUp.error.userNameLong';
      case 'UserNameTooShort':
        return 'onboarding.signUp.error.userNameShort';
      case 'UserNameTaken':
        return 'onboarding.signUp.error.userNameTaken';
      case 'PasswordTooShort':
        return 'onboarding.signUp.error.passwordShort';
      case 'PasswordTooLong':
        return 'onboarding.signUp.error.passwordLong';
      default:
        assertNever(tag);
    }
  };
  return (
    <OnboardingBackground>
      <LoginCard
        style={styles.card}
        titleMessageId="onboarding.signUp.title"
        nextMessageId="onboarding.signUp.signUp"
        getErrorMessageId={getErrorMessageId}
        onPressBack={goBack}
        onPressNext={onSignUp}
        remoteAction={credentialsSanityCheck}
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

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.State
>(
  ({ credentialsSanityCheck }) => ({ credentialsSanityCheck }),
  (dispatch: redux.Dispatch<state.Action>) => ({
    checkCredentials: (newUser: authApi.Credentials) => {
      dispatch(state.actions.requestCredentialsSanityCheck([newUser]));
    },
    resetCredentialsCheck: () => {
      dispatch(state.actions.resetCredentialsSanityCheck());
    },
  }),
)(SignUp);
