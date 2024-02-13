import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as option from 'fp-ts/lib/Option';

import * as state from '../../state';
import * as actions from '../../state/actions';
import * as authApi from '../../api/auth';

import { StackScreenProps } from '@react-navigation/stack';
import { StackRoutes } from '..';

import OnboardingBackground from '../components/OnboardingBackground';
import LoginCard from '../components/LoginCard';

export type SignInRoute = {
  'Onboarding/SignIn': {};
};

type StateProps = {
  accessToken: state.AppState['accessToken'];
  loginState: state.AppState['login'];
};
type DispatchProps = {
  login: (creds: authApi.Credentials) => void | undefined;
};
type OwnProps = StackScreenProps<StackRoutes, 'Onboarding/SignIn'>;
type Props = StateProps & DispatchProps & OwnProps;

const SignIn = (props: Props) => {
  React.useEffect(() => {
    if (option.isSome(props.accessToken.currentToken)) {
      props.navigation.navigate('Main/Tabs', {});
    }
  }, [props.accessToken]);

  const goBack = () => {
    props.navigation.goBack();
  };

  const onLogin = (credentials: authApi.Credentials) => {
    props.login(credentials);
  };

  return (
    <OnboardingBackground testID="onboarding.signIn.view">
      <LoginCard
        style={styles.card}
        remoteAction={props.loginState}
        titleMessageId="onboarding.signIn.title"
        nextMessageId="onboarding.signIn.button"
        getErrorMessageId={() => 'onboarding.signIn.failure'}
        onPressBack={goBack}
        onPressNext={onLogin}
      />
    </OnboardingBackground>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    flex: 1,
  },
});

export default ReactRedux.connect<
  StateProps,
  DispatchProps,
  OwnProps,
  state.AppState
>(
  ({ accessToken, login }) => ({ accessToken, loginState: login }),
  (dispatch: redux.Dispatch<actions.Action>) => ({
    login: (payload: authApi.Credentials) => {
      dispatch({ type: 'login/start', payload });
    },
  }),
)(SignIn);
