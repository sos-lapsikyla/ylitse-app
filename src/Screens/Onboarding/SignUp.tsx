import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as state from '../../state';
import * as accountApi from '../../api/account';

import * as navigationProps from '../../lib/navigation-props';
import * as remoteData from '../../lib/remote-data';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import { gradients } from '../components/colors';
import Button from '../components/Button';
import LoginCard from '../components/LoginCard';

import { SignInRoute } from './SignIn';
import { BuddyListRoute } from './BuddyList';

export type SignUpRoute = {
  'Onboarding/SignUp': {};
};

type StateProps = {
  accessToken: state.State['accessToken'];
};
type DispatchProps = {
  createUser: (newUser: accountApi.NewUser) => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<
  SignUpRoute,
  SignInRoute & BuddyListRoute
>;
type Props = StateProps & DispatchProps & OwnProps;

const SignUp = ({ navigation, createUser, accessToken }: Props) => {
  React.useEffect(() => {
    if (remoteData.isSuccess(accessToken)) {
      navigation.navigate('BuddyList', {});
    }
  }, [accessToken]);
  const goBack = () => {
    navigation.goBack();
  };
  const onSignUp = (user: accountApi.NewUser) => {
    createUser(user);
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
        onPressBack={goBack}
        onPressNext={onSignUp}
        remoteAction={accessToken}
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
  card: { marginVertical: 24, padding: 24, alignSelf: 'stretch' },
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
  ({ accessToken }) => ({ accessToken }),
  (dispatch: redux.Dispatch<state.Action>) => ({
    createUser: (newUser: accountApi.NewUser) => {
      dispatch(state.actions.createUser([newUser]));
    },
  }),
)(SignUp);
