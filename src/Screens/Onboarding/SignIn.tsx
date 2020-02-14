import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as state from '../../state';
import * as actions from '../../state/actions';
import * as authApi from '../../api/auth';

import * as navigationProps from '../../lib/navigation-props';
import useRemoteData from '../../lib/use-remote-data';

import OnboardingBackground from '../components/OnboardingBackground';
import LoginCard from '../components/LoginCard';

import { TabsRoute } from '../Main/Tabs';

import navigateMain from './navigateMain';

export type SignInRoute = {
  'Onboarding/SignIn': {};
};

type StateProps = {
  accessToken: state.AppState['accessToken'];
};
type DispatchProps = {
  login: (token: authApi.AccessToken) => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<SignInRoute, TabsRoute>;
type Props = StateProps & DispatchProps & OwnProps;

const SignIn = (props: Props) => {
  const [loginRequest, login] = useRemoteData(authApi.login);
  React.useEffect(() => {
    if (loginRequest.type === 'Ok') {
      props.login(loginRequest.value);
    }
  }, [loginRequest.type]);
  React.useEffect(() => {
    if (props.accessToken.type === 'Some') {
      navigateMain(props.navigation);
    }
  }, [props.accessToken]);
  const goBack = () => {
    props.navigation.goBack();
  };
  const onLogin = (credentials: authApi.Credentials) => {
    login(credentials);
  };
  React.useEffect(() => login({ userName: 'test', password: 'test' }), []);
  return (
    <OnboardingBackground>
      <LoginCard
        style={styles.card}
        remoteAction={loginRequest}
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
  ({ accessToken }) => ({ accessToken }),

  (dispatch: redux.Dispatch<actions.Action>) => ({
    login: (token: authApi.AccessToken) => {
      dispatch(actions.creators.login(token));
    },
  }),
)(SignIn);
