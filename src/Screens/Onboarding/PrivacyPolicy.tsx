import React from 'react';
import RN from 'react-native';
import * as redux from 'redux';
import * as ReactRedux from 'react-redux';

import * as accountApi from '../../api/account';
import * as state from '../../state';
import * as navigationProps from '../../lib/navigation-props';

import OnboardingBackground from '../components/OnboardingBackground';
import Card from '../components/Card';
import fonts from '../components/fonts';
import Message from '../components/Message';
import colors, { gradients } from '../components/colors';
import Button from '../components/Button';
import ImmediatelyNavigateBack from '../components/ImmediatelyNavigateBack';
import ErrorMessage from '../components/ErrorMessage';

import { TabsRoute } from '../Main/Tabs';
import navigateMain from './navigateMain';

export type PrivacyPolicyRoute = {
  'Onboarding/PrivacyPolicy': { displayName: string; email: string };
};

type StateProps = {
  credentialsSanityCheck: state.State['credentialsSanityCheck'];
  accessToken: state.State['accessToken'];
};
type DispatchProps = {
  createUser: (user: accountApi.NewUser) => void | undefined;
};
type OwnProps = navigationProps.NavigationProps<PrivacyPolicyRoute, TabsRoute>;

type Props = StateProps & DispatchProps & OwnProps;

const PrivacyPolicy = ({
  navigation,
  accessToken,
  credentialsSanityCheck,
  createUser,
}: Props) => {
  React.useEffect(() => {
    if (accessToken.type === 'Ok') {
      navigateMain(navigation);
    }
  }, [accessToken]);
  const [isAgreed, setAgreed] = React.useState(false);
  const goBack = () => {
    navigation.goBack();
  };
  if (credentialsSanityCheck.type !== 'Ok') {
    return <ImmediatelyNavigateBack goBack={goBack} />;
  }
  const onNextPress = () => {
    const {
      value: {
        credentials: { userName = '', password = '' },
      },
    } = credentialsSanityCheck;
    const user = {
      userName,
      password,
      displayName: navigation.getParam('displayName'),
      email: navigation.getParam('email'),
    };
    createUser(user);
  };
  return (
    <OnboardingBackground>
      <Card style={styles.card}>
        <Message style={styles.title} id="onboarding.privacyPolicy.title" />
        <Message
          style={styles.bodyText}
          id="onboarding.privacyPolicy.bodyText1"
        />
        <Message
          style={styles.bodyText}
          id="onboarding.privacyPolicy.bodyText2"
        />
        <Message
          style={styles.bodyText3}
          id="onboarding.privacyPolicy.bodyText3"
        />
        <ErrorMessage
          style={styles.errorText}
          getMessageId={() => 'meta.error'}
          data={accessToken}
        />
        <Button
          onPress={() => setAgreed(true)}
          gradient={gradients.pillBlue}
          style={styles.nextButton}
          messageId="onboarding.privacyPolicy.agreeButton"
          disabled={isAgreed}
        />
        <Button
          style={styles.nextButton}
          onPress={onNextPress}
          messageId="onboarding.privacyPolicy.nextButton"
          badge={require('../images/arrow.svg')}
          disabled={!isAgreed}
          loading={accessToken.type === 'Loading'}
        />
        <Button
          gradient={[colors.faintGray, colors.faintGray]}
          messageId="meta.back"
          onPress={goBack}
          noShadow={true}
        />
      </Card>
    </OnboardingBackground>
  );
};

const styles = RN.StyleSheet.create({
  card: {
    padding: 24,
    alignSelf: 'stretch',
  },
  title: {
    ...fonts.titleBold,
    textAlign: 'center',
    color: colors.deepBlue,
    marginBottom: 40,
  },
  nickNameInput: {
    marginBottom: 24,
  },
  bodyText: {
    ...fonts.regular,
    color: colors.deepBlue,
    marginBottom: 40,
  },
  bodyText3: {
    ...fonts.regular,
    color: colors.deepBlue,
    marginBottom: 16,
  },
  errorText: {
    marginBottom: 16,
  },
  nextButton: { marginBottom: 16 },
});

export default ReactRedux.connect<StateProps, {}, OwnProps, state.State>(
  ({ credentialsSanityCheck, accessToken }) => ({
    credentialsSanityCheck,
    accessToken,
  }),
  (dispatch: redux.Dispatch<state.Action>) => ({
    createUser: (user: accountApi.NewUser) => {
      dispatch(state.actions.createUser([user]));
    },
  }),
)(PrivacyPolicy);
