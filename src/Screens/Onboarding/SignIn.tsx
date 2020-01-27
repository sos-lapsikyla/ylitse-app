import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as state from '../../state';
import * as authApi from '../../api/auth';

import * as navigationProps from '../../lib/navigation-props';
import * as remoteData from '../../lib/remote-data';

import OnboardingBackground from '../components/OnboardingBackground';
import LoginCard from '../components/LoginCard';

import { TabsRoute } from '../Main/Tabs';

export type SignInRoute = {
  'Onboarding/SignIn': {};
};

type StateProps = {
  accessToken: state.State['accessToken'];
};
type DispatchProps = {
  login: (credentials: authApi.Credentials) => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<SignInRoute, TabsRoute>;
type Props = StateProps & DispatchProps & OwnProps;

const SignIn = (props: Props) => {
  React.useEffect(() => {
    if (remoteData.isSuccess(props.accessToken)) {
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
    <OnboardingBackground>
      <LoginCard
        style={styles.card}
        remoteAction={props.accessToken}
        titleMessageId="onboarding.signIn.title"
        nextMessageId="onboarding.signIn.button"
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
  state.State
>(
  ({ accessToken }) => ({ accessToken }),

  (dispatch: redux.Dispatch<state.Action>) => ({
    login: (credentials: authApi.Credentials) => {
      dispatch(state.actions.login([credentials]));
    },
  }),
)(SignIn);
