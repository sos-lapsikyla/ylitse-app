import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as state from '../../state';
// import * as accountApi from '../../api/account';
import * as authApi from '../../api/auth';

import * as navigationProps from '../../lib/navigation-props';
// import * as remoteData from '../../lib/remote-data';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import { gradients } from '../components/colors';
import Button from '../components/Button';
import LoginCard from '../components/LoginCard';

import { TabsRoute } from '../Main/Tabs';

import { SignInRoute } from './SignIn';
// import navigateMain from './navigateMain';

export type SignUpRoute = {
  'Onboarding/SignUp': {};
};

type StateProps = {
  newCredentialsSanityCheck: state.State['newCredentialsSanityCheck'];
};
type DispatchProps = {
  checkCredentials: (credentials: authApi.Credentials) => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<
  SignUpRoute,
  SignInRoute & TabsRoute
>;
type Props = StateProps & DispatchProps & OwnProps;

const SignUp = ({
  navigation,
  checkCredentials,
  newCredentialsSanityCheck,
}: Props) => {
  // React.useEffect(() => {
  //   if (remoteData.isSuccess(accessToken)) {
  //     navigateMain(navigation);
  //   }
  // }, [accessToken]);
  const goBack = () => {
    navigation.goBack();
  };
  const onSignUp = (credentials: authApi.Credentials) => {
    checkCredentials(credentials);
  };
  const navigateLogin = () => {
    navigation.navigate('Onboarding/SignIn', {});
  };
  return (
    <OnboardingBackground>
      <LoginCard
        style={styles.card}
        titleMessageId="onboarding.signUp.title"
        nextMessageId="onboarding.signUp.signUp"
        errorMessageId="onboarding.signUp.errorMessageId"
        onPressBack={goBack}
        onPressNext={onSignUp}
        remoteAction={newCredentialsSanityCheck}
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
  ({ newCredentialsSanityCheck }) => ({ newCredentialsSanityCheck }),
  (dispatch: redux.Dispatch<state.Action>) => ({
    checkCredentials: (newUser: authApi.Credentials) => {
      dispatch(state.actions.requestCredentialsSanityCheck([newUser]));
    },
  }),
)(SignUp);
