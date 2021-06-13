import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';
import * as option from 'fp-ts/lib/Option';

import * as state from '../../state';
import * as actions from '../../state/actions';
import * as authApi from '../../api/auth';

import * as navigationProps from '../../lib/navigation-props';

import OnboardingBackground from '../components/OnboardingBackground';
import LoginCard from '../components/LoginCard';

import navigateMain from './navigateMain';
import { TabsRoute } from '../Main/Tabs';

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
type OwnProps = navigationProps.NavigationProps<SignInRoute, TabsRoute>;
type Props = StateProps & DispatchProps & OwnProps;

const SignIn = (props: Props) => {
  React.useEffect(() => {
    if (option.isSome(props.accessToken.currentToken)) {
      navigateMain(props.navigation);
    }
  }, [props.accessToken]);

  const goBack = () => {
    props.navigation.goBack();
  };

  const onLogin = (credentials: authApi.Credentials) => {
    props.login(credentials);
  };

  // React.useEffect(() => {
  //   props.login({ userName: 'test', password: 'test' });
  // }, []);
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
  card: { marginVertical: 24, padding: 24, alignSelf: 'stretch' },
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
